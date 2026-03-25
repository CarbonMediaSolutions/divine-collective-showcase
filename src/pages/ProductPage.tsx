import { useParams, Link } from "react-router-dom";
import { getProductBySlug, getRelatedProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return (
      <div className="section-padding bg-background">
        <div className="container-main text-center">
          <h1 className="section-heading text-[36px] mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/categories" className="btn-pill-green inline-block">
            BACK TO SHOP
          </Link>
        </div>
      </div>
    );
  }

  const related = getRelatedProducts(product, 4);
  const displayPrice =
    product.salePrice !== null && product.salePrice < product.price
      ? product.salePrice
      : product.price;
  const hasDiscount =
    product.salePrice !== null && product.salePrice < product.price;

  return (
    <div>
      {/* Breadcrumb */}
      <section className="pt-8 pb-4 bg-background">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/categories"
              className="hover:text-primary transition-colors"
            >
              Shop
            </Link>
            <span>/</span>
            <Link
              to={`/categories/${encodeURIComponent(product.category.toLowerCase())}`}
              className="hover:text-primary transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium line-clamp-1">
              {product.name}
            </span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="pb-16 bg-background">
        <div className="container-main grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="w-full aspect-square overflow-hidden bg-product-placeholder">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-product-placeholder" />
            )}
          </div>

          {/* Details */}
          <div className="py-4">
            <p className="text-primary uppercase text-xs tracking-[2px] font-semibold mb-3">
              {product.category}
              {product.subcategory && ` / ${product.subcategory}`}
            </p>
            <h1 className="font-serif text-primary font-bold text-[32px] md:text-[40px] leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              {hasDiscount && (
                <span className="text-muted-foreground line-through text-xl">
                  R{product.price.toFixed(2)}
                </span>
              )}
              <span className="text-primary font-bold text-2xl md:text-3xl">
                R{displayPrice.toFixed(2)}
              </span>
            </div>

            {/* Stock */}
            <p
              className={`text-sm font-semibold mb-6 ${
                product.inStock ? "text-primary" : "text-destructive"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </p>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* SKU */}
            {product.sku && (
              <p className="text-xs text-muted-foreground mb-6">
                SKU: {product.sku}
              </p>
            )}

            {/* CTA Button */}
            <button className="btn-pill-green w-full sm:w-auto">
              ADD TO CART
            </button>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section-padding bg-background border-t border-primary/10">
          <div className="container-main">
            <h2 className="font-serif text-primary text-[28px] md:text-[36px] italic text-center mb-12">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
