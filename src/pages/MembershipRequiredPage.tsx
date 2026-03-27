import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Check, Loader2 } from "lucide-react";
import { useMembership } from "@/contexts/MembershipContext";

const benefits = [
  "Full access to our online store",
  "Members-only lounge access",
  "Priority service and exclusive products",
  "Free shipping on orders over R800",
  "Early access to new arrivals",
];

const MembershipRequiredPage = () => {
  const { checkMembershipByEmail } = useMembership();
  const [showLookup, setShowLookup] = useState(false);
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<"found" | "not_found" | null>(null);

  const handleLookup = async () => {
    if (!lookupEmail.trim()) return;
    setLookupLoading(true);
    setLookupResult(null);
    const found = await checkMembershipByEmail(lookupEmail.trim());
    setLookupResult(found ? "found" : "not_found");
    setLookupLoading(false);
  };

  return (
    <div>
      <section className="bg-[hsl(150,40%,6%)] py-20 md:py-28">
        <div className="container-main flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full border-2 border-primary-foreground/30 flex items-center justify-center mb-6">
            <Lock size={24} className="text-primary-foreground" />
          </div>
          <h1 className="text-primary-foreground font-serif text-[36px] md:text-[44px] mb-4">Membership Required</h1>
          <p className="text-primary-foreground/70 text-[17px] max-w-lg mb-10">
            To complete your purchase and access our premium store, you need an active membership.
          </p>

          {/* Membership Card */}
          <div className="bg-card rounded-2xl p-8 max-w-[420px] w-full shadow-xl text-left">
            <div className="flex justify-center mb-4">
              <span className="bg-primary text-primary-foreground text-[10px] tracking-[2px] uppercase font-bold px-4 py-1.5 rounded-full">
                Join Today
              </span>
            </div>
            <h2 className="font-serif text-primary text-center text-[24px] md:text-[26px] mb-2">
              Divine Collective Membership
            </h2>
            <div className="text-center mb-4">
              <span className="font-serif text-primary font-bold text-[48px]">R100</span>
              <span className="text-muted-foreground text-sm ml-1">/3 months</span>
            </div>
            <div className="h-px bg-primary/15 mb-5" />
            <ul className="space-y-3 mb-8">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{b}</span>
                </li>
              ))}
            </ul>
            <Link to="/membership-checkout" className="btn-pill-green w-full py-4 text-sm block text-center">
              BECOME A MEMBER — R100
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-primary-foreground/50 text-sm">
              Already a member?{" "}
              <button
                onClick={() => setShowLookup(!showLookup)}
                className="text-primary-foreground/70 underline cursor-pointer hover:text-primary-foreground transition-colors"
              >
                Verify here
              </button>
            </p>

            {showLookup && (
              <div className="mt-4 bg-card rounded-xl p-5 max-w-[360px] mx-auto text-left">
                <p className="text-sm text-foreground mb-3">Enter your email to check membership:</p>
                <input
                  type="email"
                  value={lookupEmail}
                  onChange={(e) => setLookupEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-transparent border-b border-primary/30 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                />
                <button
                  onClick={handleLookup}
                  disabled={lookupLoading || !lookupEmail.trim()}
                  className="btn-pill-green w-full py-3 text-xs mt-3 disabled:opacity-50"
                >
                  {lookupLoading ? <Loader2 size={14} className="animate-spin mx-auto" /> : "CHECK MEMBERSHIP"}
                </button>
                {lookupResult === "found" && (
                  <p className="text-primary text-xs mt-2 font-semibold">✓ Membership found! Redirecting to checkout...</p>
                )}
                {lookupResult === "not_found" && (
                  <p className="text-destructive text-xs mt-2">No active membership found for this email.</p>
                )}
              </div>
            )}

            <Link to="/cart" className="text-primary-foreground/60 text-sm mt-3 inline-block hover:text-primary-foreground transition-colors">
              ← Return to Cart
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MembershipRequiredPage;
