import { useEffect, useState } from "react";
import { Plug, RefreshCw, Unplug, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TokenRow {
  id: string;
  domain_prefix: string;
  expires_at: string;
  last_sync_at: string | null;
}

interface Props {
  onSyncComplete?: () => void;
}

const LightspeedPanel = ({ onSyncComplete }: Props) => {
  const [token, setToken] = useState<TokenRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("lightspeed_tokens")
      .select("id, domain_prefix, expires_at, last_sync_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setToken(data as TokenRow | null);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // If user came back from OAuth callback
    const params = new URLSearchParams(window.location.search);
    if (params.get("lightspeed") === "connected") {
      toast.success("Lightspeed connected!");
      window.history.replaceState({}, "", window.location.pathname);
      load();
    }
  }, []);

  const handleConnect = () => {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const url = `https://${projectId}.supabase.co/functions/v1/lightspeed-oauth-start`;
    window.location.href = url;
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-lightspeed-products");
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      toast.success(`Synced ${data?.synced ?? 0} products from Lightspeed`);
      if (data?.errors?.length) {
        console.warn("Sync errors:", data.errors);
        toast.warning(`${data.errors.length} products had issues — check console`);
      }
      await load();
      onSyncComplete?.();
    } catch (err: any) {
      toast.error(err.message || "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Disconnect Lightspeed? Existing synced products will remain.")) return;
    if (!token) return;
    await supabase.from("lightspeed_tokens").delete().eq("id", token.id);
    setToken(null);
    toast.success("Disconnected");
  };

  if (loading) return null;

  return (
    <div className="rounded-lg border border-border/30 bg-card/50 p-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
            {token ? (
              <CheckCircle2 size={18} className="text-primary" />
            ) : (
              <Plug size={18} className="text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-semibold text-sm">Lightspeed Retail (X-Series)</p>
            {token ? (
              <p className="text-xs text-muted-foreground">
                Connected to <span className="font-mono">{token.domain_prefix}</span>
                {token.last_sync_at && (
                  <> · Last sync {new Date(token.last_sync_at).toLocaleString()}</>
                )}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Not connected — sync your store catalogue automatically
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {token ? (
            <>
              <Button onClick={handleSync} disabled={syncing} size="sm" className="gap-2">
                <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
                {syncing ? "Syncing..." : "Sync Now"}
              </Button>
              <Button onClick={handleDisconnect} variant="outline" size="sm" className="gap-2">
                <Unplug size={14} /> Disconnect
              </Button>
            </>
          ) : (
            <Button onClick={handleConnect} size="sm" className="gap-2">
              <Plug size={14} /> Connect Lightspeed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LightspeedPanel;
