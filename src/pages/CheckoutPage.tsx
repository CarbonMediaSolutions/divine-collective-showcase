import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

const CheckoutPage = () => {
  const shopAccess = sessionStorage.getItem("shopAccess") === "true";
  if (!shopAccess) return <Navigate to="/categories" replace />;
  const { items, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", postalCode: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const finalTotal = discountApplied ? 10 : cartTotal;

  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === "DIVINETEST") {
      setDiscountApplied(true);
    }
  };

  const handlePay = async () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.email.trim()) errs.email = "Required";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!form.address.trim()) errs.address = "Required";
    if (!form.city.trim()) errs.city = "Required";
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setFormErrors({});

    setLoading(true);
    setError("");

    const origin = window.location.origin;
    const itemNames = items.map(i => `${i.name} x${i.quantity}`).join(", ");

    try {
      // Store pending order for post-payment save
      localStorage.setItem("pendingOrder", JSON.stringify({
        customer_name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postal_code: form.postalCode,
        items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        total: finalTotal,
      }));

      const { data, error: fnError } = await supabase.functions.invoke("create-bobpay-payment", {
        body: {
          amount: finalTotal,
          item_name: itemNames.slice(0, 100) || "Order",
          email: form.email,
          phone_number: form.phone,
          payment_type: "order",
          success_url: `${origin}/payment-success?type=order`,
          cancel_url: `${origin}/payment-cancelled?type=order`,
        },
      });

      if (fnError) throw fnError;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setError("Could not create payment link. Please try again.");
        setLoading(false);
      }
    } catch (e: any) {
      console.error("BobPay error:", e);
      setError(e.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-transparent border-b border-primary/30 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  if (items.length === 0) {
    return (
      <div className="section-padding bg-background">
        <div className="container-main text-center max-w-lg mx-auto">
          <h1 className="font-serif text-primary italic text-[36px] md:text-[40px] mb-6">Checkout</h1>
          <p className="text-muted-foreground mb-8">Your cart is empty.</p>
          <Link to="/categories" className="btn-pill-green inline-block">CONTINUE SHOPPING</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-background">
      <div className="container-main">
        <h1 className="font-serif text-primary italic text-[36px] md:text-[40px] text-center mb-12">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 max-w-[900px] mx-auto">
          {/* Shipping Form */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-[2px] mb-6">Shipping Details</p>
            <div className="space-y-5">
              {([
                ["name", "Full Name"],
                ["email", "Email Address", "email"],
                ["phone", "Phone Number", "tel"],
                ["address", "Street Address"],
                ["city", "City"],
                ["postalCode", "Postal Code"],
              ] as const).map(([key, placeholder, type]) => (
                <div key={key}>
                  <input
                    className={inputClass}
                    type={type || "text"}
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                  {formErrors[key] && <p className="text-destructive text-xs mt-1">{formErrors[key]}</p>}
                </div>
              ))}
            </div>

            {/* Discount Code */}
            <div className="flex gap-2 mt-6">
              <input
                className={inputClass + " flex-1"}
                placeholder="Discount Code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button
                type="button"
                onClick={handleApplyDiscount}
                className="border border-primary/30 text-primary text-xs uppercase tracking-wider px-4 py-2 hover:bg-primary/10 transition-colors"
              >
                Apply
              </button>
            </div>
            {discountApplied && (
              <p className="text-green-600 text-xs mt-2">✓ Test discount applied — total is now R10.00</p>
            )}

            {error && (
              <p className="text-destructive text-sm mt-4">{error}</p>
            )}

            <button
              onClick={handlePay}
              disabled={loading}
              className="btn-pill-green w-full py-4 text-sm mt-8 disabled:opacity-60"
            >
              {loading ? "CREATING PAYMENT..." : `PAY R${finalTotal.toFixed(2)} WITH BOBPAY`}
            </button>
            <p className="text-center text-muted-foreground text-xs mt-3 flex items-center justify-center gap-1">
              <Lock size={12} /> You'll be redirected to BobPay to complete payment securely.
            </p>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card border border-primary/20 rounded-xl p-6 sticky top-24">
              <h2 className="font-bold text-primary text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground line-clamp-1 flex-1 mr-2">
                      {item.name} <span className="text-muted-foreground">×{item.quantity}</span>
                    </span>
                    <span className="text-primary font-semibold">R{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-primary/20 mb-4" />
              {discountApplied && (
                <div className="mb-3">
                  <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded">TEST DISCOUNT</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-primary font-bold text-lg">Total</span>
                <div className="text-right">
                  {discountApplied && (
                    <span className="text-muted-foreground line-through text-sm mr-2">R{cartTotal.toFixed(2)}</span>
                  )}
                  <span className="text-primary font-bold text-lg">R{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
