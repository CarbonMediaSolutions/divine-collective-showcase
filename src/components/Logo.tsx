import { Link } from "react-router-dom";
import logoImg from "@/assets/logo.png";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center select-none">
      <img
        src={logoImg}
        alt="The Divine Collective"
        className="h-12 md:h-14 w-auto"
      />
    </Link>
  );
};

export default Logo;
