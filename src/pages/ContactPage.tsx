import { useState } from "react";
import { toast } from "sonner";

const ContactPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    const subject = encodeURIComponent(`Contact from ${form.firstName} ${form.lastName}`);
    const body = encodeURIComponent(
      `Name: ${form.firstName} ${form.lastName}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`
    );
    window.location.href = `mailto:info@thedivinecollective.co.za?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Opening your email client...");
    }, 500);
  };

  return (
    <div>
      {/* Hero */}
      <section className="py-12 md:py-16 bg-background border-b border-border">
        <div className="container-main text-center">
          <h1 className="font-serif font-bold text-primary text-[36px] md:text-[48px]">
            Contact Us
          </h1>
        </div>
      </section>

      <div className="w-full border-b border-border" />

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Info */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-primary text-base mb-2">
                Thank you for choosing The Divine Collective.
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We're honoured to have you as part of our community and grateful for your trust
                in our brand. Our mission is to elevate your lifestyle with exceptional cannabis
                products, curated experiences, and unparalleled service.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-primary text-base mb-2">
                Loving your purchase?
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                That makes us truly happy — because your satisfaction is what drives us. If you're
                feeling the glow, here are a few divine ways to share the love:
              </p>
            </div>

            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2 pl-1">
              <li>Tell your friends and fellow connoisseurs</li>
              <li>
                Leave a{" "}
                <a
                  href="https://g.page/r/thedivinecollective/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:opacity-80"
                >
                  Google review
                </a>{" "}
                and spread the good word
              </li>
              <li>
                Connect with us on Instagram{" "}
                <a
                  href="https://instagram.com/thedivinecollective"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:opacity-80"
                >
                  @thedivinecollective
                </a>
              </li>
            </ul>
          </div>

          {/* Right - Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
              {/* First Name */}
              <div>
                <label className="block text-sm text-foreground mb-2">
                  First Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  maxLength={100}
                  className="w-full bg-transparent border-b border-muted-foreground/40 pb-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm text-foreground mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  maxLength={100}
                  className="w-full bg-transparent border-b border-muted-foreground/40 pb-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-foreground mb-2">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  maxLength={255}
                  className="w-full bg-transparent border-b border-muted-foreground/40 pb-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm text-foreground mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={20}
                  className="w-full bg-transparent border-b border-muted-foreground/40 pb-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm text-foreground mb-2">
                Message <span className="text-primary">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                maxLength={1000}
                rows={5}
                className="w-full bg-transparent border-b border-muted-foreground/40 pb-2 text-sm text-foreground outline-none focus:border-primary transition-colors resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-primary-foreground font-medium tracking-widest text-sm px-10 py-3 rounded-full hover:opacity-90 transition-opacity uppercase disabled:opacity-50"
            >
              SUBMIT
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
