import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { products, categories, getProductsByCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Truck, Package, Armchair, Star } from "lucide-react";

const PRODUCTS_PER_PAGE = 16;

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

const CategoriesPage = () => {
  const { category: urlCategory } = useParams<{ category?: string }>();
  const initialCategory = urlCategory
    ? categories.find(
        (c) => c.toLowerCase() === decodeURIComponent(urlCategory).toLowerCase()
      ) || "All"
    : "All";

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
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

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
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
            <span className="text-foreground font-medium">Shop</span>
          </nav>
          <h1 className="section-heading text-[42px] mb-4 text-center">
            Shop By Category
          </h1>
          <div className="w-16 h-[1px] bg-primary mx-auto" />
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="pb-20 bg-background">
        <div className="container-main">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2 text-xs uppercase tracking-[2px] font-semibold border transition-all duration-300 rounded-full ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count + Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              {Math.min((page - 1) * PRODUCTS_PER_PAGE + 1, filtered.length)}–
              {Math.min(page * PRODUCTS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length} results
            </p>
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
              <ProductCard key={product.id} product={product} />
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
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }
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
