import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const price = product.salePrice !== null && product.salePrice < product.price ? product.salePrice : product.price;
    addToCart({
      id: product.id,
      name: product.name,
      price,
      category: product.category,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`, {
      duration: 2000,
      style: { background: "hsl(153, 82%, 18%)", color: "white", border: "none" },
    });
  };

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
      <button
        onClick={handleAddToCart}
        className="text-primary text-xs uppercase tracking-[2px] underline font-semibold group-hover:no-underline"
      >
        ADD TO CART
      </button>
    </Link>
  );
};

export default ProductCard;
