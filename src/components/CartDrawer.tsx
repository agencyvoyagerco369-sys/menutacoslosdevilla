import { X, Minus, Plus, Trash2, Send } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CartItem as CartItemType } from '@/types/menu';
import { sendToWhatsApp } from '@/utils/whatsapp';
import { isBusinessOpen } from '@/utils/businessHours';
import { toast } from 'sonner';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function generateCartMessage(items: CartItemType[], total: number): string {
  const itemsList = items.map(item => {
    const lines: string[] = [];
    lines.push(`*${item.quantity}x ${item.product.name}*`);
    if (item.selectedSize) lines.push(`   📏 ${item.selectedSize.name}`);
    if (item.selectedExtras.length > 0) {
      lines.push(`   ➕ ${item.selectedExtras.map(e => e.name).join(', ')}`);
    }
    if (item.notes) lines.push(`   📝 ${item.notes}`);
    lines.push(`   💲 $${item.subtotal}`);
    return lines.join('\n');
  }).join('\n\n');

  return `🌮 *NUEVO PEDIDO — LOS DE VILLA*
━━━━━━━━━━━━━━━━━

${itemsList}

━━━━━━━━━━━━━━━━━
✅ *TOTAL: $${total}*

📍 _Envía tu dirección para coordinar la entrega_ 🛵`;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  const handleSendToWhatsApp = () => {
    if (!isBusinessOpen()) {
      toast.error('Lo sentimos, estamos cerrados. Nuestro horario es de 10 AM a 6 PM.');
      return;
    }

    const message = generateCartMessage(items, total);
    sendToWhatsApp(message);
    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto md:w-[420px] max-h-[92vh] md:max-h-full bg-background rounded-t-3xl md:rounded-none animate-slide-up flex flex-col shadow-float">

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <header className="flex items-center justify-between px-5 py-3 md:py-4">
          <h2 className="font-display font-bold text-lg text-foreground">
            Tu Pedido
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-muted rounded-full hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </header>

        <div className="h-px bg-border mx-5" />

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🛒</div>
                <p className="text-foreground font-semibold text-base">Tu carrito está vacío</p>
                <p className="text-sm text-muted-foreground mt-1">¡Agrega algo delicioso! 🦐</p>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}

                {/* Order summary */}
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="font-display font-bold text-foreground text-xs uppercase tracking-widest mb-3 text-muted-foreground">
                    Resumen del pedido
                  </h4>
                  <div className="space-y-2">
                    {items.map((item) => {
                      const extrasTotal = item.selectedExtras.reduce((sum, e) => sum + e.price, 0);
                      return (
                        <div key={item.id} className="space-y-0.5">
                          <div className="flex justify-between text-sm">
                            <span className="text-foreground">
                              {item.quantity}× {item.product.name}
                            </span>
                            <span className="text-foreground font-semibold">${item.subtotal}</span>
                          </div>
                          {extrasTotal > 0 && (
                            <p className="text-xs text-muted-foreground pl-4">
                              Extras: +${extrasTotal * item.quantity}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                    <span className="font-display font-bold text-foreground">Total</span>
                    <span className="font-display font-extrabold text-primary text-xl">${total}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer - Direct WhatsApp button */}
        {items.length > 0 && (
          <footer className="px-5 pb-5 pt-3 bg-background border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground font-medium">Total</span>
              <span className="font-display font-extrabold text-xl text-primary">${total}</span>
            </div>

            <button
              onClick={handleSendToWhatsApp}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-base transition-colors"
            >
              <Send className="w-4 h-4" />
              Enviar pedido por WhatsApp
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}

/* ── Cart Item Card ── */
function CartItemCard({ item, onUpdateQuantity, onRemove }: {
  item: CartItemType;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border/60">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-display font-semibold text-foreground text-[15px] leading-tight flex-1 pr-2">
          {item.product.name}
        </h4>
        <button
          onClick={() => onRemove(item.id)}
          className="w-8 h-8 flex items-center justify-center text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1 text-sm mb-3">
        {item.selectedSize ? (
          <div className="flex justify-between text-muted-foreground">
            <span>{item.selectedSize.name}</span>
            <span>${item.selectedSize.price}</span>
          </div>
        ) : (
          <div className="flex justify-between text-muted-foreground">
            <span>Precio base</span>
            <span>${item.product.price}</span>
          </div>
        )}
        {item.selectedExtras.map((extra) => (
          <div key={extra.id} className="flex justify-between text-muted-foreground">
            <span className="flex items-center gap-1">
              <Plus className="w-3 h-3" /> {extra.name}
            </span>
            <span>+${extra.price}</span>
          </div>
        ))}
        {item.notes && (
          <p className="text-primary/80 italic text-xs mt-1">
            📝 {item.notes}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center bg-muted rounded-xl overflow-hidden">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-9 text-center font-bold text-sm text-foreground">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="font-display font-bold text-primary text-lg">${item.subtotal}</span>
      </div>
    </div>
  );
}
