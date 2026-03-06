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

function MenuApp() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizeProduct, setCustomizeProduct] = useState<Product | null>(null);

  const handleViewMenu = () => {
    // Scroll to first category
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <HeroSection onViewMenu={handleViewMenu} />

      {/* WhatsApp Banner (mobile only) */}
      <WhatsAppBanner />

      {/* Sticky Category Tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Active Category Products */}
      <CategorySection 
        categoryId={activeCategory}
        products={MENU_PRODUCTS}
        onCustomize={setCustomizeProduct}
      />

      {/* Floating Cart */}
      <FloatingCart onOpenCart={() => setIsCartOpen(true)} />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Product Customization Sheet */}
      <ProductCustomizeSheet
        product={customizeProduct}
        isOpen={!!customizeProduct}
        onClose={() => setCustomizeProduct(null)}
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
