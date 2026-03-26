import { useState, useRef } from "react";
import { Check, Lock, Upload, AlertTriangle, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const benefits = [
  "Full access to our online store",
  "Members-only lounge access",
  "Priority service and exclusive products",
  "Free shipping on orders over R800",
  "Early access to new arrivals",
];

const referralOptions = [
  "Social Media",
  "Friend or Family",
  "Google Search",
  "Walk-in",
  "Event",
  "Other",
];

type IdType = "sa_id" | "passport";

function parseSaIdDob(idNumber: string): Date | null {
  if (idNumber.length < 6) return null;
  const yy = parseInt(idNumber.slice(0, 2), 10);
  const mm = parseInt(idNumber.slice(2, 4), 10);
  const dd = parseInt(idNumber.slice(4, 6), 10);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
  const currentYY = new Date().getFullYear() % 100;
  const year = yy > currentYY ? 1900 + yy : 2000 + yy;
  const dob = new Date(year, mm - 1, dd);
  if (dob.getMonth() !== mm - 1 || dob.getDate() !== dd) return null;
  return dob;
}

function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function formatDateStr(date: Date): string {
  return date.toLocaleDateString("en-ZA", { day: "2-digit", month: "long", year: "numeric" });
}

const MembershipCheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    idType: "sa_id" as IdType, idNumber: "", dob: "",
    referralSource: "",
    termsAccepted: false, marketingConsent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [underage, setUnderage] = useState(false);
  const [extractedDob, setExtractedDob] = useState<Date | null>(null);
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleIdNumberChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 13);
    setForm((prev) => ({ ...prev, idNumber: digits }));
    setUnderage(false);
    setExtractedDob(null);
    if (digits.length >= 6) {
      const dob = parseSaIdDob(digits);
      if (dob) {
        setExtractedDob(dob);
        if (calculateAge(dob) < 18) setUnderage(true);
      }
    }
  };

  const handleDobChange = (val: string) => {
    setForm((prev) => ({ ...prev, dob: val }));
    setUnderage(false);
    if (val) {
      const dob = new Date(val);
      if (!isNaN(dob.getTime()) && calculateAge(dob) < 18) setUnderage(true);
    }
  };

  const uploadFile = async (file: File, prefix: string): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${prefix}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("id-documents").upload(path, file);
    if (error) { console.error("Upload error:", error); return null; }
    return path;
  };

  const handleSubmit = async () => {
    if (underage) return;

    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";

    if (form.idType === "sa_id") {
      if (form.idNumber.length !== 13) newErrors.idNumber = "A valid 13-digit SA ID number is required";
      else {
        const dob = parseSaIdDob(form.idNumber);
        if (!dob) newErrors.idNumber = "Invalid ID number";
        else if (calculateAge(dob) < 18) { setUnderage(true); return; }
      }
    } else {
      if (!form.dob) newErrors.dob = "Date of birth is required";
      else {
        const dob = new Date(form.dob);
        if (isNaN(dob.getTime())) newErrors.dob = "Invalid date of birth";
        else if (calculateAge(dob) < 18) { setUnderage(true); return; }
      }
    }

    if (!idFrontFile) newErrors.idFront = "Please upload the front of your ID";
    if (!form.termsAccepted) newErrors.terms = "You must accept the Terms & Conditions";

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({});
    setLoading(true);
    setPayError("");

    try {
      // Upload ID documents
      const frontUrl = idFrontFile ? await uploadFile(idFrontFile, "front") : null;
      const backUrl = idBackFile ? await uploadFile(idBackFile, "back") : null;

      // Determine birthday
      let birthday: string | null = null;
      if (form.idType === "sa_id") {
        const dob = parseSaIdDob(form.idNumber);
        if (dob) birthday = dob.toISOString().split("T")[0];
      } else {
        birthday = form.dob;
      }

      // Store member data in localStorage temporarily to save after payment
      const memberData = {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        id_number: form.idType === "sa_id" ? form.idNumber : null,
        birthday,
        id_front_url: frontUrl,
        id_back_url: backUrl,
        referral_source: form.referralSource || null,
        terms_accepted: form.termsAccepted,
        marketing_consent: form.marketingConsent,
      };
      localStorage.setItem("pendingMemberData", JSON.stringify(memberData));

      const origin = window.location.origin;
      const { data, error } = await supabase.functions.invoke("create-bobpay-payment", {
        body: {
          amount: 100,
          item_name: "Divine Collective Membership - 3 Months",
          email: form.email,
          phone_number: form.phone,
          payment_type: "membership",
          success_url: `${origin}/payment-success?type=membership`,
          cancel_url: `${origin}/payment-cancelled?type=membership`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setPayError("Could not create payment link. Please try again.");
        setLoading(false);
      }
    } catch (e: any) {
      console.error("Payment error:", e);
      setPayError(e.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-transparent border-b border-primary/30 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="section-padding bg-background">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 max-w-[900px] mx-auto">
          {/* Form */}
          <div>
            <h1 className="font-serif text-primary text-[28px] mb-8">Complete Your Membership</h1>
            <div className="space-y-5">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input className={inputClass} placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                  {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <input className={inputClass} placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                  {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <input className={inputClass} type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <input className={inputClass} type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Identity Verification */}
              <div className="pt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-[2px] mb-4">Identity Verification</p>
                <p className="text-xs text-muted-foreground mb-4">By law, we are required to verify that you are 18 years or older.</p>
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => { setForm((prev) => ({ ...prev, idType: "sa_id", dob: "" })); setUnderage(false); setExtractedDob(null); }}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${form.idType === "sa_id" ? "bg-primary text-primary-foreground" : "border border-primary/30 text-primary"}`}>
                  SA ID Number
                </button>
                <button type="button" onClick={() => { setForm((prev) => ({ ...prev, idType: "passport", idNumber: "" })); setUnderage(false); setExtractedDob(null); }}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${form.idType === "passport" ? "bg-primary text-primary-foreground" : "border border-primary/30 text-primary"}`}>
                  Passport
                </button>
              </div>

              {form.idType === "sa_id" ? (
                <div>
                  <input className={inputClass} placeholder="SA ID Number (e.g. 9602145038083)" value={form.idNumber} onChange={(e) => handleIdNumberChange(e.target.value)} maxLength={13} />
                  {errors.idNumber && <p className="text-destructive text-xs mt-1">{errors.idNumber}</p>}
                  {extractedDob && !underage && <p className="text-primary text-xs mt-1">Date of birth: {formatDateStr(extractedDob)}</p>}
                </div>
              ) : (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Date of Birth</label>
                  <input className={inputClass} type="date" value={form.dob} onChange={(e) => handleDobChange(e.target.value)} max={new Date().toISOString().split("T")[0]} />
                  {errors.dob && <p className="text-destructive text-xs mt-1">{errors.dob}</p>}
                </div>
              )}

              {underage && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-destructive font-semibold text-sm">Age Verification Failed</p>
                    <p className="text-destructive/80 text-xs mt-1">You must be 18 years or older to register for a membership.</p>
                  </div>
                </div>
              )}

              {/* ID Upload - Front */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">
                  Upload {form.idType === "sa_id" ? "ID" : "passport"} (Front)
                </label>
                <input ref={frontInputRef} type="file" accept="image/*,.pdf" onChange={(e) => e.target.files?.[0] && setIdFrontFile(e.target.files[0])} className="hidden" />
                <button type="button" onClick={() => frontInputRef.current?.click()}
                  className="w-full border border-dashed border-primary/30 rounded-lg p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  {idFrontFile ? (<><FileText size={16} className="text-primary" /><span className="text-primary font-medium">{idFrontFile.name}</span></>) : (<><Upload size={16} /><span>Click to upload front</span></>)}
                </button>
                {errors.idFront && <p className="text-destructive text-xs mt-1">{errors.idFront}</p>}
              </div>

              {/* ID Upload - Back */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">
                  Upload {form.idType === "sa_id" ? "ID" : "passport"} (Back) <span className="text-muted-foreground/60">— optional</span>
                </label>
                <input ref={backInputRef} type="file" accept="image/*,.pdf" onChange={(e) => e.target.files?.[0] && setIdBackFile(e.target.files[0])} className="hidden" />
                <button type="button" onClick={() => backInputRef.current?.click()}
                  className="w-full border border-dashed border-primary/30 rounded-lg p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  {idBackFile ? (<><FileText size={16} className="text-primary" /><span className="text-primary font-medium">{idBackFile.name}</span></>) : (<><Upload size={16} /><span>Click to upload back</span></>)}
                </button>
              </div>

              {/* Where did you hear about us? */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Where did you hear about us?</label>
                <select className={`${inputClass} bg-background`} value={form.referralSource} onChange={(e) => setForm({ ...form, referralSource: e.target.value })}>
                  <option value="">Select an option</option>
                  {referralOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.termsAccepted} onChange={(e) => setForm({ ...form, termsAccepted: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary" />
                  <span className="text-xs text-foreground">
                    I accept the <a href="/terms" className="text-primary underline">Terms & Conditions</a> *
                  </span>
                </label>
                {errors.terms && <p className="text-destructive text-xs ml-7">{errors.terms}</p>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.marketingConsent} onChange={(e) => setForm({ ...form, marketingConsent: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary" />
                  <span className="text-xs text-foreground">
                    I consent to receiving marketing communications
                  </span>
                </label>
              </div>
            </div>

            {payError && <p className="text-destructive text-sm mt-4">{payError}</p>}

            <button onClick={handleSubmit} disabled={loading || underage} className="btn-pill-green w-full py-4 text-sm mt-8 disabled:opacity-60">
              {loading ? "CREATING PAYMENT LINK..." : "PAY R100 WITH BOBPAY"}
            </button>
            <p className="text-center text-muted-foreground text-xs mt-3 flex items-center justify-center gap-1">
              <Lock size={12} /> You'll be redirected to BobPay to complete payment securely.
            </p>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-card border border-primary/20 rounded-xl p-6 sticky top-24">
              <h2 className="font-bold text-primary text-lg mb-4">Membership Summary</h2>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">Divine Collective Membership</span>
              </div>
              <p className="text-muted-foreground text-xs mb-4">3 Months Access</p>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-muted-foreground">Price</span>
                <span className="text-primary font-semibold">R100.00</span>
              </div>
              <div className="h-px bg-primary/20 mb-4" />
              <div className="flex justify-between">
                <span className="text-primary font-bold text-lg">Total</span>
                <span className="text-primary font-bold text-lg">R100.00</span>
              </div>
              <div className="mt-6 pt-4 border-t border-primary/10">
                <p className="text-xs text-muted-foreground mb-3">What you get:</p>
                <ul className="space-y-2">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-foreground">
                      <Check size={12} className="text-primary mt-0.5 flex-shrink-0" />{b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCheckoutPage;
