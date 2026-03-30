import { Link } from "react-router-dom";
import lounge1 from "@/assets/lounge/1.webp";
import lounge2 from "@/assets/lounge/2.webp";
import lounge3 from "@/assets/lounge/3.webp";
import lounge4 from "@/assets/lounge/4.webp";
import lounge5 from "@/assets/lounge/5.webp";
import lounge6 from "@/assets/lounge/6.webp";

const polaroidImages = [lounge1, lounge2, lounge3, lounge4, lounge5, lounge6];
const polaroidRotations = [-3, 2, -1.5, 2.5, -2, 1.5];

const LoungePage = () => {
  return (
    <div>
      {/* Hero Section - Dark with text */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#0a0a0a", minHeight: 220 }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/20" />
        </div>
        <div className="container-main relative z-10 text-center flex flex-col items-center justify-center py-16 md:py-24">
          <h1 className="text-primary-foreground font-serif font-bold text-[36px] md:text-[52px] leading-tight mb-6">
            Experience Our Lounge
          </h1>
          <p className="text-primary-foreground/80 text-base leading-relaxed max-w-[700px]">
            Step into <strong className="text-primary-foreground">The Divine Collective Lounge</strong>, a space curated for connection, creativity, and calm. Whether you're here to explore our premium cannabis selection, sip on artisan coffee, or unwind with a board game or console session, our lounge invites you to relax and feel at home. Designed for comfort and elevated moments, it's more than a destination; it's a lifestyle.
          </p>
        </div>
      </section>

      {/* Video Background Section */}
      <section className="relative w-full overflow-hidden" style={{ height: "60vh", minHeight: 350 }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/lounge-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20" />
      </section>

      {/* Why Become A Member Banner */}
      <section className="section-padding bg-background">
        <div className="container-main flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-serif font-bold text-[28px] md:text-[36px] mb-3 text-foreground">
              Why Become A Member
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-lg">
              Get unlimited access to the best lounge in Cape Town.
            </p>
          </div>
          <Link
            to="/member-sign-up-page"
            className="inline-block border border-foreground text-foreground font-medium tracking-widest text-sm px-8 py-3 hover:bg-foreground hover:text-background transition-colors uppercase"
          >
            BECOME A MEMBER
          </Link>
        </div>
      </section>

      {/* Polaroid Gallery */}
      <section className="section-padding bg-background">
        <div className="container-main grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14 justify-items-center">
          {polaroidImages.map((src, i) => (
            <div
              key={i}
              className="bg-white p-3 pb-8 relative cursor-pointer transition-transform duration-200 hover:scale-105 w-[260px] md:w-[280px]"
              style={{
                transform: `rotate(${polaroidRotations[i]}deg)`,
                boxShadow: "2px 4px 16px rgba(0,0,0,0.10)",
              }}
            >
              {/* Green tape strips */}
              <div
                className="absolute w-16 h-5 bg-primary/80 rounded-sm"
                style={{
                  top: -8,
                  right: i % 2 === 0 ? -10 : "auto",
                  left: i % 2 === 0 ? "auto" : -10,
                  transform: `rotate(${i % 2 === 0 ? 35 : -35}deg)`,
                }}
              />
              <div
                className="absolute w-16 h-5 bg-primary/80 rounded-sm"
                style={{
                  bottom: 20,
                  left: i % 2 === 0 ? -10 : "auto",
                  right: i % 2 === 0 ? "auto" : -10,
                  transform: `rotate(${i % 2 === 0 ? -30 : 30}deg)`,
                }}
              />
              <img
                src={src}
                alt={`Lounge gallery ${i + 1}`}
                className="w-full h-[280px] md:h-[320px] object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events Banner */}
      <section
        className="section-padding relative overflow-hidden"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div className="container-main flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-primary-foreground font-serif font-bold text-[28px] md:text-[36px] mb-3">
              Come Join Us At Our Next Event
            </h2>
            <p className="text-primary-foreground/60 text-base">
              Join us for our next event....
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-block border border-primary-foreground text-primary-foreground font-medium tracking-widest text-sm px-8 py-3 hover:bg-primary-foreground hover:text-background transition-colors uppercase"
          >
            RSVP
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LoungePage;
