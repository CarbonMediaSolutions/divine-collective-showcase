import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const MembershipSuccessPage = () => {
  return (
    <div className="section-padding bg-background">
      <div className="container-main flex flex-col items-center text-center max-w-lg mx-auto">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-8">
          <Check size={40} className="text-primary-foreground" />
        </div>
        <h1 className="font-serif text-primary text-[36px] md:text-[40px] mb-4">
          Welcome to The Divine Collective!
        </h1>
        <p className="text-muted-foreground text-[17px] mb-10">
          Your membership is now active.
        </p>
        <Link to="/my-membership" className="btn-pill-green inline-block">
          VIEW MEMBERSHIP
        </Link>
      </div>
    </div>
  );
};

export default MembershipSuccessPage;
