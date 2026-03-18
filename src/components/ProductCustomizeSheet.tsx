import { useState, useEffect } from 'react';
import { Product, Extra, SizeOption, AVAILABLE_EXTRAS } from '@/types/menu';
import { useCart } from '@/contexts/CartContext';
import { X, Minus, Plus, Check } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { UpsellSuggestions } from './UpsellSuggestions';
import { getUpsellSuggestions } from '@/data/upsellRules';

interface ProductCustomizeSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToCart: () => void;
}

export function ProductCustomizeSheet({ product, isOpen, onClose, onGoToCart }: ProductCustomizeSheetProps) {
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<SizeOption | undefined>();
  const [extraQuantities, setExtraQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [upsellSuggestions, setUpsellSuggestions] = useState<{ product: Product; badge?: string }[]>([]);
  const [promoTacos, setPromoTacos] = useState({ harina: 3, maiz: 0 });

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedSize(product.sizes?.[0]);
      setExtraQuantities({});
      setNotes('');
      setIsAdded(false);
      setShowUpsell(false);
      setUpsellSuggestions([]);
      setPromoTacos({ harina: 3, maiz: 0 });
    }
  }, [product]);

  if (!product) return null;

  const basePrice = selectedSize?.price ?? product.price;
  const extrasTotal = AVAILABLE_EXTRAS.reduce((sum, e) => sum + e.price * (extraQuantities[e.id] || 0), 0);
  const totalPrice = (basePrice + extrasTotal) * quantity;

  // Convert quantities to Extra[] for cart (repeated entries)
  const getSelectedExtrasArray = (): Extra[] => {
    const result: Extra[] = [];
    AVAILABLE_EXTRAS.forEach(extra => {
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

  const totalPromoTacos = promoTacos.harina + promoTacos.maiz;

  const handlePromoTacoChange = (type: 'harina' | 'maiz', delta: number) => {
    setPromoTacos(prev => {
      const newQty = prev[type] + delta;
      if (newQty < 0) return prev;
      if (delta > 0 && prev.harina + prev.maiz >= 3) return prev;
      return { ...prev, [type]: newQty };
    });
  };

  const handleAddToCart = () => {
    let finalNotes = notes;
    if (product.id === 'promo-taquera') {
      const tacoBreakdown = `🌮 Tacos elegidos: ${promoTacos.harina} de Harina, ${promoTacos.maiz} de Maíz`;
      finalNotes = finalNotes ? `${tacoBreakdown}\n${finalNotes}` : tacoBreakdown;
    }

    addItem(product, quantity, selectedSize, getSelectedExtrasArray(), finalNotes);
    setIsAdded(true);

    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Get upsell suggestions
    const cartProductIds = items.map(item => item.product.id);
    const suggestions = getUpsellSuggestions(product, [...cartProductIds, product.id], 3);

    if (suggestions.length > 0) {
      // Show upsell after a short delay for the "¡Agregado!" animation
      setTimeout(() => {
        setUpsellSuggestions(suggestions);
        setShowUpsell(true);
      }, 600);
    } else {
      // No suggestions, close normally
      setTimeout(() => {
        onClose();
      }, 800);
    }
  };

  const handleUpsellClose = () => {
    setShowUpsell(false);
    onClose();
  };

  const selectedExtrasCount = Object.values(extraQuantities).reduce((sum, q) => sum + q, 0);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl p-0 overflow-hidden flex flex-col">

        {/* === UPSELL VIEW === */}
        {showUpsell ? (
          <div className="flex flex-col h-full">
            {/* Compact success header */}
            <div className="bg-green-500 px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">¡{product.name} agregado!</p>
                <p className="text-white/80 text-xs">{quantity} x ${basePrice}</p>
              </div>
            </div>

            {/* Upsell suggestions */}
            <div className="flex-1 overflow-y-auto">
              <UpsellSuggestions
                suggestions={upsellSuggestions}
                onClose={handleUpsellClose}
                onGoToCart={() => { handleUpsellClose(); onGoToCart(); }}
              />
            </div>
          </div>
        ) : (
          /* === NORMAL CUSTOMIZE VIEW === */
          <>
            {/* Product Image - compact */}
            <div className="relative h-48 shrink-0 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="font-display font-bold text-2xl text-white drop-shadow-lg">
                  {product.name}
                </h2>
                <p className="text-white/80 text-sm mt-1">${basePrice}</p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pb-40">
              {/* Description */}
              <div className="px-5 py-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="px-5 pb-4 space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    📏 Elige tu tamaño
                    <span className="text-xs text-muted-foreground font-normal">(Requerido)</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size)}
                        className={`relative p-4 rounded-2xl border-2 transition-all ${selectedSize?.id === size.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                          }`}
                      >
                        {selectedSize?.id === size.id && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                        <span className="block font-medium text-foreground">{size.name}</span>
                        <span className="block font-bold text-foreground text-lg">${size.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Promo Taquera Tacos Selector */}
              {product.id === 'promo-taquera' && (
                <div className="px-5 pb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      🌮 Personaliza tus 3 Tacos
                      {totalPromoTacos !== 3 && (
                        <span className="text-xs text-destructive font-bold">(Faltan {3 - totalPromoTacos})</span>
                      )}
                    </h3>
                  </div>

                  <div className="divide-y divide-border border-2 border-primary/10 rounded-2xl overflow-hidden bg-card/50">
                    {/* Harina */}
                    <div className="flex items-center justify-between p-4">
                      <span className="font-medium text-foreground">Tacos de Harina</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handlePromoTacoChange('harina', -1)}
                          disabled={promoTacos.harina === 0}
                          className="w-9 h-9 rounded-full border-2 border-primary flex items-center justify-center text-primary disabled:opacity-50 disabled:border-muted disabled:text-muted-foreground active:scale-95 transition-transform"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-5 text-center font-bold text-[17px]">{promoTacos.harina}</span>
                        <button
                          onClick={() => handlePromoTacoChange('harina', 1)}
                          disabled={totalPromoTacos >= 3}
                          className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-50 disabled:bg-muted active:scale-95 transition-transform"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Maíz */}
                    <div className="flex items-center justify-between p-4">
                      <span className="font-medium text-foreground">Tacos de Maíz</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handlePromoTacoChange('maiz', -1)}
                          disabled={promoTacos.maiz === 0}
                          className="w-9 h-9 rounded-full border-2 border-primary flex items-center justify-center text-primary disabled:opacity-50 disabled:border-muted disabled:text-muted-foreground active:scale-95 transition-transform"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-5 text-center font-bold text-[17px]">{promoTacos.maiz}</span>
                        <button
                          onClick={() => handlePromoTacoChange('maiz', 1)}
                          disabled={totalPromoTacos >= 3}
                          className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-50 disabled:bg-muted active:scale-95 transition-transform"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="h-2 bg-muted/50" />

              {/* Guarniciones Section */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground text-base">
                    🍽️ Guarniciones
                  </h3>
                  <div className="flex items-center gap-2">
                    {extrasTotal > 0 && (
                      <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        +${extrasTotal}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">$5 c/u</span>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {AVAILABLE_EXTRAS.map((extra) => {
                    const qty = extraQuantities[extra.id] || 0;
                    return (
                      <div
                        key={extra.id}
                        className="flex items-center justify-between py-4"
                      >
                        <div className="flex-1">
                          <span className="font-medium text-foreground text-[15px]">{extra.name}</span>
                          {qty > 0 && (
                            <span className="text-sm text-primary ml-2 font-semibold">+${extra.price * qty}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {qty > 0 ? (
                            <>
                              <button
                                onClick={() => handleExtraQuantityChange(extra.id, -1)}
                                className="w-9 h-9 rounded-full border-2 border-primary flex items-center justify-center text-primary active:scale-95 transition-transform"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-7 text-center font-bold text-foreground text-base">{qty}</span>
                            </>
                          ) : null}
                          <button
                            onClick={() => handleExtraQuantityChange(extra.id, 1)}
                            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground active:scale-95 transition-transform shadow-sm"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="h-2 bg-muted/50" />

              {/* Special Instructions */}
              <div className="px-5 py-4 space-y-3">
                <h3 className="font-semibold text-foreground">
                  📝 Instrucciones especiales <span className="text-xs text-muted-foreground font-normal">(Opcional)</span>
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Sin repollo, sin salsa, extra jugo de tomate..."
                  className="w-full p-4 rounded-2xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none resize-none text-sm"
                  rows={2}
                  maxLength={200}
                />
              </div>
            </div>

            {/* Fixed Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border p-4 space-y-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
              {/* Quantity */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="font-bold text-xl text-foreground w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdded || (product?.id === 'promo-taquera' && totalPromoTacos !== 3)}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${isAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]'
                  }`}
              >
                {isAdded ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    ¡Agregado!
                  </span>
                ) : (
                  <span>
                    Agregar ${totalPrice}
                    {extrasTotal > 0 && (
                      <span className="text-primary-foreground/70 text-sm ml-1">
                        (incluye ${extrasTotal} en guarniciones)
                      </span>
                    )}
                  </span>
                )}
              </button>
            </div>
          </>
        )}

      </SheetContent>
    </Sheet>
  );
}
