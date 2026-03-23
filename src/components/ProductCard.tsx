import { Link } from "react-router-dom";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group cursor-pointer transition-transform duration-200 hover:-translate-y-1 block"
    >
      <div className="w-full aspect-[3/4] mb-4 overflow-hidden bg-product-placeholder">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-product-placeholder" />
        )}
      </div>
      <p className="text-primary uppercase text-xs tracking-[2px] font-semibold mb-1">
        {product.category}
      </p>
      <h3 className="font-serif text-primary font-bold text-base mb-1 leading-snug line-clamp-2">
        {product.name}
      </h3>
      <div className="flex items-center gap-2 mb-2">
        {product.salePrice !== null && product.salePrice < product.price ? (
          <>
            <span className="text-muted-foreground line-through text-sm">
              R{product.price.toFixed(2)}
            </span>
            <span className="text-primary font-bold text-lg">
              R{product.salePrice.toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-primary font-bold text-lg">
            R{product.price.toFixed(2)}
          </span>
        )}
      </div>
      <span className="text-primary text-xs uppercase tracking-[2px] underline font-semibold group-hover:no-underline">
        SHOP NOW
      </span>
    </Link>
  );
};

export default ProductCard;
