import { useState } from 'react';
import { Product, Extra, SizeOption } from '@/types/menu';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, ChevronDown, ChevronUp, Check, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<SizeOption | undefined>(
    product.sizes?.[0]
  );
  const [extraQuantities, setExtraQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [showExtras, setShowExtras] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const basePrice = selectedSize ? selectedSize.price : product.price;
  const extrasTotal = product.extras.reduce((sum, e) => sum + e.price * (extraQuantities[e.id] || 0), 0);
  const totalPrice = (basePrice + extrasTotal) * quantity;

  const selectedExtrasCount = Object.values(extraQuantities).reduce((sum, q) => sum + q, 0);

  const getSelectedExtrasArray = (): Extra[] => {
    const result: Extra[] = [];
    product.extras.forEach(extra => {
      const qty = extraQuantities[extra.id] || 0;
      for (let i = 0; i < qty; i++) {
        result.push(extra);
      }
    });
    return result;
  };

  const handleExtraQuantityChange = (extraId: string, delta: number) => {
    setExtraQuantities(prev => {
      const current = prev[extraId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [extraId]: next };
    });
  };

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, getSelectedExtrasArray(), notes);
    setIsAdded(true);
    
    // Vibration feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Reset animation after delay
    setTimeout(() => {
      setIsAdded(false);
      setQuantity(1);
      setExtraQuantities({});
      setNotes('');
      setShowExtras(false);
    }, 1500);
  };
  const isPromo = product.category === 'promociones';

  return (
    <article className={`food-card ${isPromo ? 'ring-2 ring-red-400/30' : ''} bg-card`}>
      {/* Food Image - 60% height */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="food-card-image"
          loading="lazy"
        />
        <div className="absolute inset-0 food-card-gradient" />

        {/* DiDi/Uber style promo badge */}
        {isPromo && (
          <>
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-red-600 text-white text-[11px] font-bold pl-1.5 pr-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                <Zap className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                Promo
              </div>
            </div>
            <div className="absolute top-3 right-3 z-10">
              <div className="bg-black/70 backdrop-blur-sm text-red-400 text-[10px] font-bold px-2 py-1 rounded-lg">
                ⚡ Precio especial
              </div>
            </div>
          </>
        )}
        
        {/* Price Badge */}
        <div className={`absolute bottom-3 right-3 px-3 py-1 rounded-full font-bold text-lg shadow-lg ${
          isPromo 
            ? 'bg-red-600 text-white' 
            : 'bg-highlight text-highlight-foreground'
        }`}>
          ${basePrice}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Name */}
        <h3 className="font-display font-bold text-xl text-foreground leading-tight">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {product.description}
        </p>

        {/* Size Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                  selectedSize?.id === size.id
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {size.name} - ${size.price}
              </button>
            ))}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Cantidad:</span>
          <div className="quantity-selector">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="quantity-btn bg-background text-foreground hover:bg-primary hover:text-primary-foreground"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-foreground">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="quantity-btn bg-background text-foreground hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Extras Accordion */}
        {product.extras.length > 0 && (
          <div className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setShowExtras(!showExtras)}
              className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted transition-colors"
            >
              <span className="text-sm font-medium text-foreground">
                🍽️ Guarniciones {selectedExtrasCount > 0 && `(${selectedExtrasCount})`}
              </span>
              {showExtras ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            
            {showExtras && (
              <div className="p-3 space-y-2 animate-fade-in">
                {product.extras.map((extra) => {
                  const qty = extraQuantities[extra.id] || 0;
                  return (
                    <div
                      key={extra.id}
                      className="flex items-center justify-between p-2 rounded-lg"
                    >
                      <div className="flex-1">
                        <span className="text-sm text-foreground">{extra.name}</span>
                        <span className="text-sm font-medium text-highlight ml-2">+${extra.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {qty > 0 && (
                          <button
                            onClick={() => handleExtraQuantityChange(extra.id, -1)}
                            className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {qty > 0 && (
                          <span className="w-5 text-center font-bold text-sm text-foreground">{qty}</span>
                        )}
                        <button
                          onClick={() => handleExtraQuantityChange(extra.id, 1)}
                          className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Special Instructions */}
        <div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej. Sin repollo, sin salsa, extra jugo de tomate..."
            className="checkout-input text-sm min-h-[60px] resize-none"
            maxLength={200}
          />
        </div>

        {/* Total & Add Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="price-tag">
            ${totalPrice}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`btn-primary-gradient flex items-center gap-2 ${
              isAdded ? 'animate-pop !bg-green-500' : ''
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5" />
                ¡Agregado!
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
