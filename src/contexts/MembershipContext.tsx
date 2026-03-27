import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MembershipContextType {
  isMember: boolean;
  membershipExpiry: Date | null;
  membershipPurchasedAt: Date | null;
  memberEmail: string | null;
  memberName: string | null;
  purchaseMembership: () => void;
  checkMembership: () => void;
  checkMembershipByEmail: (email: string) => Promise<boolean>;
}

// eslint-disable-next-line react-refresh/only-export-components
const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

const STORAGE_KEY = "divineCollectiveMembership";

interface MembershipData {
  active: boolean;
  purchasedAt: string;
  expiresAt: string;
  email?: string;
}

function readLocalMembership(): { isMember: boolean; expiry: Date | null; purchased: Date | null; email: string | null } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { isMember: false, expiry: null, purchased: null, email: null };
    const data: MembershipData = JSON.parse(stored);
    const expiry = new Date(data.expiresAt);
    if (!data.active || expiry <= new Date()) {
      return { isMember: false, expiry: null, purchased: null, email: null };
    }
    return { isMember: true, expiry, purchased: new Date(data.purchasedAt), email: data.email || null };
  } catch {
    return { isMember: false, expiry: null, purchased: null, email: null };
  }
}

export const MembershipProvider = ({ children }: { children: ReactNode }) => {
  const [isMember, setIsMember] = useState(false);
  const [membershipExpiry, setMembershipExpiry] = useState<Date | null>(null);
  const [membershipPurchasedAt, setMembershipPurchasedAt] = useState<Date | null>(null);
  const [memberEmail, setMemberEmail] = useState<string | null>(null);

  const checkMembership = useCallback(() => {
    const { isMember: active, expiry, purchased, email } = readLocalMembership();
    setIsMember(active);
    setMembershipExpiry(expiry);
    setMembershipPurchasedAt(purchased);
    setMemberEmail(email);
  }, []);

  const checkMembershipByEmail = useCallback(async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("status, expiration_date, joined_date")
        .eq("email", email.toLowerCase().trim())
        .in("status", ["Active", "Pending"])
        .order("created_at", { ascending: false })
        .limit(1);

      if (error || !data || data.length === 0) return false;

      const member = data[0];
      const expiry = member.expiration_date ? new Date(member.expiration_date) : null;

      // If expired, not a member
      if (expiry && expiry <= new Date()) return false;

      // Activate locally
      const now = new Date();
      const localExpiry = expiry || new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      const memberData: MembershipData = {
        active: true,
        purchasedAt: member.joined_date || now.toISOString(),
        expiresAt: localExpiry.toISOString(),
        email,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memberData));
      setIsMember(true);
      setMembershipExpiry(localExpiry);
      setMembershipPurchasedAt(new Date(memberData.purchasedAt));
      setMemberEmail(email);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    checkMembership();
  }, [checkMembership]);

  const purchaseMembership = useCallback(async () => {
    const now = new Date();
    const expiry = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    // Save pending member data to database
    try {
      const pendingRaw = localStorage.getItem("pendingMemberData");
      if (pendingRaw) {
        const pending = JSON.parse(pendingRaw);
        const { error } = await supabase.from("members").insert({
          first_name: pending.first_name,
          last_name: pending.last_name,
          email: pending.email?.toLowerCase()?.trim() || null,
          phone: pending.phone || null,
          id_number: pending.id_number || null,
          birthday: pending.birthday || null,
          id_front_url: pending.id_front_url || null,
          id_back_url: pending.id_back_url || null,
          referral_source: pending.referral_source || null,
          terms_accepted: pending.terms_accepted || false,
          marketing_consent: pending.marketing_consent || false,
          status: "Active",
          joined_date: now.toISOString().split("T")[0],
          expiration_date: expiry.toISOString().split("T")[0],
        });
        if (error) console.error("Failed to save member:", error);
        localStorage.removeItem("pendingMemberData");

        // Store email for local membership
        const memberData: MembershipData = {
          active: true,
          purchasedAt: now.toISOString(),
          expiresAt: expiry.toISOString(),
          email: pending.email,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memberData));
        setMemberEmail(pending.email);
      } else {
        // Fallback: no pending data
        const memberData: MembershipData = {
          active: true,
          purchasedAt: now.toISOString(),
          expiresAt: expiry.toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memberData));
      }
    } catch (e) {
      console.error("Error saving membership:", e);
      // Still activate locally
      const memberData: MembershipData = {
        active: true,
        purchasedAt: now.toISOString(),
        expiresAt: expiry.toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memberData));
    }

    setIsMember(true);
    setMembershipExpiry(expiry);
    setMembershipPurchasedAt(now);
  }, []);

  return (
    <MembershipContext.Provider value={{ isMember, membershipExpiry, membershipPurchasedAt, memberEmail, purchaseMembership, checkMembership, checkMembershipByEmail }}>
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembership = () => {
  const ctx = useContext(MembershipContext);
  if (!ctx) throw new Error("useMembership must be used within MembershipProvider");
  return ctx;
};
