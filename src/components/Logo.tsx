import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const Logo = () => {
  return (
    <Link to="/" className="flex flex-col items-center leading-none select-none">
      <span className="text-[10px] uppercase tracking-[4px] font-body font-bold text-foreground">
        THE
      </span>
      <div className="relative">
        <Leaf
          size={14}
          className="absolute -top-3 left-0 text-primary"
          strokeWidth={2}
        />
        <span className="text-[28px] md:text-[32px] font-serif font-black text-foreground italic leading-none">
          divine.
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-[4px] font-body font-bold text-foreground">
        collective
      </span>
    </Link>
  );
};

export default Logo;
