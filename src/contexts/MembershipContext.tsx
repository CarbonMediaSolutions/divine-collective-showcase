import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface MembershipData {
  active: boolean;
  purchasedAt: string;
  expiresAt: string;
}

interface MembershipContextType {
  isMember: boolean;
  membershipExpiry: Date | null;
  membershipPurchasedAt: Date | null;
  purchaseMembership: () => void;
  checkMembership: () => void;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

const STORAGE_KEY = "divineCollectiveMembership";

function readMembership(): { isMember: boolean; expiry: Date | null; purchased: Date | null } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { isMember: false, expiry: null, purchased: null };
    const data: MembershipData = JSON.parse(stored);
    const expiry = new Date(data.expiresAt);
    if (!data.active || expiry <= new Date()) {
      return { isMember: false, expiry: null, purchased: null };
    }
    return { isMember: true, expiry, purchased: new Date(data.purchasedAt) };
  } catch {
    return { isMember: false, expiry: null, purchased: null };
  }
}

export const MembershipProvider = ({ children }: { children: ReactNode }) => {
  const [isMember, setIsMember] = useState(false);
  const [membershipExpiry, setMembershipExpiry] = useState<Date | null>(null);
  const [membershipPurchasedAt, setMembershipPurchasedAt] = useState<Date | null>(null);

  const checkMembership = useCallback(() => {
    const { isMember: active, expiry, purchased } = readMembership();
    setIsMember(active);
    setMembershipExpiry(expiry);
    setMembershipPurchasedAt(purchased);
  }, []);

  useEffect(() => {
    checkMembership();
  }, [checkMembership]);

  const purchaseMembership = useCallback(() => {
    const now = new Date();
    const expiry = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const data: MembershipData = {
      active: true,
      purchasedAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setIsMember(true);
    setMembershipExpiry(expiry);
    setMembershipPurchasedAt(now);
  }, []);

  return (
    <MembershipContext.Provider value={{ isMember, membershipExpiry, membershipPurchasedAt, purchaseMembership, checkMembership }}>
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembership = () => {
  const ctx = useContext(MembershipContext);
  if (!ctx) throw new Error("useMembership must be used within MembershipProvider");
  return ctx;
};
