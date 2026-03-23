import { Link } from "react-router-dom";

const gridHeights = [280, 320, 260, 300, 250, 290];

const polaroidRotations = [-2, 1, -1.5, 2, -0.5, 1.5];

const LoungePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden" style={{ backgroundColor: "#0a0a0a", minHeight: 500 }}>
        {/* Decorative circles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-primary/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-primary/10" />
        </div>
        <div className="container-main relative z-10 text-center flex flex-col items-center justify-center" style={{ minHeight: 400 }}>
          <h1 className="text-primary-foreground font-serif font-bold text-[36px] md:text-[48px] leading-tight mb-6">
            Experience Our Lounge
          </h1>
          <p className="text-primary-foreground/80 text-base leading-relaxed max-w-[700px]">
            Step into The Divine Collective Lounge, a space curated for connection, creativity, and calm. Whether you're here to explore our premium cannabis selection, sip on artisan coffee, or unwind with a board game or console session, our lounge invites you to relax and feel at home. Designed for comfort and elevated moments, it's more than a destination; it's a lifestyle.
          </p>
        </div>
      </section>

      {/* Photo Grid Mosaic */}
      <section className="section-padding bg-background">
        <div className="container-main grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gridHeights.map((h, i) => (
            <div
              key={i}
              className="w-full"
              style={{
                height: h,
                backgroundColor: i % 2 === 0 ? "#2a2a2a" : "#1a1a1a",
              }}
            />
          ))}
        </div>
      </section>

      {/* Why Become A Member Banner */}
      <section className="section-padding relative overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/30" />
        </div>
        <div className="container-main relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-primary-foreground font-serif font-bold text-[32px] md:text-[36px] mb-4">
              Why Become A Member
            </h2>
            <p className="text-primary-foreground/80 text-base leading-relaxed max-w-lg">
              Get unlimited access to the best lounge in Cape Town.
            </p>
          </div>
          <Link to="/member-sign-up-page" className="btn-pill-white">
            BECOME A MEMBER
          </Link>
        </div>
      </section>

      {/* Polaroid Gallery */}
      <section className="section-padding bg-background">
        <div className="container-main grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {polaroidRotations.map((rot, i) => (
            <div
              key={i}
              className="bg-card p-3 pb-8 relative cursor-pointer transition-transform duration-200 hover:scale-105"
              style={{ transform: `rotate(${rot}deg)` }}
            >
              {/* Green tape */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-primary rounded-sm" />
              <div
                className="w-full"
                style={{
                  height: 220 + (i % 3) * 30,
                  backgroundColor: i % 2 === 0 ? "#2a2a2a" : "#1f1f1f",
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events Banner */}
      <section className="section-padding" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="container-main flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-primary-foreground font-serif font-bold text-[32px] md:text-[36px] mb-3">
              Come Join Us At Our Next Event
            </h2>
            <p className="text-primary-foreground/60 text-base">
              Join us for our next event....
            </p>
          </div>
          <Link to="/contact" className="btn-pill-white">
            RSVP
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LoungePage;
