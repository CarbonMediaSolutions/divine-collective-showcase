import { Link } from "react-router-dom";
import { Truck, Package, Armchair, Star } from "lucide-react";

const categories = [
  { name: "", id: 1 },
  { name: "", id: 2 },
  { name: "", id: 3 },
  { name: "Edibles", id: 4 },
  { name: "Flower", id: 5 },
];

const benefits = [
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "With over 5 different couriers that work with us, we always ensure we get the product to you as fast as possible.",
  },
  {
    icon: Package,
    title: "Free Shipping",
    desc: "Orders over R800 qualify for free shipping.",
  },
  {
    icon: Armchair,
    title: "Lounge Access",
    desc: "Due to South African law, all cannabis products must be sold through subscription. Our subscription gives you access to our lounge.",
  },
  {
    icon: Star,
    title: "5 Star Reviews",
    desc: "More than 200 customers have rated us 5 stars on Google!",
  },
];

const CategoriesPage = () => {
  return (
    <div>
      {/* Header */}
      <section className="section-padding bg-background">
        <div className="container-main text-center">
          <h1 className="section-heading text-[42px] mb-4">Shop By Category</h1>
          <div className="w-16 h-[1px] bg-primary mx-auto" />
        </div>
      </section>

      {/* Category Grid */}
      <section className="pb-20 bg-background">
        <div className="container-main grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="border-[1.5px] border-primary group cursor-pointer transition-transform duration-200 hover:-translate-y-1">
              <div className="bg-dark-placeholder w-full aspect-square" />
              {cat.name && (
                <div className="p-4">
                  <h3 className="font-serif font-bold text-primary text-lg mb-2">{cat.name}</h3>
                  <Link to="/categories" className="text-primary text-xs uppercase tracking-[2px] underline font-semibold hover:no-underline">
                    SHOP NOW
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="bg-primary py-12">
        <div className="container-main grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="text-center">
              <b.icon size={28} className="text-primary-foreground mx-auto mb-3" />
              <h4 className="text-primary-foreground font-bold text-base mb-2 font-body">{b.title}</h4>
              <p className="text-primary-foreground/80 text-[13px] leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;
