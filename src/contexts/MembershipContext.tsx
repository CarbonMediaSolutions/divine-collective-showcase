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
  const [memberName, setMemberName] = useState<string | null>(null);

  const checkMembership = useCallback(() => {
    const { isMember: active, expiry, purchased, email } = readLocalMembership();
    setIsMember(active);
    setMembershipExpiry(expiry);
    setMembershipPurchasedAt(purchased);
    setMemberEmail(email);
  }, []);

  // Server-side verification: silently validate localStorage against DB
  const verifyMembershipServerSide = useCallback(async (email: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-membership", {
        body: { email },
      });
      if (error) return;
      if (data && data.valid === false) {
        // Server says invalid — clear local state
        localStorage.removeItem(STORAGE_KEY);
        setIsMember(false);
        setMembershipExpiry(null);
        setMembershipPurchasedAt(null);
        setMemberEmail(null);
        setMemberName(null);
      } else if (data && data.valid && data.expiresAt) {
        // Sync expiry from server
        const serverExpiry = new Date(data.expiresAt);
        setMembershipExpiry(serverExpiry);
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.expiresAt = serverExpiry.toISOString();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
      }
    } catch {
      // Silent fail — don't disrupt UX
    }
  }, []);

  const checkMembershipByEmail = useCallback(async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("status, expiration_date, joined_date, first_name")
        .eq("email", email.toLowerCase().trim())
        .in("status", ["Active", "Pending"])
        .order("created_at", { ascending: false })
        .limit(1);

      if (error || !data || data.length === 0) return false;

      const member = data[0];
      const expiry = member.expiration_date ? new Date(member.expiration_date) : null;

      if (expiry && expiry <= new Date()) return false;

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
      setMemberName(member.first_name || null);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    checkMembership();
  }, [checkMembership]);

  // Server-side verification on load
  useEffect(() => {
    const { email } = readLocalMembership();
    if (email) {
      verifyMembershipServerSide(email);
    }
  }, [verifyMembershipServerSide]);

  // Fetch member name when email is available
  useEffect(() => {
    if (memberEmail && !memberName) {
      supabase
        .from("members")
        .select("first_name")
        .eq("email", memberEmail.toLowerCase().trim())
        .limit(1)
        .then(({ data }) => {
          if (data?.[0]?.first_name) setMemberName(data[0].first_name);
        });
    }
  }, [memberEmail, memberName]);

  const purchaseMembership = useCallback(async () => {
    const now = new Date();

    // Check if extending an existing active membership
    const existing = readLocalMembership();
    let startDate: Date;
    if (existing.isMember && existing.expiry && existing.expiry > now) {
      startDate = existing.expiry; // Extend from current expiry
    } else {
      startDate = now; // New membership or expired
    }

    const expiry = new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000);

    try {
      const pendingRaw = localStorage.getItem("pendingMemberData");
      if (pendingRaw) {
        // New member signup
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

        const memberData: MembershipData = {
          active: true,
          purchasedAt: now.toISOString(),
          expiresAt: expiry.toISOString(),
          email: pending.email,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memberData));
        setMemberEmail(pending.email);
      } else if (existing.email) {
        // Renewal — update existing member record
        const { error } = await supabase
          .from("members")
          .update({
            expiration_date: expiry.toISOString().split("T")[0],
            status: "Active",
          })
          .eq("email", existing.email.toLowerCase().trim());
        if (error) console.error("Failed to update member:", error);

        const memberData: MembershipData = {
          active: true,
          purchasedAt: now.toISOString(),
          expiresAt: expiry.toISOString(),
          email: existing.email,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memberData));
      } else {
        // Fallback: no pending data, no email
        const memberData: MembershipData = {
          active: true,
          purchasedAt: now.toISOString(),
          expiresAt: expiry.toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memberData));
      }
    } catch (e) {
      console.error("Error saving membership:", e);
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
    <MembershipContext.Provider value={{ isMember, membershipExpiry, membershipPurchasedAt, memberEmail, memberName, purchaseMembership, checkMembership, checkMembershipByEmail }}>
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembership = () => {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error("useMembership must be used within MembershipProvider");
  }
  return context;
};
