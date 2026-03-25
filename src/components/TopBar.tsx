import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const TopBar = () => {
  const { cartCount } = useCart();

  return (
    <div className="w-full bg-primary" style={{ height: 42 }}>
      <div className="container-main flex items-center justify-between h-full">
        <span className="text-primary-foreground text-xs tracking-wide">
          Your Premium Cannabis Store
        </span>
        <Link to="/cart" className="flex items-center gap-2 text-primary-foreground text-xs hover:opacity-80 transition-opacity">
          <ShoppingCart size={14} />
          <span>{cartCount} {cartCount === 1 ? "Item" : "Items"}</span>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
