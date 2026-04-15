import { useParams, Link } from "react-router-dom";
import { getProductBySlug, getRelatedProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useStrainByName, useFlowerStrainData } from "@/hooks/useFlowerStrainData";
import { getCategoryColors, getFeelingColor } from "@/lib/strainUtils";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const product = slug ? getProductBySlug(slug) : undefined;

  const isFlower = product?.category === "Flowers";
  const { data: strainData } = useStrainByName(isFlower ? product!.name : "");
  const { data: strainMap } = useFlowerStrainData();

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

  const displayImage = (isFlower && strainData?.image_url) || product.image;
  const displayDescription = (isFlower && strainData?.description) || product.description;
  const categoryColors = strainData ? getCategoryColors(strainData.category) : null;

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
          <div className="w-full aspect-square overflow-hidden bg-product-placeholder relative">
            {displayImage ? (
              <img
                src={displayImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-product-placeholder" />
            )}
            {strainData && (
              <span
                className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs uppercase tracking-[1.5px] font-bold"
                style={{
                  backgroundColor: categoryColors!.bg,
                  color: categoryColors!.text,
                }}
              >
                {strainData.category}
              </span>
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

            {/* THC/CBD Range */}
            {strainData && (strainData.thc_max || strainData.cbd_max) && (
              <div className="flex gap-6 mb-6">
                {strainData.thc_max !== null && strainData.thc_max > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">THC</p>
                    <p className="text-primary font-bold text-lg">
                      {strainData.thc_min}–{strainData.thc_max}%
                    </p>
                  </div>
                )}
                {strainData.cbd_max !== null && strainData.cbd_max > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">CBD</p>
                    <p className="text-primary font-bold text-lg">
                      {strainData.cbd_min}–{strainData.cbd_max}%
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {displayDescription && (
              <div className="mb-8">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {displayDescription}
                </p>
              </div>
            )}

            {/* Feelings pills */}
            {strainData?.feelings && strainData.feelings.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Feelings</p>
                <div className="flex flex-wrap gap-2">
                  {strainData.feelings.map((f) => {
                    const colors = getFeelingColor(f);
                    return (
                      <span
                        key={f}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: colors.bg, color: colors.text }}
                      >
                        {f}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SKU */}
            {product.sku && (
              <p className="text-xs text-muted-foreground mb-6">
                SKU: {product.sku}
              </p>
            )}

            {/* CTA Button */}
            <button
              className="btn-pill-green w-full sm:w-auto"
              onClick={() => {
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: displayPrice,
                  category: product.category,
                  image: displayImage,
                });
                toast.success(`${product.name} added to cart`, {
                  duration: 2000,
                  style: { background: "hsl(153, 82%, 18%)", color: "white", border: "none" },
                });
              }}
            >
              ADD TO CART
            </button>

            {/* Strain Library Link */}
            {strainData?.slug && (
              <Link
                to={`/strains/${strainData.slug}`}
                className="block mt-4 text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-[2px] underline"
              >
                View in Strain Library →
              </Link>
            )}
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
                <ProductCard
                  key={p.id}
                  product={p}
                  strainData={p.category === "Flowers" ? strainMap?.get(p.name.toLowerCase()) : undefined}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
