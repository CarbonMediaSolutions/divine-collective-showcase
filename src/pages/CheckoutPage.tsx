import { Link } from "react-router-dom";

const CheckoutPage = () => {
  return (
    <div className="section-padding bg-background">
      <div className="container-main text-center max-w-lg mx-auto">
        <h1 className="font-serif text-primary italic text-[36px] md:text-[40px] mb-6">Checkout</h1>
        <p className="text-muted-foreground mb-8">
          Checkout coming soon — your cart is saved.
        </p>
        <Link to="/cart" className="btn-pill-green inline-block">
          BACK TO CART
        </Link>
      </div>
    </div>
  );
};

export default CheckoutPage;
