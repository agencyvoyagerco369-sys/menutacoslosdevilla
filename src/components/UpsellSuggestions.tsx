import { useState } from 'react';
import { Product } from '@/types/menu';
import { useCart } from '@/contexts/CartContext';
import { Plus, Check, Sparkles } from 'lucide-react';

interface UpsellSuggestionsProps {
    suggestions: { product: Product; badge?: string }[];
    onClose: () => void;
}

export function UpsellSuggestions({ suggestions, onClose }: UpsellSuggestionsProps) {
    const { addItem } = useCart();
    const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

    if (suggestions.length === 0) return null;

    const handleQuickAdd = (product: Product) => {
        addItem(product, 1, product.sizes?.[0], [], '');
        setAddedIds(prev => new Set(prev).add(product.id));

        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    };

    return (
        <div className="animate-slide-up">
            {/* Header */}
            <div className="px-5 pt-5 pb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-highlight/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-highlight" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-foreground text-base">
                            ¿Qué tal agregar…?
                        </h3>
                        <p className="text-muted-foreground text-xs">
                            Otros clientes también piden esto
                        </p>
                    </div>
                </div>
            </div>

            {/* Suggestion Cards */}
            <div className="px-5 pb-4 space-y-2.5">
                {suggestions.map(({ product, badge }) => {
                    const isAdded = addedIds.has(product.id);

                    return (
                        <div
                            key={product.id}
                            className="flex items-center gap-3 p-3 bg-muted/50 rounded-2xl border border-border/50 transition-all hover:bg-muted/80"
                        >
                            {/* Mini Image */}
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {badge && (
                                    <div className="absolute -top-0.5 -left-0.5 bg-highlight text-[8px] font-bold text-highlight-foreground px-1.5 py-0.5 rounded-br-lg rounded-tl-lg whitespace-nowrap">
                                        {badge}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground text-sm leading-tight line-clamp-1">
                                    {product.name}
                                </h4>
                                <span className="font-bold text-primary text-sm">
                                    ${product.sizes?.[0]?.price ?? product.price}
                                </span>
                            </div>

                            {/* Quick Add Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickAdd(product);
                                }}
                                disabled={isAdded}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${isAdded
                                        ? 'bg-green-500 text-white'
                                        : 'bg-primary text-primary-foreground hover:opacity-90'
                                    }`}
                            >
                                {isAdded ? (
                                    <span className="flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" />
                                        Listo
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <Plus className="w-3.5 h-3.5" />
                                        Agregar
                                    </span>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Continue Button */}
            <div className="px-5 pb-5">
                <button
                    onClick={onClose}
                    className="w-full py-3.5 rounded-2xl font-bold text-sm bg-muted text-foreground hover:bg-muted/80 transition-all active:scale-[0.98]"
                >
                    No gracias, continuar →
                </button>
            </div>
        </div>
    );
}
