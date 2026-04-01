import { useState, useEffect, useMemo } from "react";
import { Search, Plus, Edit2, Trash2, Upload, X, Save, Sparkles } from "lucide-react";
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

interface Strain {
  id: string;
  name: string;
  slug: string;
  category: string;
  thc_min: number | null;
  thc_max: number | null;
  cbd_min: number | null;
  cbd_max: number | null;
  description: string | null;
  feelings: string[] | null;
  effects: string[] | null;
  flavours: string[] | null;
  terpenes: string[] | null;
  parents: string | null;
  image_url: string | null;
  in_stock: boolean | null;
  featured: boolean | null;
  grow_difficulty: string | null;
  grow_info: string | null;
  created_at: string | null;
}

const emptyStrain: Omit<Strain, "id" | "created_at"> = {
  name: "",
  slug: "",
  category: "Hybrid",
  thc_min: 0,
  thc_max: 0,
  cbd_min: 0,
  cbd_max: 0,
  description: "",
  feelings: [],
  effects: [],
  flavours: [],
  terpenes: [],
  parents: "",
  image_url: "",
  in_stock: true,
  featured: false,
  grow_difficulty: "Intermediate",
  grow_info: "",
};

const StrainsTab = () => {
  const [strains, setStrains] = useState<Strain[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Strain | null>(null);
  const [form, setForm] = useState(emptyStrain);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [autoFilling, setAutoFilling] = useState(false);

  const handleAutoFill = async () => {
    if (!form.name || form.name.trim().length < 2) {
      toast.error("Enter a strain name first (at least 2 characters)");
      return;
    }
    setAutoFilling(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-strain-data", {
        body: { name: form.name.trim() },
      });
      if (error) throw new Error(error.message || "Failed to generate data");
      if (data?.error) throw new Error(data.error);
      
      setForm((f) => ({
        ...f,
        category: data.category || f.category,
        thc_min: data.thc_min ?? f.thc_min,
        thc_max: data.thc_max ?? f.thc_max,
        cbd_min: data.cbd_min ?? f.cbd_min,
        cbd_max: data.cbd_max ?? f.cbd_max,
        description: data.description || f.description,
        feelings: data.feelings || f.feelings,
        effects: data.effects || f.effects,
        flavours: data.flavours || f.flavours,
        terpenes: data.terpenes || f.terpenes,
        parents: data.parents || f.parents,
        grow_difficulty: data.grow_difficulty || f.grow_difficulty,
        grow_info: data.grow_info || f.grow_info,
      }));
      toast.success("Fields auto-filled with AI data!");
    } catch (err: any) {
      toast.error(err.message || "Auto-fill failed");
    } finally {
      setAutoFilling(false);
    }
  };

  const fetchStrains = async () => {
    const { data } = await supabase.from("strains").select("*").order("name");
    setStrains((data as Strain[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchStrains(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return strains;
    return strains.filter(
      (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.slug.includes(q)
    );
  }, [search, strains]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyStrain);
    setImageFile(null);
    setImagePreview("");
    setDialogOpen(true);
  };

  const openEdit = (s: Strain) => {
    setEditing(s);
    setForm({
      name: s.name,
      slug: s.slug,
      category: s.category,
      thc_min: s.thc_min,
      thc_max: s.thc_max,
      cbd_min: s.cbd_min,
      cbd_max: s.cbd_max,
      description: s.description || "",
      feelings: s.feelings || [],
      effects: s.effects || [],
      flavours: s.flavours || [],
      terpenes: s.terpenes || [],
      parents: s.parents || "",
      image_url: s.image_url || "",
      in_stock: s.in_stock,
      featured: s.featured,
      grow_difficulty: s.grow_difficulty || "Intermediate",
      grow_info: s.grow_info || "",
    });
    setImageFile(null);
    setImagePreview(s.image_url || "");
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this strain?")) return;
    await supabase.from("strains").delete().eq("id", id);
    toast.success("Strain deleted");
    fetchStrains();
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File, slug: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${slug}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("strain-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("strain-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const slug = form.slug || generateSlug(form.name);
      let imageUrl = form.image_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, slug);
      }

      const payload = {
        name: form.name.trim(),
        slug,
        category: form.category,
        thc_min: form.thc_min || 0,
        thc_max: form.thc_max || 0,
        cbd_min: form.cbd_min || 0,
        cbd_max: form.cbd_max || 0,
        description: form.description,
        feelings: form.feelings,
        effects: form.effects,
        flavours: form.flavours,
        terpenes: form.terpenes,
        parents: form.parents,
        image_url: imageUrl,
        in_stock: form.in_stock,
        featured: form.featured,
        grow_difficulty: form.grow_difficulty,
        grow_info: form.grow_info,
      };

      if (editing) {
        const { error } = await supabase.from("strains").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Strain updated");
      } else {
        const { error } = await supabase.from("strains").insert(payload);
        if (error) throw error;
        toast.success("Strain added");
      }

      setDialogOpen(false);
      fetchStrains();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const updateArrayField = (field: string, value: string) => {
    const arr = value.split(",").map((s) => s.trim()).filter(Boolean);
    setForm((f) => ({ ...f, [field]: arr }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input placeholder="Search strains..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <span className="text-sm text-muted-foreground">{filtered.length} strains</span>
        <Button onClick={openNew} size="sm" className="gap-2">
          <Plus size={16} /> Add Strain
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading strains...</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>THC%</TableHead>
                <TableHead>Feelings</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 100).map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.name} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-[180px] truncate">{s.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{s.category}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{s.thc_min}–{s.thc_max}%</TableCell>
                  <TableCell className="text-xs max-w-[150px] truncate">
                    {(s.feelings || []).join(", ") || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.in_stock ? "default" : "destructive"} className="text-xs">
                      {s.in_stock ? "In Stock" : "Out"}
                    </Badge>
                  </TableCell>
                  <TableCell>{s.featured ? "⭐" : "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                        <Trash2 size={14} className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length > 100 && (
            <p className="text-center text-sm text-muted-foreground py-3">Showing first 100 of {filtered.length}</p>
          )}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Strain" : "Add New Strain"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Image */}
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
                {form.image_url && !imageFile && (
                  <Input
                    placeholder="Or paste image URL"
                    value={form.image_url}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, image_url: e.target.value }));
                      setImagePreview(e.target.value);
                    }}
                    className="flex-1"
                  />
                )}
              </div>
            </div>

            {/* Name + Slug */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({ ...f, name, slug: f.slug || generateSlug(name) }));
                  }}
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
              </div>
            </div>

            {/* Category + Grow Difficulty */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Indica">Indica</SelectItem>
                    <SelectItem value="Sativa">Sativa</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Grow Difficulty</Label>
                <Select value={form.grow_difficulty || "Intermediate"} onValueChange={(v) => setForm((f) => ({ ...f, grow_difficulty: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Difficult">Difficult</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* THC / CBD */}
            <div className="grid grid-cols-4 gap-3">
              <div>
                <Label>THC Min %</Label>
                <Input type="number" value={form.thc_min ?? 0} onChange={(e) => setForm((f) => ({ ...f, thc_min: +e.target.value }))} />
              </div>
              <div>
                <Label>THC Max %</Label>
                <Input type="number" value={form.thc_max ?? 0} onChange={(e) => setForm((f) => ({ ...f, thc_max: +e.target.value }))} />
              </div>
              <div>
                <Label>CBD Min %</Label>
                <Input type="number" value={form.cbd_min ?? 0} onChange={(e) => setForm((f) => ({ ...f, cbd_min: +e.target.value }))} />
              </div>
              <div>
                <Label>CBD Max %</Label>
                <Input type="number" value={form.cbd_max ?? 0} onChange={(e) => setForm((f) => ({ ...f, cbd_max: +e.target.value }))} />
              </div>
            </div>

            {/* Parents */}
            <div>
              <Label>Parents (genetics)</Label>
              <Input value={form.parents || ""} onChange={(e) => setForm((f) => ({ ...f, parents: e.target.value }))} placeholder="e.g. OG Kush x Durban Poison" />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea rows={3} value={form.description || ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>

            {/* Array fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Feelings (comma-separated)</Label>
                <Input value={(form.feelings || []).join(", ")} onChange={(e) => updateArrayField("feelings", e.target.value)} placeholder="Relaxed, Happy, Euphoric" />
              </div>
              <div>
                <Label>Effects (comma-separated)</Label>
                <Input value={(form.effects || []).join(", ")} onChange={(e) => updateArrayField("effects", e.target.value)} placeholder="Calming, Pain Relief" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Flavours (comma-separated)</Label>
                <Input value={(form.flavours || []).join(", ")} onChange={(e) => updateArrayField("flavours", e.target.value)} placeholder="Earthy, Sweet, Citrus" />
              </div>
              <div>
                <Label>Terpenes (comma-separated)</Label>
                <Input value={(form.terpenes || []).join(", ")} onChange={(e) => updateArrayField("terpenes", e.target.value)} placeholder="Myrcene, Limonene" />
              </div>
            </div>

            {/* Grow Info */}
            <div>
              <Label>Grow Info</Label>
              <Textarea rows={2} value={form.grow_info || ""} onChange={(e) => setForm((f) => ({ ...f, grow_info: e.target.value }))} />
            </div>

            {/* Toggles */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={!!form.in_stock} onCheckedChange={(v) => setForm((f) => ({ ...f, in_stock: v }))} />
                <Label>In Stock</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={!!form.featured} onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))} />
                <Label>Featured</Label>
              </div>
            </div>

            {/* Save */}
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save size={16} /> {saving ? "Saving..." : editing ? "Update Strain" : "Add Strain"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StrainsTab;
