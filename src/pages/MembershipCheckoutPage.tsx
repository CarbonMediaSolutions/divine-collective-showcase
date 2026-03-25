import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Lock } from "lucide-react";
import { useMembership } from "@/contexts/MembershipContext";

const benefits = [
  "Full access to our online store",
  "Members-only lounge access",
  "Priority service and exclusive products",
  "Free shipping on orders over R800",
  "Early access to new arrivals",
];

const MembershipCheckoutPage = () => {
  const navigate = useNavigate();
  const { purchaseMembership } = useMembership();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", card: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
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
              disabled={loading}
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
