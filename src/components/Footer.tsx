import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const JOINIT_URL = "https://app.joinit.com/o/divine-collective/members";

const sitemapLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/#about" },
  { label: "Shop", to: "/categories" },
  { label: "Lounge", to: "/lounge" },
  { label: "Contact", to: "/contact" },
  { label: "Become A Member", to: JOINIT_URL, external: true },
  { label: "Membership Account", to: "/my-membership" },
];

const Footer = () => {
  return (
    <footer>
      {/* Upper Footer */}
      <div className="bg-background py-12 md:py-14">
        <div className="container-main grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1 - Logo & desc */}
          <div>
            <h3 className="text-[28px] font-serif font-black text-foreground italic leading-none mb-2">
              dc.
            </h3>
            <p className="text-sm text-muted-foreground leading-snug mt-3">
              The Divine Collective delivers premium cannabis products and accessories throughout South Africa. Explore our exclusive club and trusted dispensary.
            </p>
          </div>

          {/* Col 2 - Sitemap */}
          <div>
            <h4 className="section-label mb-4">SITEMAP</h4>
            <ul className="space-y-2">
              {sitemapLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-primary text-sm hover:underline transition-colors duration-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Information */}
          <div>
            <h4 className="section-label mb-4">INFORMATION</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 text-foreground">
                <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>Shop 1, Cascades 4, Tyger Waterfront, Cape Town, 7530</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <a href="tel:0774661572" className="hover:text-primary transition-colors">0774661572</a>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <a href="mailto:info@thedivinecollective.co.za" className="hover:text-primary transition-colors">
                  info@thedivinecollective.co.za
                </a>
              </div>
              {/* Social icons */}
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="TikTok">
                   <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="Instagram">
                   <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="YouTube">
                   <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Footer */}
      <div className="py-4 text-center text-[13px]" style={{ backgroundColor: "rgba(10,10,10,0.32)" }}>
        <span className="text-primary-foreground">
          © 2025 The Divine Collection. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
