import { MapPin, Phone, Mail } from "lucide-react";

const ContactPage = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-main max-w-2xl">
        <h1 className="section-heading text-[42px] text-center mb-4">Contact Us</h1>
        <div className="w-16 h-[1px] bg-primary mx-auto mb-12" />

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-foreground mb-1 font-body">Our Address</h3>
              <p className="text-muted-foreground text-sm">
                Shop 1, Cascades 4, Tyger Waterfront, Cape Town, 7530
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone size={20} className="text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-foreground mb-1 font-body">Phone</h3>
              <a href="tel:0774661572" className="text-primary text-sm hover:underline">
                0774661572
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail size={20} className="text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-foreground mb-1 font-body">Email</h3>
              <a href="mailto:info@thedivinecollective.co.za" className="text-primary text-sm hover:underline">
                info@thedivinecollective.co.za
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
