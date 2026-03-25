import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { MembershipProvider } from "@/contexts/MembershipContext";
import TopBar from "./components/TopBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AgeVerification from "./components/AgeVerification";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductPage from "./pages/ProductPage";
import LoungePage from "./pages/LoungePage";
import MemberSignUpPage from "./pages/MemberSignUpPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import MembershipRequiredPage from "./pages/MembershipRequiredPage";
import MembershipCheckoutPage from "./pages/MembershipCheckoutPage";
import MembershipSuccessPage from "./pages/MembershipSuccessPage";
import MyMembershipPage from "./pages/MyMembershipPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [ageVerified, setAgeVerified] = useState(() => {
    return localStorage.getItem("ageVerified") === "true";
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <MembershipProvider>
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
                    <Route path="/categories/:category" element={<CategoriesPage />} />
                    <Route path="/product/:slug" element={<ProductPage />} />
                    <Route path="/lounge" element={<LoungePage />} />
                    <Route path="/member-sign-up-page" element={<MemberSignUpPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/membership-required" element={<MembershipRequiredPage />} />
                    <Route path="/membership-checkout" element={<MembershipCheckoutPage />} />
                    <Route path="/membership-success" element={<MembershipSuccessPage />} />
                    <Route path="/my-membership" element={<MyMembershipPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <WhatsAppButton />
              </div>
            </BrowserRouter>
          </MembershipProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
