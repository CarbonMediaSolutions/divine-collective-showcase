import { useState, useEffect, useMemo } from "react";
import { Search, Plus, Edit2, Trash2, Upload, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LightspeedPanel from "./LightspeedPanel";

interface Product {
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

const CATEGORIES = ["Edibles", "Flowers", "Accessories", "Concentrates", "Vape Products", "Preroll", "Membership", "Uncategorized"];

const emptyProduct = {
  name: "",
  slug: "",
  sku: "",
  category: "Uncategorized",
  subcategory: "",
  price: 0,
  sale_price: null as number | null,
  description: "",
  image_url: "",
  in_stock: true,
  visible: true,
  featured: false,
};

const ProductsTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "visible" | "hidden">("all");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "category-asc" | "category-desc">("name-asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [generating, setGenerating] = useState(false);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*").order("name").limit(2000);
    if (error) toast.error("Failed to load products");
    setProducts((data as Product[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = products;
    if (q) {
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.sku || "").includes(q)
      );
    }
    if (categoryFilter !== "all") result = result.filter((p) => p.category === categoryFilter);
    if (visibilityFilter === "visible") result = result.filter((p) => p.visible);
    if (visibilityFilter === "hidden") result = result.filter((p) => !p.visible);

    const sorted = [...result];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "category-asc":
          return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
        case "category-desc":
          return b.category.localeCompare(a.category) || a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    return sorted;
  }, [search, products, categoryFilter, visibilityFilter, sortBy]);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleToggle = async (product: Product, field: "visible" | "in_stock" | "featured") => {
    const newVal = !product[field];
    setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, [field]: newVal } : p));
    const update: Record<string, boolean> = { [field]: newVal };
    const { error } = await supabase.from("products").update(update as any).eq("id", product.id);
    if (error) {
      toast.error("Failed to update");
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, [field]: !newVal } : p));
    }
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyProduct);
    setImageFile(null);
    setImagePreview("");
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      slug: p.slug,
      sku: p.sku || "",
      category: p.category,
      subcategory: p.subcategory || "",
      price: Number(p.price),
      sale_price: p.sale_price !== null ? Number(p.sale_price) : null,
      description: p.description || "",
      image_url: p.image_url || "",
      in_stock: p.in_stock ?? true,
      visible: p.visible ?? true,
      featured: p.featured ?? false,
    });
    setImageFile(null);
    setImagePreview(p.image_url || "");
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Product deleted");
    fetchProducts();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File, slug: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${slug || "product"}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleGenerate = async () => {
    if (!form.name || form.name.trim().length < 2) {
      toast.error("Enter a product name first");
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-product-description", {
        body: { name: form.name.trim(), category: form.category },
      });
      if (error) throw new Error(error.message || "Failed");
      if (data?.error) throw new Error(data.error);
      if (data?.description) {
        setForm((f) => ({ ...f, description: data.description }));
        toast.success("Description generated!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate description");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const slug = form.slug || generateSlug(form.name);
      let imageUrl = form.image_url;
      if (imageFile) imageUrl = await uploadImage(imageFile, slug);

      const payload = {
        name: form.name.trim(),
        slug,
        sku: form.sku,
        category: form.category,
        subcategory: form.subcategory,
        price: Number(form.price) || 0,
        sale_price: form.sale_price !== null && form.sale_price !== undefined && String(form.sale_price) !== "" ? Number(form.sale_price) : null,
        description: form.description,
        image_url: imageUrl,
        in_stock: form.in_stock,
        visible: form.visible,
        featured: form.featured,
      };

      if (editing) {
        const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Product updated");
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast.success("Product added");
      }
      setDialogOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <LightspeedPanel onSyncComplete={fetchProducts} />
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A → Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z → A)</SelectItem>
            <SelectItem value="category-asc">Category (A → Z)</SelectItem>
            <SelectItem value="category-desc">Category (Z → A)</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1">
          {(["all", "visible", "hidden"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setVisibilityFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wider transition-all ${
                visibilityFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border/20 text-foreground/70 hover:border-primary/40"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{filtered.length} products</span>
        <Button onClick={openNew} size="sm" className="gap-2">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading products...</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Sale</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 200).map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded object-cover" onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }} />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-[220px] truncate">{p.name}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{p.category}</Badge></TableCell>
                  <TableCell className="text-right">R{Number(p.price).toFixed(2)}</TableCell>
                  <TableCell className="text-right">{p.sale_price ? `R${Number(p.sale_price).toFixed(2)}` : "—"}</TableCell>
                  <TableCell><Switch checked={!!p.visible} onCheckedChange={() => handleToggle(p, "visible")} /></TableCell>
                  <TableCell><Switch checked={!!p.in_stock} onCheckedChange={() => handleToggle(p, "in_stock")} /></TableCell>
                  <TableCell><Switch checked={!!p.featured} onCheckedChange={() => handleToggle(p, "featured")} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Edit2 size={14} /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 size={14} className="text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length > 200 && (
            <p className="text-center text-sm text-muted-foreground py-3">Showing first 200 of {filtered.length}</p>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div>
              <Label>Image</Label>
              <div className="flex items-center gap-4 mt-1">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">No image</div>
                )}
                <label className="cursor-pointer">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md border text-sm hover:bg-accent transition-colors">
                    <Upload size={14} /> Upload
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                <Input
                  placeholder="Or paste image URL"
                  value={form.image_url}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, image_url: e.target.value }));
                    if (!imageFile) setImagePreview(e.target.value);
                  }}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({ ...f, name, slug: editing ? f.slug : generateSlug(name) }));
                  }}
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subcategory</Label>
                <Input value={form.subcategory} onChange={(e) => setForm((f) => ({ ...f, subcategory: e.target.value }))} />
              </div>
              <div>
                <Label>SKU</Label>
                <Input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price (R)</Label>
                <Input type="number" step="0.01" value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <Label>Sale Price (R) — optional</Label>
                <Input type="number" step="0.01" value={form.sale_price ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, sale_price: e.target.value === "" ? null : parseFloat(e.target.value) }))} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Description</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={generating || form.name.trim().length < 2}
                  className="gap-1 h-7 text-xs"
                >
                  <Sparkles size={12} className={generating ? "animate-spin" : ""} />
                  {generating ? "Generating..." : "Generate with AI"}
                </Button>
              </div>
              <Textarea rows={5} value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>

            <div className="flex items-center gap-6 pt-2 border-t">
              <div className="flex items-center gap-2">
                <Switch checked={form.visible} onCheckedChange={(v) => setForm((f) => ({ ...f, visible: v }))} />
                <Label>Visible</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.in_stock} onCheckedChange={(v) => setForm((f) => ({ ...f, in_stock: v }))} />
                <Label>In Stock</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.featured} onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))} />
                <Label>Featured</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsTab;
