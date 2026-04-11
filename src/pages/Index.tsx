import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { WhatsAppBanner } from '@/components/WhatsAppBanner';
import { CategoryTabs } from '@/components/CategoryTabs';
import { CategorySection } from '@/components/CategorySection';
import { FloatingCart } from '@/components/FloatingCart';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductCustomizeSheet } from '@/components/ProductCustomizeSheet';
import { CartProvider } from '@/contexts/CartContext';
import { MENU_PRODUCTS } from '@/data/menu';
import { CATEGORIES, Product } from '@/types/menu';
import { PromoCarousel } from '@/components/PromoCarousel';
import { useEffect, useRef } from 'react';

function MenuApp() {
  // 🔒 MANTENIMIENTO — Cambiar a false para salir de mantenimiento
  const MAINTENANCE_MODE = false;

  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizeProduct, setCustomizeProduct] = useState<Product | null>(null);

  if (MAINTENANCE_MODE) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 mb-6 rounded-full mx-auto shadow-elevated bg-card border-4 border-border overflow-hidden flex items-center justify-center text-5xl">
          🌮
        </div>
        <h1 className="text-3xl font-extrabold mb-4 tracking-tight">¡Volvemos Pronto!</h1>
        <p className="text-muted-foreground text-[16px] font-medium leading-relaxed max-w-xs mx-auto mb-10">
          Estamos afinando la parrilla y mejorando nuestra app para ofrecerte más opciones. ¡No te vayas lejos!
        </p>
        <div className="inline-flex items-center justify-center rounded-full bg-orange-500/15 px-5 py-2.5">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse mr-2" />
          <span className="text-sm font-bold text-orange-600">Sistema en Mantenimiento</span>
        </div>
      </div>
    );
  }

  // References and Observer for Sticky Scroll Sync
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      // Find the first intersecting section to set active
      const visibleSection = entries.find(entry => entry.isIntersecting);
      if (visibleSection) {
        const id = visibleSection.target.id.replace('category-', '');
        setActiveCategory(id);
      }
    }, {
      rootMargin: '-100px 0px -40% 0px', // Trigger when section passes header
      threshold: 0.1
    });

    const sections = document.querySelectorAll('section[id^="category-"]');
    sections.forEach((section) => observer.current?.observe(section));

    return () => observer.current?.disconnect();
  }, []);

  const handleViewMenu = () => {
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Offset account for sticky header height
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <HeroSection onViewMenu={handleViewMenu} />

      {/* WhatsApp Banner (mobile only) */}
      <WhatsAppBanner />

      {/* Rappi Style Promo Banners Carousel */}
      <PromoCarousel />

      {/* Sticky Category Tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* ALL Category Products Rendered Sequentially */}
      <div className="pb-32">
        {CATEGORIES.map((cat) => (
          <CategorySection
            key={cat.id}
            categoryId={cat.id}
            products={MENU_PRODUCTS}
            onCustomize={setCustomizeProduct}
          />
        ))}
      </div>

      {/* Floating Cart */}
      <FloatingCart onOpenCart={() => setIsCartOpen(true)} />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Product Customization Sheet */}
      <ProductCustomizeSheet
        product={customizeProduct}
        isOpen={!!customizeProduct}
        onClose={() => setCustomizeProduct(null)}
        onGoToCart={() => { setCustomizeProduct(null); setIsCartOpen(true); }}
      />
    </div>
  );
}

export default function Index() {
  return (
    <CartProvider>
      <MenuApp />
    </CartProvider>
  );
}
