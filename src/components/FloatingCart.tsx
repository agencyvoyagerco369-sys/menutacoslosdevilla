import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface FloatingCartProps {
  onOpenCart: () => void;
}

export function FloatingCart({ onOpenCart }: FloatingCartProps) {
  const { itemCount, total } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="floating-cart animate-slide-up">
      <button
        onClick={onOpenCart}
        className="w-full bg-accent text-accent-foreground rounded-2xl p-4 flex items-center justify-between hover:opacity-95 transition-opacity"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-highlight text-highlight-foreground w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center">
              {itemCount}
            </span>
          </div>
          <span className="font-semibold">Ver pedido</span>
        </div>
        <span className="font-bold text-lg">${total}</span>
      </button>
    </div>
  );
}
