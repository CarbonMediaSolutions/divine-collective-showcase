import { ShoppingBag, Coffee, Crown, Truck, Star, Gift } from "lucide-react";

const benefits = [
  { icon: ShoppingBag, label: "Full Store Access", desc: "Browse & buy our full range" },
  { icon: Coffee, label: "Lounge Access", desc: "Members-only lounge experience" },
  { icon: Crown, label: "Priority Service", desc: "Skip the queue, get served first" },
  { icon: Truck, label: "Free Shipping", desc: "On orders over R800" },
  { icon: Star, label: "Exclusive Products", desc: "Members-only drops & collabs" },
  { icon: Gift, label: "Early Access", desc: "New arrivals before anyone else" },
];

const MembershipBenefits = () => {
  return (
    <div className="mb-16">
      <h2 className="font-serif text-primary text-xl md:text-2xl mb-8 text-center">Your Benefits</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {benefits.map((b) => (
          <div key={b.label} className="bg-card border border-primary/10 rounded-xl p-5 text-center hover:border-primary/30 transition-colors">
            <b.icon size={24} className="text-primary mx-auto mb-3" />
            <p className="font-semibold text-foreground text-sm mb-1">{b.label}</p>
            <p className="text-muted-foreground text-xs">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipBenefits;
