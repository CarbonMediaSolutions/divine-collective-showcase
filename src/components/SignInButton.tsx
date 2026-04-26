import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, ChevronDown } from "lucide-react";
import { useMembership } from "@/contexts/MembershipContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SignInButton = () => {
  const { isMember, firstName, verifyWithJoinIt, clearMembership } = useMembership();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const ok = await verifyWithJoinIt(email);
      if (ok) {
        setOpen(false);
        setEmail("");
        toast.success("You're signed in");
      } else {
        setError("We couldn't find an active membership for this email.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = () => {
    clearMembership();
    toast.success("Signed out");
  };

  if (isMember) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 text-primary-foreground text-xs hover:opacity-80 transition-opacity outline-none">
          <span>Hi {firstName || "there"}</span>
          <ChevronDown size={12} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[180px]">
          <DropdownMenuItem asChild>
            <Link to="/my-membership" className="cursor-pointer text-xs tracking-wide">
              My Membership
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-xs tracking-wide">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-primary-foreground text-xs hover:opacity-80 transition-opacity"
      >
        <LogIn size={14} />
        <span>Sign in</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>
              Enter the email associated with your Divine Collective membership.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              autoFocus
              required
            />
            {error && (
              <p className="text-sm text-destructive">
                {error}{" "}
                <Link
                  to="/membership-required"
                  className="underline hover:no-underline"
                  onClick={() => setOpen(false)}
                >
                  Become a member
                </Link>
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || !email.trim()}>
                {submitting ? "Verifying..." : "Sign in"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignInButton;
