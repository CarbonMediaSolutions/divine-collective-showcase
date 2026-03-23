import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/27686076735"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-whatsapp flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
      aria-label="WhatsApp"
    >
      <MessageCircle size={28} className="text-primary-foreground" fill="white" />
    </a>
  );
};

export default WhatsAppButton;
