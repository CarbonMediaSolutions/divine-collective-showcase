import { useState, useEffect, useMemo } from "react";
import { Lock, Package, Users, ShoppingCart, Search, Leaf } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { products } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import StrainsTab from "@/components/admin/StrainsTab";

const ADMIN_PASSWORD = "divine2026";

interface Order {
  id: string;
  customer_name: string;
  email: string | null;
  phone: string | null;
  items: any;
  total: number;
  status: string;
  payment_ref: string | null;
  payment_type: string | null;
  created_at: string;
}

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  id_number: string | null;
  status: string | null;
  joined_date: string | null;
  expiration_date: string | null;
}

const AdminPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <Lock className="mx-auto text-primary" size={48} />
          <h1 className="font-serif text-primary italic text-2xl">Admin Access</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password === ADMIN_PASSWORD) {
                setAuthenticated(true);
                setError("");
              } else {
                setError("Incorrect password");
              }
            }}
            className="space-y-4"
          >
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <button type="submit" className="btn-pill-green w-full py-3 text-sm">
              ENTER
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
};

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-primary/20 px-6 py-4">
        <h1 className="font-serif text-primary italic text-2xl">Divine Collective — Admin</h1>
      </div>
      <div className="p-6">
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products" className="gap-2"><Package size={16} />Products</TabsTrigger>
            <TabsTrigger value="strains" className="gap-2"><Leaf size={16} />Strains</TabsTrigger>
            <TabsTrigger value="members" className="gap-2"><Users size={16} />Members</TabsTrigger>
            <TabsTrigger value="sales" className="gap-2"><ShoppingCart size={16} />Sales</TabsTrigger>
          </TabsList>

          <TabsContent value="products"><ProductsTab /></TabsContent>
          <TabsContent value="strains"><StrainsTab /></TabsContent>
          <TabsContent value="members"><MembersTab /></TabsContent>
          <TabsContent value="sales"><SalesTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

/* ─── Products Tab ─── */
const ProductsTab = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.sku.includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <span className="text-sm text-muted-foreground">{filtered.length} products</span>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Sale</TableHead>
              <TableHead>Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.slice(0, 100).map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell className="text-right">R{p.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">{p.salePrice ? `R${p.salePrice.toFixed(2)}` : "—"}</TableCell>
                <TableCell>
                  <Badge variant={p.inStock ? "default" : "destructive"} className="text-xs">
                    {p.inStock ? "In Stock" : "Out"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length > 100 && (
          <p className="text-center text-sm text-muted-foreground py-3">Showing first 100 of {filtered.length} results</p>
        )}
      </div>
    </div>
  );
};

/* ─── Members Tab ─── */
const MembersTab = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("members")
      .select("id, first_name, last_name, email, phone, id_number, status, joined_date, expiration_date")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setMembers((data as Member[]) || []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        `${m.first_name} ${m.last_name}`.toLowerCase().includes(q) ||
        (m.email?.toLowerCase().includes(q)) ||
        (m.phone?.includes(q))
    );
  }, [search, members]);

  const isExpired = (date: string | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <span className="text-sm text-muted-foreground">{filtered.length} members</span>
      </div>
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading members...</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>ID Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Expiry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.first_name} {m.last_name}</TableCell>
                  <TableCell className="text-sm">{m.email || "—"}</TableCell>
                  <TableCell className="text-sm">{m.phone || "—"}</TableCell>
                  <TableCell className="font-mono text-xs">{m.id_number || "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={m.status === "Active" && !isExpired(m.expiration_date) ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {isExpired(m.expiration_date) ? "Expired" : m.status || "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{m.joined_date || "—"}</TableCell>
                  <TableCell className="text-sm">{m.expiration_date || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

/* ─── Sales Tab ─── */
const SalesTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) || []);
        setLoading(false);
      });
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{orders.length} orders</span>
        <span className="text-sm font-semibold text-primary">Total Revenue: R{totalRevenue.toFixed(2)}</span>
      </div>
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground text-sm">No orders yet.</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ref</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="text-sm whitespace-nowrap">
                    {new Date(o.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{o.customer_name}</TableCell>
                  <TableCell className="text-sm">{o.email || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{o.payment_type || "order"}</Badge>
                  </TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">
                    {Array.isArray(o.items) ? o.items.map((i: any) => `${i.name} ×${i.quantity}`).join(", ") : "—"}
                  </TableCell>
                  <TableCell className="text-right font-semibold">R{Number(o.total).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="text-xs">{o.status}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{o.payment_ref || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
