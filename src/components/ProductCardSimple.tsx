import { useState } from 'react';
import { Product, Extra, SizeOption } from '@/types/menu';
import { useCart } from '@/contexts/CartContext';
import { Plus, Check } from 'lucide-react';

interface ProductCardSimpleProps {
  product: Product;
  onCustomize: (product: Product) => void;
}

export function ProductCardSimple({ product, onCustomize }: ProductCardSimpleProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const displayPrice = product.sizes?.[0]?.price ?? product.price;
  const isPromo = product.category === 'promociones';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If product has sizes or extras, open customization
    if ((product.sizes && product.sizes.length > 1) || product.extras.length > 0) {
      onCustomize(product);
      return;
    }

    // Quick add without customization
    addItem(product, 1, product.sizes?.[0], [], '');
    setIsAdded(true);
    
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <article 
      onClick={() => onCustomize(product)}
      className="flex gap-3 p-3 bg-card rounded-2xl cursor-pointer hover:shadow-md transition-all active:scale-[0.98] relative overflow-hidden"
    >
      {/* Image */}
      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* NEW Promo Banner Style */}
        {isPromo && (
          <div className="absolute top-1 left-1 z-10">
            <div className="bg-gradient-to-r from-[#E31C13] to-[#FF8C00] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 uppercase tracking-tight">
              <span>🔥</span>
              OFERTA
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-foreground text-base">
            ${displayPrice}
          </span>
          
          {/* Add Button */}
          <button
            onClick={handleQuickAdd}
            disabled={isAdded}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isAdded 
                ? 'bg-green-500 text-white' 
                : 'bg-primary text-primary-foreground hover:scale-110 active:scale-95'
            }`}
          >
            {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </article>
  );
}
