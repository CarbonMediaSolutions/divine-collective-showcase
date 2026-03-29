import { toast } from "@/hooks/use-toast";

const WalletButtons = () => {
  const handleAppleWallet = () => {
    toast({
      title: "Apple Wallet coming soon",
      description: "We're setting up our Apple Developer certificate. You'll be notified when it's ready.",
    });
  };

  const handleGoogleWallet = () => {
    toast({
      title: "Google Wallet coming soon",
      description: "We're setting up the Google Cloud service account. You'll be notified when it's ready.",
    });
  };

  return (
    <div className="flex flex-row gap-3 justify-center flex-wrap">
      {/* Apple Wallet */}
      <button
        onClick={handleAppleWallet}
        className="flex items-center gap-2.5 bg-black text-white rounded-lg px-5 py-3 hover:bg-black/90 transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.99 2.97 12.5 4.7 9.56C5.55 8.08 7.13 7.16 8.82 7.14C10.1 7.12 11.32 8.01 12.11 8.01C12.89 8.01 14.37 6.94 15.92 7.1C16.57 7.13 18.39 7.36 19.56 9.07C19.47 9.13 17.09 10.51 17.12 13.35C17.15 16.73 20.05 17.79 20.09 17.8C20.06 17.88 19.59 19.47 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
        </svg>
        <div className="text-left">
          <p className="text-[9px] leading-none opacity-70">Add to</p>
          <p className="text-sm font-semibold leading-tight">Apple Wallet</p>
        </div>
      </button>

      {/* Google Wallet */}
      <button
        onClick={handleGoogleWallet}
        className="flex items-center gap-2.5 bg-white border border-border text-foreground rounded-lg px-5 py-3 hover:bg-muted transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        <div className="text-left">
          <p className="text-[9px] leading-none text-muted-foreground">Save to</p>
          <p className="text-sm font-semibold leading-tight">Google Wallet</p>
        </div>
      </button>
    </div>
  );
};

export default WalletButtons;
