import { useState } from "react";
import Logo from "./Logo";

interface Props {
  onVerified: () => void;
}

const AgeVerification = ({ onVerified }: Props) => {
  const [rejected, setRejected] = useState(false);

  const handleOver18 = () => {
    localStorage.setItem("ageVerified", "true");
    onVerified();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-lg p-8 md:p-12 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <h2 className="section-heading text-[28px] mb-4">Welcome to The Divine Collective</h2>
        {rejected ? (
          <p className="text-destructive font-semibold text-lg">
            You are not old enough to view this content.
          </p>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              Please, verify your age to enter. You must be over the age of 18 to view this site.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button onClick={handleOver18} className="btn-pill-filled">
                I am over 18
              </button>
              <button onClick={() => setRejected(true)} className="btn-pill-outline-black">
                I am under 18
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              By entering this site you are agreeing to the Terms of Use and Privacy Policy.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AgeVerification;
