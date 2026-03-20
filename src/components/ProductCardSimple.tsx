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
      className={`flex gap-3 p-3 rounded-2xl cursor-pointer hover:shadow-md transition-all active:scale-[0.98] relative overflow-hidden ${
        isPromo 
          ? 'bg-gradient-to-r from-red-50 to-card border border-red-200/60' 
          : 'bg-card'
      }`}
    >
      {/* Promo left accent bar */}
      {isPromo && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-rose-600" />
      )}

      {/* Image */}
      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Full-width OFERTA banner */}
        {isPromo && (
          <div className="absolute top-0 left-0 right-0 z-10">
            <div className="bg-gradient-to-r from-[#E31C13] to-[#FF8C00] text-white text-[10px] font-black py-1 text-center flex items-center justify-center gap-1 uppercase tracking-wide">
              <span>🔥</span>
              OFERTA
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-1">
              {product.name}
            </h3>
            {isPromo && (
              <span className="shrink-0 bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-wide">
                AHORRA
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-bold text-base ${isPromo ? 'text-red-700' : 'text-foreground'}`}>
              ${displayPrice}
            </span>
            {isPromo && (
              <span className="text-[10px] text-red-600 font-semibold bg-red-100 px-1.5 py-0.5 rounded">
                Precio especial
              </span>
            )}
          </div>
          
          {/* Add Button */}
          <button
            onClick={handleQuickAdd}
            disabled={isAdded}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isAdded 
                ? 'bg-green-500 text-white' 
                : isPromo 
                  ? 'bg-red-600 text-white hover:scale-110 active:scale-95'
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
