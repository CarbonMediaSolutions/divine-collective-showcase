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

type IdType = "sa_id" | "passport";

function parseSaIdDob(idNumber: string): Date | null {
  if (idNumber.length < 6) return null;
  const yy = parseInt(idNumber.slice(0, 2), 10);
  const mm = parseInt(idNumber.slice(2, 4), 10);
  const dd = parseInt(idNumber.slice(4, 6), 10);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
  // Determine century: if yy > current 2-digit year, assume 1900s
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
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

function formatDateStr(date: Date): string {
  return date.toLocaleDateString("en-ZA", { day: "2-digit", month: "long", year: "numeric" });
}

const MembershipCheckoutPage = () => {
  const navigate = useNavigate();
  const { purchaseMembership } = useMembership();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", card: "", expiry: "", cvv: "",
    idType: "sa_id" as IdType, idNumber: "", dob: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [underage, setUnderage] = useState(false);
  const [extractedDob, setExtractedDob] = useState<Date | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handleIdNumberChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 13);
    setForm((prev) => ({ ...prev, idNumber: digits }));
    setUnderage(false);
    setExtractedDob(null);

    if (digits.length >= 6) {
      const dob = parseSaIdDob(digits);
      if (dob) {
        setExtractedDob(dob);
        const age = calculateAge(dob);
        if (age < 18) {
          setUnderage(true);
        }
      }
    }
  };

  const handleDobChange = (val: string) => {
    setForm((prev) => ({ ...prev, dob: val }));
    setUnderage(false);
    if (val) {
      const dob = new Date(val);
      if (!isNaN(dob.getTime())) {
        const age = calculateAge(dob);
        if (age < 18) setUnderage(true);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setIdFile(file);
  };

  const handleSubmit = () => {
    if (underage) return;

    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";

    // ID verification
    if (form.idType === "sa_id") {
      if (form.idNumber.length !== 13) newErrors.idNumber = "A valid 13-digit SA ID number is required";
      else {
        const dob = parseSaIdDob(form.idNumber);
        if (!dob) newErrors.idNumber = "Invalid ID number — could not extract date of birth";
        else if (calculateAge(dob) < 18) {
          setUnderage(true);
          return;
        }
      }
    } else {
      if (!form.dob) newErrors.dob = "Date of birth is required";
      else {
        const dob = new Date(form.dob);
        if (isNaN(dob.getTime())) newErrors.dob = "Invalid date of birth";
        else if (calculateAge(dob) < 18) {
          setUnderage(true);
          return;
        }
      }
    }

    if (!idFile) newErrors.idFile = "Please upload a copy of your ID or passport";

    // Payment
    if (form.card.replace(/\s/g, "").length < 16) newErrors.card = "Valid card number required";
    if (form.expiry.length < 5) newErrors.expiry = "Valid expiry required";
    if (form.cvv.length < 3) newErrors.cvv = "Valid CVV required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setTimeout(() => {
      purchaseMembership();
      navigate("/membership-success");
    }, 1500);
  };

  const inputClass = "w-full bg-transparent border-b border-primary/30 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="section-padding bg-background">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 max-w-[900px] mx-auto">
          {/* Payment Form */}
          <div>
            <h1 className="font-serif text-primary text-[28px] mb-8">Complete Your Membership</h1>
            <div className="space-y-5">
              <div>
                <input className={inputClass} placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <input className={inputClass} type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <input className={inputClass} type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* ID Verification Section */}
              <div className="pt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-[2px] mb-4">Identity Verification</p>
                <p className="text-xs text-muted-foreground mb-4">By law, we are required to verify that you are 18 years or older.</p>
              </div>

              {/* ID Type Toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setForm((prev) => ({ ...prev, idType: "sa_id", dob: "" })); setUnderage(false); setExtractedDob(null); }}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${form.idType === "sa_id" ? "bg-primary text-primary-foreground" : "border border-primary/30 text-primary"}`}
                >
                  SA ID Number
                </button>
                <button
                  type="button"
                  onClick={() => { setForm((prev) => ({ ...prev, idType: "passport", idNumber: "" })); setUnderage(false); setExtractedDob(null); }}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${form.idType === "passport" ? "bg-primary text-primary-foreground" : "border border-primary/30 text-primary"}`}
                >
                  Passport
                </button>
              </div>

              {form.idType === "sa_id" ? (
                <div>
                  <input
                    className={inputClass}
                    placeholder="SA ID Number (e.g. 9602145038083)"
                    value={form.idNumber}
                    onChange={(e) => handleIdNumberChange(e.target.value)}
                    maxLength={13}
                  />
                  {errors.idNumber && <p className="text-destructive text-xs mt-1">{errors.idNumber}</p>}
                  {extractedDob && !underage && (
                    <p className="text-primary text-xs mt-1">Date of birth: {formatDateStr(extractedDob)}</p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Date of Birth</label>
                  <input
                    className={inputClass}
                    type="date"
                    value={form.dob}
                    onChange={(e) => handleDobChange(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {errors.dob && <p className="text-destructive text-xs mt-1">{errors.dob}</p>}
                </div>
              )}

              {/* Underage Block */}
              {underage && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-destructive font-semibold text-sm">Age Verification Failed</p>
                    <p className="text-destructive/80 text-xs mt-1">
                      You must be 18 years or older to register for a membership. We are legally required to enforce this restriction.
                    </p>
                  </div>
                </div>
              )}

              {/* ID Upload */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">
                  Upload a copy of your {form.idType === "sa_id" ? "ID document" : "passport"}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-dashed border-primary/30 rounded-lg p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {idFile ? (
                    <>
                      <FileText size={16} className="text-primary" />
                      <span className="text-primary font-medium">{idFile.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      <span>Click to upload {form.idType === "sa_id" ? "ID" : "passport"}</span>
                    </>
                  )}
                </button>
                {errors.idFile && <p className="text-destructive text-xs mt-1">{errors.idFile}</p>}
              </div>

              {/* Payment Details */}
              <div className="pt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-[2px] mb-4">Payment Details</p>
              </div>

              <div>
                <input className={inputClass} placeholder="1234 5678 9012 3456" value={form.card} onChange={(e) => setForm({ ...form, card: formatCard(e.target.value) })} />
                {errors.card && <p className="text-destructive text-xs mt-1">{errors.card}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input className={inputClass} placeholder="MM/YY" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })} />
                  {errors.expiry && <p className="text-destructive text-xs mt-1">{errors.expiry}</p>}
                </div>
                <div>
                  <input className={inputClass} placeholder="123" maxLength={3} value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })} />
                  {errors.cvv && <p className="text-destructive text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || underage}
              className="btn-pill-green w-full py-4 text-sm mt-8 disabled:opacity-60"
            >
              {loading ? "PROCESSING..." : "PAY R100 — ACTIVATE MEMBERSHIP"}
            </button>
            <p className="text-center text-muted-foreground text-xs mt-3 flex items-center justify-center gap-1">
              <Lock size={12} /> Secure mock payment. No real card is charged.
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
                      <Check size={12} className="text-primary mt-0.5 flex-shrink-0" />
                      {b}
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
