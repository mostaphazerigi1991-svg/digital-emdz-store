import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { ProductGrid } from './components/ProductGrid';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { SearchModal } from './components/SearchModal';
import { PoliciesModal } from './components/PoliciesModal';
import { ToastContainer } from './components/ToastContainer';
import { OwnerActionBar } from './components/OwnerActionBar';
import { OwnerLoginModal } from './components/OwnerLoginModal';
import { ProductEditorModal } from './components/ProductEditorModal';
import { ProductDeleteConfirmModal } from './components/ProductDeleteConfirmModal';
import { ServiceRequestModal } from './components/ServiceRequestModal';
import { MobileBottomNav } from './components/MobileBottomNav';

const MainStoreContent: React.FC = () => {
  const { setSelectedCategory } = useStore();

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBrowseProducts = () => {
    setSelectedCategory('all');
    handleNavigateSection('products-section');
  };

  const handleExploreOffers = () => {
    handleNavigateSection('offers-section');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-16 lg:pb-0">
      {/* Owner Top Control Bar (Visible only when Owner is logged in) */}
      <OwnerActionBar />

      {/* Navigation Header */}
      <Header onNavigateSection={handleNavigateSection} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero 
          onBrowseProducts={handleBrowseProducts} 
          onExploreOffers={handleExploreOffers} 
        />

        {/* Categories Section */}
        <CategoriesSection />

        {/* 1. Best Sellers Section */}
        <ProductGrid mode="bestsellers" />

        {/* 2. All Products & Featured Catalog */}
        <ProductGrid mode="all" />

        {/* 3. Digital Subscriptions Section */}
        <ProductGrid mode="subscriptions" />

        {/* 4. Special Offers & Discounts Section */}
        <ProductGrid mode="offers" />

        {/* 5. Why Choose Digital Emdz & Guarantees */}
        <AboutSection />

        {/* 6. Frequently Asked Questions (FAQ Accordion) */}
        <FaqSection />

        {/* 7. Contact & Support Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onNavigateSection={handleNavigateSection} />

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <AdminDashboard />
      <SearchModal />
      <PoliciesModal />
      
      {/* Dedicated Owner System Modals */}
      <OwnerLoginModal />
      <ProductEditorModal />
      <ProductDeleteConfirmModal />
      <ServiceRequestModal />

      {/* Mobile Bottom Navigation (Phone optimized) */}
      <MobileBottomNav onNavigateSection={handleNavigateSection} />

      {/* Fixed WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};


export default function App() {
  return (
    <StoreProvider>
      <MainStoreContent />
    </StoreProvider>
  );
}
