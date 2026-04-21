import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: number;          // legacy numeric id (used by cart)
  uuid: string;        // db uuid
  slug: string;
  name: string;
  price: number;
  salePrice: number | null;
  category: string;
  subcategory: string;
  image: string;
  description: string;
  inStock: boolean;
  sku: string;
  visible: boolean;
  featured: boolean;
}

interface DbProduct {
  id: string;
  legacy_id: number | null;
  name: string;
  slug: string;
  sku: string | null;
  category: string;
  subcategory: string | null;
  price: number;
  sale_price: number | null;
  description: string | null;
  image_url: string | null;
  in_stock: boolean | null;
  visible: boolean | null;
  featured: boolean | null;
}

const mapProduct = (p: DbProduct): Product => ({
  id: p.legacy_id ?? Math.abs(hashCode(p.id)),
  uuid: p.id,
  slug: p.slug,
  name: p.name,
  price: Number(p.price),
  salePrice: p.sale_price !== null ? Number(p.sale_price) : null,
  category: p.category,
  subcategory: p.subcategory || "",
  image: p.image_url || "",
  description: p.description || "",
  inStock: p.in_stock ?? true,
  sku: p.sku || "",
  visible: p.visible ?? true,
  featured: p.featured ?? false,
});

const hashCode = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
  return h;
};

export const categories = [
  "All",
  "Edibles",
  "Flowers",
  "Accessories",
  "Concentrates",
  "Vape Products",
  "Preroll",
  "Membership",
] as const;

export const useProducts = (opts: { onlyVisible?: boolean } = {}) => {
  const { onlyVisible = true } = opts;
  return useQuery({
    queryKey: ["products", { onlyVisible }],
    queryFn: async () => {
      let query = supabase.from("products").select("*").order("name").limit(2000);
      if (onlyVisible) query = query.eq("visible", true);
      const { data, error } = await query;
      if (error) throw error;
      return ((data as DbProduct[]) || []).map(mapProduct);
    },
    staleTime: 60_000,
  });
};

export const useProductBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data ? mapProduct(data as DbProduct) : null;
    },
    enabled: !!slug,
  });
};
