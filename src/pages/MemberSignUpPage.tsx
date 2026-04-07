const JOINIT_URL = "https://app.joinit.com/o/divine-collective/members";

const MemberSignUpPage = () => {
  return (
    <section className="relative overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#0a0a0a", minHeight: "80vh" }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/20" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full border border-primary/10" />
      </div>
      <div className="relative z-10 text-center px-5 max-w-2xl">
        <h1 className="text-primary-foreground font-serif font-bold text-[36px] md:text-[48px] leading-tight mb-6">
          Become A Member
        </h1>
        <p className="text-primary-foreground/80 text-base leading-relaxed mb-4">
          Become a member at Divine Collective and enjoy premium cannabis, artisan coffee, and a relaxed lounge experience designed for elevated living.
        </p>
        <p className="text-primary-foreground/70 text-base mb-10">
          Click the button below to sign up.
        </p>
        <a href={JOINIT_URL} target="_blank" rel="noopener noreferrer" className="btn-pill-white text-lg px-12 py-4 inline-block">
          BECOME A MEMBER
        </a>
      </div>
    </section>
  );
};

export default MemberSignUpPage;
