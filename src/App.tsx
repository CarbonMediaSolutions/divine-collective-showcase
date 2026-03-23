import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import TopBar from "./components/TopBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AgeVerification from "./components/AgeVerification";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import LoungePage from "./pages/LoungePage";
import MemberSignUpPage from "./pages/MemberSignUpPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [ageVerified, setAgeVerified] = useState(() => {
    return localStorage.getItem("ageVerified") === "true";
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!ageVerified && <AgeVerification onVerified={() => setAgeVerified(true)} />}
          <div className={ageVerified ? "" : "hidden"}>
            <ScrollToTop />
            <TopBar />
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/lounge" element={<LoungePage />} />
                <Route path="/member-sign-up-page" element={<MemberSignUpPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
