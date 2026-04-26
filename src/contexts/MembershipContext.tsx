import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MembershipContextType {
  isMember: boolean;
  memberEmail: string | null;
  firstName: string | null;
  verifyWithJoinIt: (email: string) => Promise<boolean>;
  clearMembership: () => void;
}

const defaultMembershipContext: MembershipContextType = {
  isMember: false,
  memberEmail: null,
  firstName: null,
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
  firstName?: string | null;
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

function deriveFromEmail(email: string): string {
  const prefix = email.split("@")[0] || email;
  const cleaned = prefix.replace(/[._-]+/g, " ").trim();
  const first = cleaned.split(/\s+/)[0] || prefix;
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export const MembershipProvider = ({ children }: { children: ReactNode }) => {
  const [isMember, setIsMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);

  const clearMembership = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsMember(false);
    setMemberEmail(null);
    setFirstName(null);
  }, []);

  const ADMIN_TEST_EMAIL = "info@thedivinecollective.co.za";

  const persist = (email: string, name: string | null) => {
    const stored: StoredMembership = {
      active: true,
      email,
      verifiedAt: new Date().toISOString(),
      firstName: name,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    setIsMember(true);
    setMemberEmail(email);
    setFirstName(name || deriveFromEmail(email));
  };

  const verifyWithJoinIt = useCallback(async (email: string): Promise<boolean> => {
    const normalised = email.trim().toLowerCase();

    // Admin test email is always treated as an active member
    if (normalised === ADMIN_TEST_EMAIL) {
      persist(normalised, "Admin");
      return true;
    }

    try {
      const { data, error } = await supabase.functions.invoke("verify-joinit-membership", {
        body: { email: normalised },
      });
      if (error) {
        console.error("Verify error:", error);
        return false;
      }
      if (data?.verified) {
        persist(normalised, data.first_name ?? null);
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

    const restoredName = stored.firstName || deriveFromEmail(stored.email);

    if (hoursSince < 24) {
      // Still fresh — restore without API call
      setIsMember(true);
      setMemberEmail(stored.email);
      setFirstName(restoredName);
    } else {
      // Stale — silently re-verify
      setMemberEmail(stored.email);
      setFirstName(restoredName);
      setIsMember(true); // optimistic
      verifyWithJoinIt(stored.email).then((valid) => {
        if (!valid) {
          clearMembership();
        }
      });
    }
  }, [verifyWithJoinIt, clearMembership]);

  return (
    <MembershipContext.Provider value={{ isMember, memberEmail, firstName, verifyWithJoinIt, clearMembership }}>
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembership = () => {
  return useContext(MembershipContext);
};
