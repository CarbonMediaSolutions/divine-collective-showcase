import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, X, Lock, Check, Loader2, CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useMembership } from "@/contexts/MembershipContext";

const JOINIT_URL = "https://app.joinit.com/o/divine-collective/members";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { isMember, verifyWithJoinIt } = useMembership();
  const navigate = useNavigate();

  const [showVerify, setShowVerify] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<"success" | "not_found" | "error" | null>(null);

  const handleCheckout = () => {
    if (isMember) {
      navigate("/checkout");
    } else {
      navigate("/membership-required");
    }
  };

  const handleVerify = async () => {
    if (!verifyEmail.trim() || !/\S+@\S+\.\S+/.test(verifyEmail)) return;
    setVerifyLoading(true);
    setVerifyResult(null);
    try {
      const verified = await verifyWithJoinIt(verifyEmail.trim());
      setVerifyResult(verified ? "success" : "not_found");
    } catch {
      setVerifyResult("error");
    }
    setVerifyLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="section-padding bg-background">
        <div className="container-main text-center">
          <h1 className="font-serif text-primary italic text-[36px] md:text-[40px] mb-6">Your Cart</h1>
          <p className="text-muted-foreground mb-8">Your cart is empty</p>
          <Link to="/categories" className="btn-pill-green inline-block">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-background">
      <div className="container-main">
        <h1 className="font-serif text-primary italic text-[36px] md:text-[40px] text-center mb-12">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* Cart Items */}
          <div>
            {items.map((item, idx) => (
              <div key={item.id}>
                <div className="flex gap-4 py-6">
                  <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-muted">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-primary text-sm leading-snug line-clamp-2">{item.name}</h3>
                    <p className="text-muted-foreground text-xs mt-0.5">{item.category}</p>
                    <p className="text-primary font-semibold text-sm mt-1">R{item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold text-primary w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X size={16} />
                    </button>
                    <span className="text-primary font-bold text-sm">R{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                {idx < items.length - 1 && <div className="h-px bg-primary/15" />}
              </div>
            ))}
            <div className="mt-6">
              <Link to="/categories" className="text-primary text-xs uppercase tracking-[2px] underline hover:no-underline font-semibold">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card border border-primary/20 rounded-xl p-6">
              <h2 className="font-bold text-primary text-lg mb-4">Order Summary</h2>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-primary font-semibold">R{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground text-xs">Calculated at checkout</span>
              </div>
              <div className="h-px bg-primary/20 mb-4" />
              <div className="flex justify-between mb-6">
                <span className="text-primary font-bold text-lg">Total</span>
                <span className="text-primary font-bold text-lg">R{cartTotal.toFixed(2)}</span>
              </div>
              <button onClick={handleCheckout} className="btn-pill-green w-full py-4 text-sm">
                PROCEED TO CHECKOUT
              </button>
            </div>

            {/* Membership status */}
            {!isMember ? (
              <div className="mt-4 bg-primary/[0.08] border border-primary/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lock size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-primary text-sm font-semibold">Membership Required</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      You need an active Join It membership to complete your purchase.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <a
                        href={JOINIT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-4 py-2 rounded-full border border-primary text-primary font-semibold uppercase tracking-[1px] hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        JOIN NOW
                      </a>
                      <button
                        onClick={() => setShowVerify(!showVerify)}
                        className="text-xs px-4 py-2 rounded-full border border-primary/40 text-primary font-semibold uppercase tracking-[1px] hover:border-primary transition-colors"
                      >
                        VERIFY MEMBERSHIP
                      </button>
                    </div>

                    {showVerify && (
                      <div className="mt-4 pt-4 border-t border-primary/15 animate-fade-in">
                        <input
                          type="email"
                          value={verifyEmail}
                          onChange={(e) => setVerifyEmail(e.target.value)}
                          placeholder="your@email.com"
                          disabled={verifyLoading}
                          className="w-full bg-transparent border border-primary/30 rounded-full py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:opacity-50"
                          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                        />
                        <button
                          onClick={handleVerify}
                          disabled={verifyLoading || !verifyEmail.trim()}
                          className="w-full mt-2 py-2.5 rounded-full border border-primary text-primary text-xs uppercase tracking-[1px] font-semibold hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
                        >
                          {verifyLoading ? <Loader2 size={14} className="animate-spin mx-auto" /> : "VERIFY"}
                        </button>
                        {verifyResult === "success" && (
                          <div className="flex items-center gap-2 mt-2">
                            <CheckCircle size={14} className="text-primary" />
                            <span className="text-primary text-xs font-semibold">Verified!</span>
                          </div>
                        )}
                        {verifyResult === "not_found" && (
                          <p className="text-destructive text-xs mt-2">No active membership found.</p>
                        )}
                        {verifyResult === "error" && (
                          <p className="text-destructive text-xs mt-2">Unable to verify. Try again.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 bg-primary/10 rounded-lg px-4 py-3 flex items-center gap-2">
                <Check size={14} className="text-primary" />
                <span className="text-primary text-xs font-semibold">✓ Active Member</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
