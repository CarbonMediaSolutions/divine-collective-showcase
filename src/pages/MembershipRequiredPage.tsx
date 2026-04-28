import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2, CheckCircle } from "lucide-react";
import { useMembership } from "@/contexts/MembershipContext";

const JOINIT_URL = "https://app.joinit.com/o/divine-collective";

const MembershipRequiredPage = () => {
  const { verifyWithJoinIt } = useMembership();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"success" | "not_found" | "error" | null>(null);

  const handleVerify = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return;
    setLoading(true);
    setResult(null);
    try {
      const verified = await verifyWithJoinIt(email.trim());
      if (verified) {
        setResult("success");
        setTimeout(() => navigate("/cart"), 1500);
      } else {
        setResult("not_found");
      }
    } catch {
      setResult("error");
    }
    setLoading(false);
  };

  return (
    <div>
      <section className="bg-[hsl(150,40%,6%)] py-20 md:py-28">
        <div className="container-main flex flex-col items-center text-center">
          {/* Decorative circles */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary-foreground/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary-foreground/10" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-primary-foreground/30 flex items-center justify-center mb-6">
              <Lock size={24} className="text-primary-foreground" />
            </div>

            {/* Join section */}
            <h1 className="text-primary-foreground font-serif text-[36px] md:text-[44px] mb-4">Become A Member</h1>
            <p className="text-primary-foreground/70 text-[17px] max-w-lg mb-8">
              Join The Divine Collective to access our online store and exclusive lounge.
              Membership is R100 for 3 months, managed through our membership portal.
            </p>
            <a
              href={JOINIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-white text-sm px-10 py-4 inline-block"
            >
              JOIN NOW — R100
            </a>
            <p className="text-primary-foreground/40 text-xs mt-3">
              You will be redirected to our secure membership portal to sign up and pay.
            </p>

            {/* Divider */}
            <div className="flex items-center gap-4 w-full max-w-[360px] my-10">
              <div className="flex-1 h-px bg-primary-foreground/20" />
              <span className="text-primary-foreground/40 text-xs tracking-[2px] uppercase">or</span>
              <div className="flex-1 h-px bg-primary-foreground/20" />
            </div>

            {/* Verify section */}
            <h2 className="text-primary-foreground font-serif text-[24px] md:text-[28px] mb-3">Already A Member?</h2>
            <p className="text-primary-foreground/60 text-sm max-w-md mb-6">
              Enter the email address you used to sign up with Join It to verify your membership.
            </p>

            <div className="w-full max-w-[360px]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
                className="w-full bg-transparent border border-primary-foreground/30 rounded-full py-3 px-5 text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-primary-foreground/60 disabled:opacity-50"
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              />
              <button
                onClick={handleVerify}
                disabled={loading || !email.trim()}
                className="w-full mt-3 py-3 rounded-full border border-primary-foreground/50 text-primary-foreground text-xs uppercase tracking-[2px] font-semibold hover:bg-primary-foreground/10 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={14} className="animate-spin mx-auto" /> : "VERIFY MEMBERSHIP"}
              </button>

              {result === "success" && (
                <div className="flex items-center gap-2 justify-center mt-4">
                  <CheckCircle size={16} className="text-green-400" />
                  <span className="text-green-400 text-sm font-semibold">Membership verified! Redirecting...</span>
                </div>
              )}
              {result === "not_found" && (
                <p className="text-red-400 text-xs mt-3 text-center">
                  No active membership found for this email address. Please check your email or join above.
                </p>
              )}
              {result === "error" && (
                <p className="text-red-400 text-xs mt-3 text-center">
                  Unable to verify right now. Please try again.
                </p>
              )}
            </div>

            <a href="/cart" className="text-primary-foreground/50 text-sm mt-8 inline-block hover:text-primary-foreground transition-colors">
              ← Return to Cart
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MembershipRequiredPage;
