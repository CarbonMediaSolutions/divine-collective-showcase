import { useState } from "react";
import { Crown, Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { useMembership } from "@/contexts/MembershipContext";

const JOINIT_URL = "https://app.joinit.com/o/divine-collective";
const JOINIT_PORTAL = "https://app.joinit.com/o/divine-collective";

const MyMembershipPage = () => {
  const { isMember, memberEmail, verifyWithJoinIt, clearMembership } = useMembership();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"success" | "not_found" | "error" | null>(null);

  const handleVerify = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return;
    setLoading(true);
    setResult(null);
    try {
      const verified = await verifyWithJoinIt(email.trim());
      setResult(verified ? "success" : "not_found");
    } catch {
      setResult("error");
    }
    setLoading(false);
  };

  if (!isMember) {
    return (
      <div className="section-padding bg-background">
        <div className="container-main text-center max-w-lg mx-auto">
          <h1 className="font-serif text-primary italic text-[36px] md:text-[40px] mb-6">Your Membership</h1>
          <div className="bg-card border border-primary/15 rounded-2xl p-8 text-left">
            <p className="text-muted-foreground text-sm mb-6 text-center">
              You don't have a verified membership session.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
              className="w-full bg-transparent border border-primary/30 rounded-full py-3 px-5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:opacity-50"
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            />
            <button
              onClick={handleVerify}
              disabled={loading || !email.trim()}
              className="w-full mt-3 py-3 rounded-full border border-primary text-primary text-xs uppercase tracking-[2px] font-semibold hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin mx-auto" /> : "VERIFY MEMBERSHIP"}
            </button>

            {result === "success" && (
              <div className="flex items-center gap-2 justify-center mt-4">
                <CheckCircle size={16} className="text-primary" />
                <span className="text-primary text-sm font-semibold">Membership verified!</span>
              </div>
            )}
            {result === "not_found" && (
              <p className="text-destructive text-xs mt-3 text-center">
                No active membership found for this email.
              </p>
            )}
            {result === "error" && (
              <p className="text-destructive text-xs mt-3 text-center">
                Unable to verify right now. Please try again.
              </p>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-6">
            New member?{" "}
            <a href={JOINIT_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Join via our membership portal →
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(153,82%,10%) 0%, hsl(153,82%,18%) 50%, hsl(150,60%,12%) 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-primary-foreground/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-primary-foreground/10" />
        </div>
        <div className="container-main relative z-10 py-16 md:py-24 text-center">
          <span className="inline-block bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground text-[10px] tracking-[3px] uppercase font-bold px-5 py-2 rounded-full mb-6">
            ✦ Active Member
          </span>
          <h1 className="text-primary-foreground font-serif text-[32px] md:text-[48px] leading-tight mb-3">
            Your Membership
          </h1>
          <p className="text-primary-foreground/60 text-base max-w-md mx-auto">
            Your membership is active. Enjoy premium access to everything Divine Collective has to offer.
          </p>
        </div>
      </section>

      <div className="container-main py-12 md:py-16">
        {/* Membership Card */}
        <div className="bg-card border border-primary/15 rounded-2xl p-8 md:p-10 relative overflow-hidden max-w-2xl mx-auto mb-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-[2px] mb-1">Membership</p>
                <h2 className="font-serif text-primary text-2xl md:text-3xl">Divine Collective</h2>
              </div>
              <Crown size={28} className="text-primary/40" />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-[1.5px] mb-1">Status</p>
                <span className="inline-block bg-primary/15 text-primary text-xs font-bold px-3 py-1 rounded-full">ACTIVE</span>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-[1.5px] mb-1">Email</p>
                <p className="text-foreground font-semibold text-sm">{memberEmail || "—"}</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground text-xs leading-relaxed">
                Membership managed by Join It. To view your expiry date, renewal options, and membership card, visit your Join It portal.
              </p>
            </div>

            <a
              href={JOINIT_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full py-3 rounded-full border border-primary text-primary text-xs uppercase tracking-[2px] font-semibold hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-2"
            >
              MANAGE MY MEMBERSHIP <ExternalLink size={12} />
            </a>

            <button
              onClick={clearMembership}
              className="w-full mt-3 text-muted-foreground text-xs hover:text-foreground transition-colors"
            >
              Sign out of membership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMembershipPage;
