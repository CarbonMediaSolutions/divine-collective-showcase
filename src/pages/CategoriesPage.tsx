import { useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { products, categories, getProductsByCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useFlowerStrainData } from "@/hooks/useFlowerStrainData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { Truck, Package, Armchair, Star } from "lucide-react";

const PRODUCTS_PER_PAGE = 16;
const SHOP_USERNAME = "divine";
const SHOP_PASSWORD = "divine2026";

const categoryCards = [
  { name: "Accessories", video: "/videos/categories/Accessories.mp4" },
  { name: "Concentrates", video: "/videos/categories/Concentrates.mp4" },
  { name: "Preroll", label: "Prerolls", video: "/videos/categories/Prerolls.mp4" },
  { name: "Edibles", video: "/videos/categories/Edibles.mp4" },
  { name: "Flowers", label: "Flower", video: "/videos/categories/Flower.mp4" },
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

type SortOption = "latest" | "price-asc" | "price-desc" | "name-asc";

const CategoryVideoCard = ({
  card,
  onClick,
}: {
  card: (typeof categoryCards)[0];
  onClick: () => void;
}) => {
  return (
    <div
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="border border-border overflow-hidden bg-background aspect-square flex items-center justify-center">
        <video
          src={card.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="pt-3">
        <h3 className="text-foreground font-semibold text-base mb-1 font-body">
          {card.label || card.name}
        </h3>
        <span className="text-foreground text-xs font-bold uppercase tracking-[1.5px] underline underline-offset-4 group-hover:text-primary transition-colors">
          Shop Now
        </span>
      </div>
    </div>
  );
};

const CategoriesPage = () => {
  const { category: urlCategory } = useParams<{ category?: string }>();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("shopAccess") === "true";
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const initialCategory = urlCategory
    ? categories.find(
        (c) => c.toLowerCase() === decodeURIComponent(urlCategory).toLowerCase()
      ) || null
    : null;

  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [page, setPage] = useState(1);

  const { data: strainMap } = useFlowerStrainData();

  const handleShopLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === SHOP_USERNAME && password === SHOP_PASSWORD) {
      sessionStorage.setItem("shopAccess", "true");
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid username or password");
    }
  };

  const filtered = useMemo(() => {
    if (!activeCategory) return [];
    let items = getProductsByCategory(activeCategory);
    switch (sortBy) {
      case "price-asc":
        items = [...items].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items = [...items].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        items = [...items].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return items;
  }, [activeCategory, sortBy]);

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const handleCategoryClick = (catName: string) => {
    setActiveCategory(catName);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToCategories = () => {
    setActiveCategory(null);
    setPage(1);
  };

  return (
    <div>
      {/* Breadcrumb + Header */}
      <section className="pt-8 pb-4 bg-background">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            {activeCategory ? (
              <>
                <button
                  onClick={handleBackToCategories}
                  className="hover:text-primary transition-colors"
                >
                  Shop
                </button>
                <span>/</span>
                <span className="text-foreground font-medium">{activeCategory}</span>
              </>
            ) : (
              <span className="text-foreground font-medium">Shop</span>
            )}
          </nav>
          <h1 className="section-heading text-[42px] mb-4 text-center">
            {activeCategory ? activeCategory : "Shop By Category"}
          </h1>
          <div className="w-16 h-[1px] bg-primary mx-auto" />
        </div>
      </section>

      {/* Category Grid or Product Grid */}
      {!activeCategory ? (
        <section className="py-12 bg-background">
          <div className="container-main max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryCards.map((card) => (
                <CategoryVideoCard
                  key={card.name}
                  card={card}
                  onClick={() => handleCategoryClick(card.name)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="pb-20 bg-background">
          <div className="container-main">
            {/* Back + Sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToCategories}
                  className="px-5 py-2 text-xs uppercase tracking-[2px] font-semibold border border-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  ← All Categories
                </button>
                <p className="text-sm text-muted-foreground">
                  {filtered.length} product{filtered.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as SortOption)}
              >
                <SelectTrigger className="w-[200px] rounded-full border-primary text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Sort by latest</SelectItem>
                  <SelectItem value="price-asc">Price: low to high</SelectItem>
                  <SelectItem value="price-desc">Price: high to low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {paginated.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  strainData={product.category === "Flowers" ? strainMap?.get(product.name.toLowerCase()) : undefined}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-xs uppercase tracking-[2px] font-semibold border border-primary rounded-full disabled:opacity-30 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 7) pageNum = i + 1;
                  else if (page <= 4) pageNum = i + 1;
                  else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
                  else pageNum = page - 3 + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 ${
                        page === pageNum
                          ? "bg-primary text-primary-foreground"
                          : "text-primary hover:bg-primary/10"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-xs uppercase tracking-[2px] font-semibold border border-primary rounded-full disabled:opacity-30 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Benefits Bar */}
      <section className="bg-primary py-12">
        <div className="container-main grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="text-center">
              <b.icon size={28} className="text-primary-foreground mx-auto mb-3" />
              <h4 className="text-primary-foreground font-bold text-base mb-2 font-body">
                {b.title}
              </h4>
              <p className="text-primary-foreground/80 text-[13px] leading-relaxed">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;
