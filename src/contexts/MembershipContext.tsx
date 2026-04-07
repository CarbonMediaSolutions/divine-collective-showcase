import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MembershipContextType {
  isMember: boolean;
  memberEmail: string | null;
  verifyWithJoinIt: (email: string) => Promise<boolean>;
  clearMembership: () => void;
}

const defaultMembershipContext: MembershipContextType = {
  isMember: false,
  memberEmail: null,
  verifyWithJoinIt: async () => false,
  clearMembership: () => {},
};

// eslint-disable-next-line react-refresh/only-export-components
const MembershipContext = createContext<MembershipContextType>(defaultMembershipContext);

const STORAGE_KEY = "divineCollectiveMembership";

interface StoredMembership {
  active: boolean;
  email: string;
  verifiedAt: string;
}

function readStored(): StoredMembership | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredMembership;
    if (!data.active || !data.email || !data.verifiedAt) return null;
    return data;
  } catch {
    return null;
  }
}

export const MembershipProvider = ({ children }: { children: ReactNode }) => {
  const [isMember, setIsMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState<string | null>(null);

  const clearMembership = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsMember(false);
    setMemberEmail(null);
  }, []);

  const verifyWithJoinIt = useCallback(async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-joinit-membership", {
        body: { email: email.trim().toLowerCase() },
      });
      if (error) {
        console.error("Verify error:", error);
        return false;
      }
      if (data?.verified) {
        const stored: StoredMembership = {
          active: true,
          email: email.trim().toLowerCase(),
          verifiedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        setIsMember(true);
        setMemberEmail(stored.email);
        return true;
      }
      clearMembership();
      return false;
    } catch {
      return false;
    }
  }, [clearMembership]);

  // On load: restore from localStorage or re-verify
  useEffect(() => {
    const stored = readStored();
    if (!stored) {
      setIsMember(false);
      return;
    }

    const verifiedAt = new Date(stored.verifiedAt);
    const hoursSince = (Date.now() - verifiedAt.getTime()) / (1000 * 60 * 60);

    if (hoursSince < 24) {
      // Still fresh — restore without API call
      setIsMember(true);
      setMemberEmail(stored.email);
    } else {
      // Stale — silently re-verify
      setMemberEmail(stored.email);
      setIsMember(true); // optimistic
      verifyWithJoinIt(stored.email).then((valid) => {
        if (!valid) {
          clearMembership();
        }
      });
    }
  }, [verifyWithJoinIt, clearMembership]);

  return (
    <MembershipContext.Provider value={{ isMember, memberEmail, verifyWithJoinIt, clearMembership }}>
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembership = () => {
  return useContext(MembershipContext);
};
