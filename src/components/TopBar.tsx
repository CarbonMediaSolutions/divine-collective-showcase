import { ShoppingCart } from "lucide-react";

const TopBar = () => {
  return (
    <div className="w-full bg-primary" style={{ height: 42 }}>
      <div className="container-main flex items-center justify-between h-full">
        <span className="text-primary-foreground text-xs tracking-wide">
          Your Premium Cannabis Store
        </span>
        <div className="flex items-center gap-2 text-primary-foreground text-xs">
          <ShoppingCart size={14} />
          <span>0 Items</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
