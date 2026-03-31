import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import { useMembership } from "@/contexts/MembershipContext";

const leftLinks = [
  { label: "ABOUT", to: "/#about" },
  { label: "SHOP", to: "/categories" },
  { label: "STRAINS", to: "/strains" },
  { label: "LOUNGE", to: "/lounge" },
];

const rightLinks = [
  { label: "CONTACT", to: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [memberDropdown, setMemberDropdown] = useState(false);
  const { isMember } = useMembership();

  const handleNavClick = (to: string) => {
    setMobileOpen(false);
    if (to.startsWith("/#")) {
      const el = document.getElementById(to.slice(2));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const memberLink = isMember ? "/my-membership" : "/member-sign-up-page";
  const memberLabel = isMember ? "MY MEMBERSHIP" : "BECOME A MEMBER";

  return (
    <header className="sticky top-0 z-50 bg-background" style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.1)" }}>
      <nav className="container-main flex items-center justify-between h-[70px] md:h-[80px]">
        {/* Left Nav - Desktop */}
        <div className="hidden md:flex items-center gap-8 flex-1">
          {leftLinks.map((l) => (
            <Link key={l.label} to={l.to} className="nav-link" onClick={() => handleNavClick(l.to)}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Center Logo */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Right Nav - Desktop */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-end">
          {rightLinks.map((l) => (
            <Link key={l.label} to={l.to} className="nav-link">
              {l.label}
            </Link>
          ))}
          <div className="relative" onMouseEnter={() => setMemberDropdown(true)} onMouseLeave={() => setMemberDropdown(false)}>
            <Link to={memberLink} className="nav-link flex items-center gap-1">
              {isMember && <span className="w-2 h-2 rounded-full bg-primary mr-1" />}
              {memberLabel} {!isMember && <ChevronDown size={12} />}
            </Link>
            {memberDropdown && !isMember && (
              <div className="absolute top-full right-0 mt-1 bg-background border border-primary/20 rounded-sm py-2 px-4 min-w-[200px] animate-fade-in">
                <Link to="/member-sign-up-page" className="nav-link block py-2 text-[11px]">
                  Membership Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Spacer for mobile */}
        <div className="md:hidden w-10" />
      </nav>

      {/* Green divider */}
      <div className="h-[1px] bg-primary/30" />

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-primary/10 animate-fade-in">
          <div className="container-main py-6 flex flex-col gap-4">
            {leftLinks.map((l) => (
              <Link key={l.label} to={l.to} className="nav-link" onClick={() => handleNavClick(l.to)}>
                {l.label}
              </Link>
            ))}
            {rightLinks.map((l) => (
              <Link key={l.label} to={l.to} className="nav-link" onClick={() => setMobileOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link to={memberLink} className="nav-link flex items-center gap-1" onClick={() => setMobileOpen(false)}>
              {isMember && <span className="w-2 h-2 rounded-full bg-primary mr-1" />}
              {memberLabel}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
