import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { products as allProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const bulletPoints = [
  "Uncompromising Quality",
  "Sustainable Practices",
  "Exclusive Lounge Access",
  "Expert Guidance",
];

const HomePage = () => {
  const bestSellers = useMemo(() => {
    const slugs = ["daily-slap-487", "panama-punch", "grape-gummmies-411", "beaker-glass-bong-wpc368-american-purple"];
    return slugs
      .map((s) => allProducts.find((p) => p.slug.includes(s)))
      .filter((p): p is NonNullable<typeof p> => p != null);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1a2e1a" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="relative z-10 text-center px-5 max-w-3xl">
          <h1 className="text-primary-foreground font-serif font-bold text-[30px] md:text-[50px] leading-tight mb-6">
            Your Premium Cannabis Store
          </h1>
          <p className="text-primary-foreground/90 text-[17px] mb-10 leading-relaxed">
            The Divine Collective offers top-tier cannabis products.
          </p>
          <Link to="/categories" className="btn-pill-white">
            SHOP OUR PRODUCTS
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-background">
        <div className="container-main grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-dark-placeholder w-full" style={{ height: 400 }} />
          <div>
            <p className="section-label mb-3">GET TO KNOW US</p>
            <h2 className="section-heading mb-6">About The Divine Collective</h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                The Divine Collective is where quality cannabis meets elevated living. We offer a curated selection of premium cannabis products, wellness goods, and top-tier equipment, all carefully sourced for safety, purity, and performance.
              </p>
              <p>
                At The Divine Collective, our mission is to redefine the cannabis experience in South Africa through premium, ethically sourced products that honour the plant's natural richness. Rooted in quality, craftsmanship, and sustainability, we offer more than exceptional cannabis, we offer a lifestyle elevated by intention and authenticity.
              </p>
              <p>
                We aspire to cultivate a community of discerning individuals who seek wellness, embrace luxury, and value integrity in every step of their cannabis journey.
              </p>
            </div>
            <Link to="/categories" className="btn-pill-green mt-8 inline-block">
              SHOP OUR PRODUCTS
            </Link>
          </div>
        </div>
      </section>

      {/* Lounge Banner */}
      <section className="section-padding relative overflow-hidden" style={{ backgroundColor: "#08140e" }}>
        {/* Decorative circles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/40" />
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-primary/30" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-primary/20" />
        </div>
        <div className="container-main relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-[60%]">
            <h3 className="text-primary-foreground font-serif text-[28px] md:text-[36px] font-bold mb-4">
              Exclusive Lounge Access
            </h3>
            <p className="text-primary-foreground/80 text-base leading-relaxed">
              The Divine Collective's lounge is a chill, members-only space to unwind, enjoy premium products, and connect. Whether you're here for a quiet session or exclusive events, it's your escape from the buzz outside.
            </p>
          </div>
          <div className="md:w-[40%] md:text-right">
            <Link to="/lounge" className="btn-pill-white">
              VIEW THE LOUNGE
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section-padding bg-background">
        <div className="container-main">
          <h2 className="font-serif text-primary text-[36px] md:text-[42px] italic text-center mb-12">
            Our Best Sellers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((p) => p && (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-background">
        <div className="container-main grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-dark-placeholder w-full order-2 md:order-1" style={{ height: 400 }} />
          <div className="order-1 md:order-2">
            <p className="section-label mb-3">OUR MISSION</p>
            <h2 className="section-heading mb-6">Why Choose Us</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              At The Divine Collective, we offer more than just cannabis, we deliver a premium experience rooted in quality, sustainability, and luxury.
            </p>
            <p className="font-bold text-sm mb-3 text-foreground">Why discerning customers choose us:</p>
            <ul className="space-y-2 mb-8">
              {bulletPoints.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <Link to="/categories" className="btn-pill-green inline-block">
              SHOP OUR PRODUCTS
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews + Gallery */}
      <section className="section-padding bg-background">
        <div className="container-main grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Reviews */}
          <div>
            <p className="section-label mb-6">OUR REVIEWS</p>
            <div className="border border-primary/20 rounded-sm p-5">
              <p className="font-bold text-sm mb-1 text-foreground">Sarah M.</p>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                "Absolutely love The Divine Collective! The quality of their products is unmatched and the lounge experience is incredible."
              </p>
              <p className="text-[11px] text-muted-foreground">
                Google rating score: 5.0 of 5, based on 267 reviews
              </p>
            </div>
          </div>
          {/* Gallery images */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-2 border-primary">
              <div className="bg-dark-placeholder w-full" style={{ height: 350 }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
