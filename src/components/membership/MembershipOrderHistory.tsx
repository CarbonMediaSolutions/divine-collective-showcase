import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  items: any[];
  payment_ref: string | null;
}

interface MembershipOrderHistoryProps {
  orders: Order[];
  loading: boolean;
}

const MembershipOrderHistory = ({ orders, loading }: MembershipOrderHistoryProps) => {
  return (
    <div>
      <h2 className="font-serif text-primary text-xl md:text-2xl mb-6 text-center">Order History</h2>
      {loading ? (
        <div className="text-center py-8">
          <Loader2 size={24} className="animate-spin text-primary mx-auto" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 bg-card border border-primary/10 rounded-xl">
          <p className="text-muted-foreground text-sm">No orders yet.</p>
          <Link to="/categories" className="text-primary text-sm underline mt-2 inline-block">Start shopping →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-card border border-primary/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-foreground font-semibold text-sm">
                  {Array.isArray(order.items)
                    ? order.items.map((i: any) => i.name).join(", ")
                    : "Order"}
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  {format(new Date(order.created_at), "dd MMM yyyy, HH:mm")}
                  {order.payment_ref && <span className="ml-2">• Ref: {order.payment_ref}</span>}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] uppercase tracking-[1.5px] font-bold px-3 py-1 rounded-full ${
                  order.status === "completed" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {order.status}
                </span>
                <span className="text-foreground font-bold text-sm">R{Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MembershipOrderHistory;
