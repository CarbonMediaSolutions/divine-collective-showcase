import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useMembership } from "@/contexts/MembershipContext";
import { useCart } from "@/contexts/CartContext";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const ref = searchParams.get("ref");
  const { purchaseMembership } = useMembership();
  const { clearCart } = useCart();
  const activated = useRef(false);

  useEffect(() => {
    if (activated.current) return;
    activated.current = true;

    if (type === "membership") {
      purchaseMembership();
    } else if (type === "order") {
      clearCart();
    }
  }, [type, purchaseMembership, clearCart]);

  const isMembership = type === "membership";

  return (
    <div className="section-padding bg-background">
      <div className="container-main text-center max-w-lg mx-auto">
        <CheckCircle size={64} className="text-primary mx-auto mb-6" />
        <h1 className="font-serif text-primary italic text-[36px] md:text-[40px] mb-4">
          {isMembership ? "Welcome to the Collective!" : "Order Confirmed!"}
        </h1>
        <p className="text-muted-foreground mb-2">
          {isMembership
            ? "Your membership has been activated. You now have full access to our store and lounge."
            : "Your order has been placed successfully. We'll be in touch with delivery details."}
        </p>
        {ref && (
          <p className="text-muted-foreground text-xs mb-8">
            Reference: {ref}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/categories" className="btn-pill-green inline-block">
            {isMembership ? "START SHOPPING" : "CONTINUE SHOPPING"}
          </Link>
          {isMembership && (
            <Link to="/my-membership" className="btn-pill-green inline-block !bg-transparent !text-primary border border-primary">
              VIEW MEMBERSHIP
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
