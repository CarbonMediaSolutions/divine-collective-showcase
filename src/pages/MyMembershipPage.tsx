import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMembership } from "@/contexts/MembershipContext";
import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays } from "date-fns";
import { ShoppingBag, Coffee, Crown, Truck, Star, Gift, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MembershipCardPreview from "@/components/membership/MembershipCardPreview";
import WalletButtons from "@/components/membership/WalletButtons";
import MembershipBenefits from "@/components/membership/MembershipBenefits";
import MembershipOrderHistory from "@/components/membership/MembershipOrderHistory";

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  items: any[];
  payment_ref: string | null;
}

const MyMembershipPage = () => {
  const { isMember, membershipExpiry, membershipPurchasedAt, memberEmail, memberName } = useMembership();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [renewLoading, setRenewLoading] = useState(false);

  useEffect(() => {
    if (memberEmail) {
      setOrdersLoading(true);
      supabase
        .from("orders")
        .select("*")
        .eq("email", memberEmail)
        .order("created_at", { ascending: false })
        .limit(10)
        .then(({ data }) => {
          setOrders((data as Order[]) || []);
          setOrdersLoading(false);
        });
    }
  }, [memberEmail]);

  const handleRenew = async () => {
    setRenewLoading(true);
    try {
      const origin = window.location.origin;
      const { data, error } = await supabase.functions.invoke("create-bobpay-payment", {
        body: {
          amount: 100,
          item_name: "Divine Collective Membership Renewal - 3 Months",
          email: memberEmail || "",
          payment_type: "membership",
          success_url: `${origin}/payment-success?type=membership`,
          cancel_url: `${origin}/payment-cancelled?type=membership`,
        },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
      else setRenewLoading(false);
    } catch (e) {
      console.error("Renewal error:", e);
      setRenewLoading(false);
    }
  };

  if (!isMember) {
    return (
      <div className="section-padding bg-background">
        <div className="container-main text-center max-w-lg mx-auto">
          <h1 className="font-serif text-primary italic text-[36px] md:text-[40px] mb-6">Your Membership</h1>
          <p className="text-muted-foreground mb-8">You don't have an active membership.</p>
          <Link to="/membership-checkout" className="btn-pill-green inline-block">
            GET A MEMBERSHIP
          </Link>
        </div>
      </div>
    );
  }

  const now = new Date();
  const daysRemaining = membershipExpiry ? Math.max(0, differenceInDays(membershipExpiry, now)) : 0;
  const totalDays = 90;
  const progressPercent = Math.min(100, Math.max(0, ((totalDays - daysRemaining) / totalDays) * 100));
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (((100 - progressPercent) / 100) * circumference);

  const fullName = memberName
    ? `${memberName}${memberEmail ? "" : ""}`
    : memberEmail || "Member";

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
            Welcome back{memberName ? `, ${memberName}` : ""}
          </h1>
          <p className="text-primary-foreground/60 text-base max-w-md mx-auto">
            Your membership is active. Enjoy premium access to everything Divine Collective has to offer.
          </p>
        </div>
      </section>

      <div className="container-main py-12 md:py-16">
        {/* Membership Card + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 mb-16">
          {/* Card */}
          <div className="bg-card border border-primary/15 rounded-2xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-[2px] mb-1">Membership</p>
                  <h2 className="font-serif text-primary text-2xl md:text-3xl">Divine Collective</h2>
                </div>
                <Crown size={28} className="text-primary/40" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[1.5px] mb-1">Member Since</p>
                  <p className="text-foreground font-semibold text-sm">
                    {membershipPurchasedAt ? format(membershipPurchasedAt, "dd MMM yyyy") : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[1.5px] mb-1">Valid Until</p>
                  <p className="text-foreground font-semibold text-sm">
                    {membershipExpiry ? format(membershipExpiry, "dd MMM yyyy") : "—"}
                  </p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[1.5px] mb-1">Email</p>
                  <p className="text-foreground font-semibold text-sm truncate">{memberEmail || "—"}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-8">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Membership progress</span>
                  <span>{daysRemaining} days remaining</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${100 - progressPercent}%`,
                      background: `linear-gradient(90deg, hsl(var(--primary)), hsl(153, 60%, 30%))`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Circular progress */}
          <div className="bg-card border border-primary/15 rounded-2xl p-8 flex flex-col items-center justify-center">
            <svg width="140" height="140" className="mb-4">
              <circle cx="70" cy="70" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle
                cx="70" cy="70" r="54" fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 70 70)"
                className="transition-all duration-700"
              />
              <text x="70" y="64" textAnchor="middle" className="fill-foreground text-2xl font-bold" style={{ fontSize: "28px" }}>
                {daysRemaining}
              </text>
              <text x="70" y="84" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: "11px" }}>
                days left
              </text>
            </svg>
            <button
              onClick={handleRenew}
              disabled={renewLoading}
              className="w-full py-3 border border-primary text-primary rounded-full font-semibold text-xs uppercase tracking-[2px] hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
            >
              {renewLoading ? <Loader2 size={14} className="animate-spin mx-auto" /> : "RENEW MEMBERSHIP"}
            </button>
          </div>
        </div>

        {/* Digital Membership Card */}
        <div className="mb-16">
          <h2 className="font-serif text-primary text-xl md:text-2xl mb-8 text-center">Your Digital Card</h2>
          <div className="flex flex-col items-center gap-6">
            <MembershipCardPreview
              memberName={fullName}
              memberEmail={memberEmail}
              expiryDate={membershipExpiry}
            />
            <WalletButtons />
          </div>
        </div>

        {/* Benefits */}
        <MembershipBenefits />

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          <Link to="/categories" className="btn-pill-green px-8 py-3 text-sm">SHOP NOW</Link>
          <Link to="/lounge" className="px-8 py-3 rounded-full border border-primary text-primary text-sm font-semibold uppercase tracking-[1.5px] hover:bg-primary hover:text-primary-foreground transition-colors">VISIT LOUNGE</Link>
        </div>

        {/* Order History */}
        <MembershipOrderHistory orders={orders} loading={ordersLoading} />
      </div>
    </div>
  );
};

export default MyMembershipPage;
