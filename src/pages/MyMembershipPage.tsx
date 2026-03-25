import { Link } from "react-router-dom";
import { useMembership } from "@/contexts/MembershipContext";
import { format, differenceInDays } from "date-fns";
import { useState } from "react";

const MyMembershipPage = () => {
  const { isMember, membershipExpiry, membershipPurchasedAt, purchaseMembership } = useMembership();
  const [renewed, setRenewed] = useState(false);

  if (!isMember) {
    return (
      <div className="section-padding bg-background">
        <div className="container-main text-center max-w-lg mx-auto">
          <h1 className="font-serif text-primary italic text-[36px] md:text-[40px] mb-6">Your Membership</h1>
          <p className="text-muted-foreground mb-8">You don't have an active membership.</p>
          <Link to="/membership-required" className="btn-pill-green inline-block">
            GET A MEMBERSHIP
          </Link>
        </div>
      </div>
    );
  }

  const now = new Date();
  const daysRemaining = membershipExpiry ? differenceInDays(membershipExpiry, now) : 0;
  const totalDays = 90;
  const elapsed = totalDays - daysRemaining;
  const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDays) * 100));

  const handleRenew = () => {
    purchaseMembership();
    setRenewed(true);
    setTimeout(() => setRenewed(false), 3000);
  };

  return (
    <div className="section-padding bg-background">
      <div className="container-main max-w-[500px] mx-auto">
        <h1 className="font-serif text-primary italic text-[36px] md:text-[40px] text-center mb-12">Your Membership</h1>

        <div className="bg-card border-2 border-primary/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary text-primary-foreground text-[10px] tracking-[2px] uppercase font-bold px-3 py-1 rounded-full">
              ACTIVE
            </span>
          </div>
          <h2 className="font-serif text-primary text-xl mb-4">Divine Collective Member</h2>

          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valid until</span>
              <span className="text-primary font-semibold">
                {membershipExpiry ? format(membershipExpiry, "dd MMM yyyy") : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Days remaining</span>
              <span className="text-primary font-semibold">{daysRemaining} days</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <button onClick={handleRenew} className="w-full py-3 border border-primary text-primary rounded-full font-semibold text-sm uppercase tracking-[2px] hover:bg-primary/5 transition-colors">
            RENEW MEMBERSHIP
          </button>
          {renewed && (
            <p className="text-primary text-sm text-center mt-3 font-semibold animate-fade-in">
              ✓ Membership renewed!
            </p>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link to="/categories" className="btn-pill-green inline-block">
            SHOP NOW
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyMembershipPage;
