import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Leaf, Star, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  getCategoryColors,
  getFeelingColor,
  getTerpeneColor,
  terpeneDescriptions,
  effectEmojis,
  flavourEmojis,
} from "@/lib/strainUtils";

// Map strain slugs to product slugs in the shop
const strainToProductSlug: Record<string, string> = {
  "alien-cookies": "alien-cookies-459",
  "mimosa": "mimosa-463",
  "jungle-diamonds": "jungle-diamonds-466",
  "blue-walker": "blue-walker-467",
  "panama-punch": "panama-punch-469",
  "sugar-cane": "sugar-cane-477",
  "violet-bag": "violet-bag-484",
  "elvis": "elvis-496",
  "watermelon": "watermelon-500",
  "maui-wowie": "maui-wowie-576",
};

type Strain = {
  id: string;
  name: string;
  slug: string;
  category: string;
  thc_min: number;
  thc_max: number;
  cbd_min: number;
  cbd_max: number;
  parents: string | null;
  flavours: string[];
  effects: string[];
  feelings: string[];
  terpenes: string[];
  description: string;
  grow_info: string;
  grow_difficulty: string;
  image_url: string;
  in_stock: boolean;
  featured: boolean;
  is_preroll: boolean;
};

const StrainDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: strain, isLoading } = useQuery({
    queryKey: ["strain", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("strains")
        .select("*")
        .eq("slug", slug!)
        .eq("visible", true)
        .single();
      if (error) throw error;
      return data as Strain;
    },
    enabled: !!slug,
  });

  const { data: similarStrains = [] } = useQuery({
    queryKey: ["similar-strains", strain?.category, strain?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("strains")
        .select("id, name, slug, category, image_url, thc_min, thc_max")
        .eq("category", strain!.category)
        .eq("visible", true)
        .neq("id", strain!.id)
        .limit(3);
      if (error) throw error;
      return data as Strain[];
    },
    enabled: !!strain,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Leaf className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!strain) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Strain not found.</p>
        <Link to="/strains" className="text-primary underline text-sm">← Back to library</Link>
      </div>
    );
  }

  const catColors = getCategoryColors(strain.category);
  const thcBarWidth = ((strain.thc_min + strain.thc_max) / 2) / 35 * 100;
  const cbdBarWidth = ((strain.cbd_min + strain.cbd_max) / 2) / 35 * 100;

  // Determine vibe tagline
  const taglines: Record<string, string> = {
    Indica: "Deep relaxation & calm",
    Sativa: "Energising & uplifting",
    Hybrid: "Balanced & versatile",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-main py-6 md:py-10">
        {/* Breadcrumb */}
        <Link to="/strains" className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={14} /> Back to Strain Library
        </Link>

        {/* Hero - 2 column */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 mb-12">
          {/* Left - Image */}
          <div className="md:col-span-2">
            <div className="rounded-xl overflow-hidden bg-muted aspect-[3/4] max-h-[450px]">
              {strain.image_url ? (
                <img src={strain.image_url} alt={strain.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Leaf className="text-primary/15" size={80} />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span
                className="px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wider"
                style={{ backgroundColor: catColors.bg, color: catColors.text }}
              >
                {strain.category.toUpperCase()}
              </span>
              <span
                className={`px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wider ${
                  strain.in_stock
                    ? "bg-[rgba(26,92,36,0.12)] text-[#1a5c24]"
                    : "bg-[rgba(180,60,60,0.1)] text-[#8b3a3a]"
                }`}
              >
                {strain.in_stock ? "In Stock" : "Out of Stock"}
              </span>
              {strain.is_preroll && (
                <span className="px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wider bg-primary text-primary-foreground">
                  Available as Pre-Roll
                </span>
              )}
            </div>
          </div>

          {/* Right - Info */}
          <div className="md:col-span-3">
            <h1 className="font-serif text-3xl md:text-[48px] font-bold text-primary leading-tight mb-1">
              {strain.name}
            </h1>
            <p className="text-muted-foreground italic text-[15px] mb-4">
              {taglines[strain.category] || "A premium experience"}
            </p>

            {/* Star rating placeholder */}
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className={i < 4 ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"} />
              ))}
            </div>

            {/* Genetics */}
            {strain.parents && (
              <p className="text-[13px] text-muted-foreground mb-5">
                <span className="font-semibold text-foreground/70">Parents:</span> {strain.parents}
              </p>
            )}

            {/* Feelings pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(strain.feelings || []).map((f) => {
                const fc = getFeelingColor(f);
                return (
                  <span
                    key={f}
                    className="px-4 py-1.5 rounded-full text-[13px] font-semibold"
                    style={{ backgroundColor: fc.bg, color: fc.text }}
                  >
                    {f}
                  </span>
                );
              })}
            </div>

            {/* Cannabinoids */}
            <div className="mb-2">
              <p className="text-[10px] font-semibold tracking-[3px] text-muted-foreground uppercase mb-3">
                Cannabinoids
              </p>
              {/* THC */}
              <div className="mb-3">
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="font-semibold">THC</span>
                  <span className="text-muted-foreground">{strain.thc_min}–{strain.thc_max}%</span>
                </div>
                <div className="w-full h-[10px] rounded-full" style={{ backgroundColor: 'rgba(8,81,47,0.1)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min(thcBarWidth, 100)}%`, backgroundColor: '#08512f' }}
                  />
                </div>
              </div>
              {/* CBD */}
              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="font-semibold">CBD</span>
                  <span className="text-muted-foreground">{strain.cbd_min}–{strain.cbd_max}%</span>
                </div>
                <div className="w-full h-[10px] rounded-full" style={{ backgroundColor: 'rgba(8,81,47,0.1)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min(cbdBarWidth, 100)}%`, backgroundColor: 'rgba(8,81,47,0.4)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <section className="mb-12">
          <p className="text-[16px] leading-[1.8] text-foreground/80 max-w-3xl">
            {strain.description}
          </p>
        </section>

        {/* Effects + "Is this your strain?" side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Effects */}
          <div className="md:col-span-2">
            <h2 className="font-serif text-xl font-bold text-primary mb-1">
              {strain.name} strain effects
            </h2>
            <p className="text-[13px] text-muted-foreground mb-5">
              {strain.category === "Sativa" ? "Energising & cerebral" : strain.category === "Indica" ? "Calming & relaxing" : "Balanced experience"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {(strain.effects || []).map((e) => (
                <div key={e} className="flex flex-col items-center text-center p-4 rounded-lg bg-card border border-border/10">
                  <span className="text-[36px] mb-2">{effectEmojis[e] || "🌿"}</span>
                  <span className="text-[13px] font-medium text-foreground/80">{e}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Is this your strain? */}
          <div className="rounded-xl p-5 border" style={{ backgroundColor: 'rgba(8,81,47,0.05)', borderColor: 'rgba(8,81,47,0.15)' }}>
            <h3 className="font-serif text-lg font-bold text-primary mb-2">Is this your strain?</h3>
            <p className="text-[13px] text-muted-foreground mb-4">
              People who enjoy {strain.name} often report feeling:
            </p>
            <ul className="space-y-2 mb-5">
              {(strain.feelings || []).map((f) => (
                <li key={f} className="flex items-center gap-2 text-[13px]">
                  <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link to={`/strains?category=${strain.category}`}>
              <Button variant="outline" className="w-full text-[11px] tracking-wider">
                FIND SIMILAR STRAINS
              </Button>
            </Link>
          </div>
        </div>

        {/* Flavors */}
        <section className="mb-12">
          <h2 className="font-serif text-xl font-bold text-primary mb-5">
            Strain Flavours
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {(strain.flavours || []).map((f) => (
              <div key={f} className="flex flex-col items-center text-center p-3 rounded-lg bg-card border border-border/10">
                <span className="text-[32px] mb-1">{flavourEmojis[f] || "🌿"}</span>
                <span className="text-[12px] font-medium text-foreground/80">{f}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Terpene Profile */}
        <section className="mb-12">
          <h2 className="font-serif text-xl font-bold text-primary mb-5">
            {strain.name} terpene profile
          </h2>
          <div className="space-y-3 max-w-xl">
            {(strain.terpenes || []).map((t) => (
              <div key={t} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border/10">
                <div
                  className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: getTerpeneColor(t) }}
                />
                <div>
                  <p className="text-[14px] font-bold">{t}</p>
                  <p className="text-[13px] text-muted-foreground">
                    {terpeneDescriptions[t] || "A naturally occurring terpene found in cannabis."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Similar Strains */}
        {similarStrains.length > 0 && (
          <section className="mb-12">
            <h2 className="font-serif text-xl font-bold text-primary mb-5">
              Similar Strains
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
              {similarStrains.map((s) => {
                const sc = getCategoryColors(s.category);
                return (
                  <Link
                    key={s.id}
                    to={`/strains/${s.slug}`}
                    className="flex-shrink-0 w-[160px] bg-card rounded-lg overflow-hidden border border-border/10 hover:shadow-md transition-all"
                  >
                    <div className="h-[180px] bg-muted relative">
                      {s.image_url ? (
                        <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Leaf className="text-primary/15" size={32} />
                        </div>
                      )}
                      <span
                        className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold"
                        style={{ backgroundColor: sc.bg, color: sc.text }}
                      >
                        {s.category.toUpperCase()}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="font-serif text-[14px] font-bold text-primary">{s.name}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}


        {/* Grow Info */}
        {strain.grow_info && (
          <section className="mb-12">
            <h2 className="font-serif text-xl font-bold text-primary mb-5">
              Grow Information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-card rounded-lg border border-border/10 p-4 text-center">
                <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mb-1">Difficulty</p>
                <p className="text-[15px] font-bold text-foreground">{strain.grow_difficulty}</p>
              </div>
              <div className="bg-card rounded-lg border border-border/10 p-4 text-center">
                <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mb-1">Type</p>
                <p className="text-[15px] font-bold text-foreground">{strain.category}</p>
              </div>
            </div>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-2xl">
              {strain.grow_info}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default StrainDetailPage;
