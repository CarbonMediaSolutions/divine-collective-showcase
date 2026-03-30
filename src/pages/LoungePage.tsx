import { Link } from "react-router-dom";
import lounge1 from "@/assets/lounge/1.webp";
import lounge2 from "@/assets/lounge/2.webp";
import lounge3 from "@/assets/lounge/3.webp";
import lounge4 from "@/assets/lounge/4.webp";
import lounge5 from "@/assets/lounge/5.webp";
import lounge6 from "@/assets/lounge/6.webp";

const polaroidImages = [lounge1, lounge2, lounge3, lounge4, lounge5, lounge6];
const polaroidRotations = [-2.5, 1.8, -1, 3, -1.8, 2.2];

const LoungePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/20" />
        </div>
        <div className="container-main relative z-10 text-center flex flex-col items-center justify-center py-10 md:py-14">
          <h1 className="text-primary-foreground font-serif font-bold text-[36px] md:text-[52px] leading-tight mb-3">
            Experience Our Lounge
          </h1>
          <p className="text-primary-foreground/80 text-[15px] leading-relaxed max-w-[580px]">
            Step into <strong className="text-primary-foreground">The Divine Collective Lounge</strong>, a space curated for connection, creativity, and calm. Whether you're here to explore our premium cannabis selection, sip on artisan coffee, or unwind with a board game or console session, our lounge invites you to relax and feel at home.
          </p>
        </div>
      </section>

      {/* Video Background Section */}
      <section className="relative w-full overflow-hidden" style={{ height: "50vh", minHeight: 280 }}>
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
      <section className="py-10 md:py-12 bg-background">
        <div className="container-main flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif font-bold text-[24px] md:text-[30px] mb-1 text-foreground">
              Why Become A Member
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
              Get unlimited access to the best lounge in Cape Town.
            </p>
          </div>
          <Link
            to="/member-sign-up-page"
            className="inline-block border border-foreground text-foreground font-medium tracking-widest text-xs px-6 py-2.5 hover:bg-foreground hover:text-background transition-colors uppercase"
          >
            BECOME A MEMBER
          </Link>
        </div>
      </section>

      {/* Polaroid Gallery */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container-main grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 justify-items-center">
          {polaroidImages.map((src, i) => {
            const tape = tapeConfigs[i];
            const isEven = i % 2 === 0;
            return (
              <div
                key={i}
                className="relative cursor-pointer transition-transform duration-200 hover:scale-105 w-[230px] md:w-[250px]"
                style={{
                  transform: `rotate(${polaroidRotations[i]}deg)`,
                }}
              >
                {/* Top tape */}
                <div
                  className="absolute w-14 h-4 bg-primary/80 rounded-sm"
                  style={{
                    top: tape.top,
                    right: isEven ? tape.right ?? "auto" : "auto",
                    left: isEven ? "auto" : tape.left ?? "auto",
                    transform: `rotate(${tape.angle}deg)`,
                  }}
                />
                {/* Bottom tape */}
                <div
                  className="absolute w-14 h-4 bg-primary/80 rounded-sm"
                  style={{
                    bottom: -8,
                    left: isEven ? (tape as any).botLeft ?? "auto" : "auto",
                    right: isEven ? "auto" : (tape as any).botRight ?? "auto",
                    transform: `rotate(${tape.botAngle}deg)`,
                  }}
                />
                <img
                  src={src}
                  alt={`Lounge gallery ${i + 1}`}
                  className="w-full h-[240px] md:h-[270px] object-cover"
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Upcoming Events Banner */}
      <section
        className="py-10 md:py-12 relative overflow-hidden"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div className="container-main flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-primary-foreground font-serif font-bold text-[24px] md:text-[30px] mb-1">
              Come Join Us At Our Next Event
            </h2>
            <p className="text-primary-foreground/60 text-sm">
              Join us for our next event....
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-block border border-primary-foreground text-primary-foreground font-medium tracking-widest text-xs px-6 py-2.5 hover:bg-primary-foreground hover:text-background transition-colors uppercase"
          >
            RSVP
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LoungePage;
