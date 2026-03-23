import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const sitemapLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/#about" },
  { label: "Shop", to: "/categories" },
  { label: "Lounge", to: "/lounge" },
  { label: "Contact", to: "/contact" },
  { label: "Become A Member", to: "/member-sign-up-page" },
  { label: "Membership Account", to: "/member-sign-up-page" },
];

const Footer = () => {
  return (
    <footer>
      {/* Upper Footer */}
      <div className="bg-background section-padding">
        <div className="container-main grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Col 1 - Logo & desc */}
          <div>
            <h3 className="text-[36px] font-serif font-black text-foreground italic leading-none mb-2">
              dc.
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              The Divine Collective delivers premium cannabis products and accessories throughout South Africa. Explore our exclusive club and trusted dispensary.
            </p>
          </div>

          {/* Col 2 - Sitemap */}
          <div>
            <h4 className="section-label mb-6">SITEMAP</h4>
            <ul className="space-y-3">
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
            <h4 className="section-label mb-6">INFORMATION</h4>
            <div className="space-y-4 text-sm">
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
                {["TikTok", "Instagram", "YouTube"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-xs font-bold"
                    aria-label={s}
                  >
                    {s[0]}
                  </a>
                ))}
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
