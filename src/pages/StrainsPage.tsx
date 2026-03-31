import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getCategoryColors, getFeelingColor } from "@/lib/strainUtils";

type Strain = {
  id: string;
  name: string;
  slug: string;
  category: string;
  thc_min: number;
  thc_max: number;
  description: string;
  feelings: string[];
  image_url: string;
  in_stock: boolean;
  featured: boolean;
};

const filters = ["ALL", "INDICA", "SATIVA", "HYBRID", "FEATURED", "IN STOCK"] as const;

const StrainsPage = () => {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: strains = [], isLoading } = useQuery({
    queryKey: ["strains"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("strains")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Strain[];
    },
  });

  const filtered = strains.filter((s) => {
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilter === "ALL") return true;
    if (activeFilter === "FEATURED") return s.featured;
    if (activeFilter === "IN STOCK") return s.in_stock;
    return s.category.toUpperCase() === activeFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-12 md:py-16">
        <div className="container-main text-center">
          <Leaf className="mx-auto mb-3 text-primary-foreground" size={32} />
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            Strain Library
          </h1>
          <p className="text-primary-foreground/70 text-[15px] max-w-[520px] mx-auto">
            Explore our curated collection of premium cannabis strains. Each one hand-selected for quality and experience.
          </p>
        </div>
      </section>

      <div className="container-main py-8 md:py-12">
        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search strains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border/30"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wider transition-all ${
                  activeFilter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border/20 text-foreground/70 hover:border-primary/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg h-[420px] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Leaf className="mx-auto mb-3 opacity-30" size={40} />
            <p>No strains found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((strain) => {
              const catColors = getCategoryColors(strain.category);
              return (
                <Link
                  key={strain.id}
                  to={`/strains/${strain.slug}`}
                  className="bg-card rounded-lg overflow-hidden border border-border/10 hover:shadow-lg transition-all group"
                >
                  {/* Image */}
                  <div className="relative h-[220px] bg-muted overflow-hidden">
                    {strain.image_url ? (
                      <img src={strain.image_url} alt={strain.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="text-primary/20" size={64} />
                      </div>
                    )}
                    <span
                      className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider"
                      style={{ backgroundColor: catColors.bg, color: catColors.text }}
                    >
                      {strain.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold text-primary mb-2">
                      {strain.name}
                    </h3>

                    {/* Feelings pills */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(strain.feelings || []).slice(0, 3).map((f) => {
                        const fc = getFeelingColor(f);
                        return (
                          <span
                            key={f}
                            className="px-3 py-0.5 rounded-full text-[11px] font-semibold"
                            style={{ backgroundColor: fc.bg, color: fc.text }}
                          >
                            {f}
                          </span>
                        );
                      })}
                    </div>

                    {/* THC pill */}
                    <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary mb-3">
                      THC {strain.thc_min}–{strain.thc_max}%
                    </span>

                    {/* Description */}
                    <p className="text-[13px] text-muted-foreground line-clamp-2 mb-4">
                      {strain.description}
                    </p>

                    <span className="text-[12px] font-semibold tracking-wider text-primary group-hover:underline">
                      EXPLORE STRAIN →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-border/10">
          <p className="text-[12px] text-muted-foreground/60 text-center max-w-2xl mx-auto leading-relaxed">
            Strain information is for educational purposes only. Effects and potency may vary.
            The Divine Collective sources the finest quality cannabis for the South African market.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrainsPage;
