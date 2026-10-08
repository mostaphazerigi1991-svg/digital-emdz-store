import React, { useEffect } from 'react';
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
  const { products, selectedProduct, setSelectedCategory, setSelectedProduct } = useStore();

  useEffect(() => {
    const productKey = new URLSearchParams(window.location.search).get('product');
    const sharedProduct = productKey
      ? products.find(product => product.id === productKey || product.slug === productKey)
      : null;

    if (sharedProduct) {
      setSelectedProduct(sharedProduct);
    }
  }, [products, setSelectedProduct]);

  // SEO for individual product URLs. This makes the existing modal-backed product
  // URLs self-describing when Google renders the JavaScript page.
  useEffect(() => {
    const productKey = new URLSearchParams(window.location.search).get('product');
    const product = selectedProduct || (productKey
      ? products.find(p => p.id === productKey || p.slug === productKey)
      : null);

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }

    let schema = document.getElementById('digitalemdz-product-schema') as HTMLScriptElement | null;

    if (product) {
      const productUrl = `https://digitalemdz.store/?product=${encodeURIComponent(product.slug || product.id)}`;
      document.title = `${product.name} | Digital Emdz`;
      setMeta('description', product.shortDescription || product.fullDescription || `${product.name} - منتج رقمي متاح على Digital Emdz.`);
      setMeta('robots', 'index, follow');
      canonical.href = productUrl;

      if (!schema) {
        schema = document.createElement('script');
        schema.id = 'digitalemdz-product-schema';
        schema.type = 'application/ld+json';
        document.head.appendChild(schema);
      }

      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.fullDescription || product.shortDescription,
        image: product.image ? [product.image] : undefined,
        sku: product.id,
        offers: {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: 'DZD',
          price: String(product.price),
          availability: product.isPublished === false
            ? 'https://schema.org/OutOfStock'
            : 'https://schema.org/InStock'
        }
      });
    } else {
      document.title = 'Digital Emdz | متجر المنتجات والاشتراكات الرقمية';
      setMeta('description', 'Digital Emdz متجر رقمي لبيع المنتجات الرقمية والاشتراكات والقوالب والخدمات الرقمية بسهولة وأمان.');
      setMeta('robots', 'index, follow');
      canonical.href = 'https://digitalemdz.store/';
      if (schema) schema.remove();
    }
  }, [products, selectedProduct]);

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
