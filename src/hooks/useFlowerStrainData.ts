import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StrainData {
  name: string;
  slug: string;
  category: string;
  description: string | null;
  image_url: string | null;
  thc_min: number | null;
  thc_max: number | null;
  cbd_min: number | null;
  cbd_max: number | null;
  feelings: string[] | null;
  effects: string[] | null;
  flavours: string[] | null;
  terpenes: string[] | null;
}

const FLOWER_NAMES = [
  "Alien Cookies",
  "Mimosa",
  "Jungle Diamonds",
  "Blue Walker",
  "Panama Punch",
  "Sugar Cane",
  "Violet Bag",
  "Elvis",
  "Watermelon",
  "Maui Wowie",
];

export const useFlowerStrainData = () => {
  return useQuery({
    queryKey: ["flower-strain-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("strains")
        .select("name, slug, category, description, image_url, thc_min, thc_max, cbd_min, cbd_max, feelings, effects, flavours, terpenes")
        .in("name", FLOWER_NAMES);

      if (error) throw error;

      const map = new Map<string, StrainData>();
      data?.forEach((strain) => {
        map.set(strain.name.toLowerCase(), strain);
      });
      return map;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useStrainByName = (name: string) => {
  return useQuery({
    queryKey: ["strain-by-name", name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("strains")
        .select("name, slug, category, description, image_url, thc_min, thc_max, cbd_min, cbd_max, feelings, effects, flavours, terpenes")
        .ilike("name", name)
        .maybeSingle();

      if (error) throw error;
      return data as StrainData | null;
    },
    enabled: !!name,
    staleTime: 1000 * 60 * 10,
  });
};
