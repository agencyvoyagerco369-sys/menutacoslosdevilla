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
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizeProduct, setCustomizeProduct] = useState<Product | null>(null);

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
