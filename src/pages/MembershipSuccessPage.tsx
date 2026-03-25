import { Link } from "react-router-dom";
import { useMembership } from "@/contexts/MembershipContext";
import { format } from "date-fns";
import { Check } from "lucide-react";

const MembershipSuccessPage = () => {
  const { membershipExpiry, membershipPurchasedAt } = useMembership();

  return (
    <div className="section-padding bg-background">
      <div className="container-main flex flex-col items-center text-center max-w-lg mx-auto">
        {/* Animated checkmark */}
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-8 animate-[scaleIn_0.5s_ease-out]">
          <Check size={40} className="text-primary-foreground" />
        </div>

        <h1 className="font-serif text-primary text-[36px] md:text-[40px] mb-4">
          Welcome to The Divine Collective!
        </h1>
        <p className="text-muted-foreground text-[17px] mb-10">
          Your membership is now active. You can now browse and purchase from our store.
        </p>

        {/* Membership card */}
        <div className="bg-card border border-primary/20 rounded-xl p-6 w-full text-left mb-10">
          <h2 className="font-bold text-primary mb-4">Your Membership</h2>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary text-primary-foreground text-[10px] tracking-[2px] uppercase font-bold px-3 py-1 rounded-full">
              ACTIVE
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valid from</span>
              <span className="text-primary font-semibold">
                {membershipPurchasedAt ? format(membershipPurchasedAt, "dd MMM yyyy") : "Today"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valid until</span>
              <span className="text-primary font-semibold">
                {membershipExpiry ? format(membershipExpiry, "dd MMM yyyy") : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link to="/categories" className="btn-pill-green flex-1 py-4 text-sm text-center">
            SHOP NOW
          </Link>
          <Link
            to="/cart"
            className="flex-1 py-4 text-sm text-center border border-primary text-primary rounded-full font-semibold uppercase tracking-[2px] hover:bg-primary/5 transition-colors"
          >
            VIEW CART
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MembershipSuccessPage;
