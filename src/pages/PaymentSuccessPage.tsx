import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const ref = searchParams.get("ref");
  const { clearCart } = useCart();
  const activated = useRef(false);

  useEffect(() => {
    if (activated.current) return;
    activated.current = true;

    if (type === "order") {
      const pending = localStorage.getItem("pendingOrder");
      if (pending) {
        try {
          const order = JSON.parse(pending);
          supabase.from("orders").insert({
            customer_name: order.customer_name,
            email: order.email,
            phone: order.phone,
            address: order.address,
            city: order.city,
            postal_code: order.postal_code,
            items: order.items,
            total: order.total,
            status: "completed",
            payment_ref: ref || undefined,
            payment_type: "order",
            referred_by: order.referred_by || null,
          }).then(() => {
            localStorage.removeItem("pendingOrder");
          });
        } catch {}
      }
      clearCart();
    }
  }, [type, clearCart, ref]);

  return (
    <div className="section-padding bg-background">
      <div className="container-main text-center max-w-lg mx-auto">
        <CheckCircle size={64} className="text-primary mx-auto mb-6" />
        <h1 className="font-serif text-primary italic text-[36px] md:text-[40px] mb-4">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground mb-2">
          Your order has been placed successfully. We'll be in touch with delivery details.
        </p>
        {ref && (
          <p className="text-muted-foreground text-xs mb-8">
            Reference: {ref}
          </p>
        )}
        <Link to="/categories" className="btn-pill-green inline-block">
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
