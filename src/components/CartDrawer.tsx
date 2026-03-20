import { useState } from 'react';
import { X, Minus, Plus, Trash2, Send, ArrowRight, ArrowLeft, MapPin, User, Phone, Home, CreditCard, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CartItem as CartItemType, CustomerInfo, DwellingType } from '@/types/menu';
import { generateWhatsAppMessage, sendToWhatsApp } from '@/utils/whatsapp';
import { isBusinessOpen } from '@/utils/businessHours';
import { toast } from 'sonner';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_CUSTOMER: CustomerInfo = {
  name: '',
  phone: '',
  street: '',
  exteriorNumber: '',
  dwellingType: 'casa',
  interiorNumber: '',
  neighborhood: '',
  gatedCommunity: false,
  accessCode: '',
  references: '',
  paymentMethod: 'efectivo',
  cashAmount: '',
};

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [step, setStep] = useState<'cart' | 'delivery'>('cart');
  const [customer, setCustomer] = useState<CustomerInfo>(INITIAL_CUSTOMER);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateCustomer = (field: keyof CustomerInfo, value: string | boolean) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validateDeliveryForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!customer.name.trim()) newErrors.name = 'Tu nombre es obligatorio';
    if (!customer.phone.trim()) newErrors.phone = 'Tu teléfono es obligatorio';
    if (customer.phone.trim() && customer.phone.replace(/\D/g, '').length < 10) newErrors.phone = 'Ingresa un teléfono válido (10 dígitos)';
    if (!customer.street.trim()) newErrors.street = 'La calle es obligatoria';
    if (!customer.exteriorNumber.trim()) newErrors.exteriorNumber = 'El número exterior es obligatorio';
    if (!customer.neighborhood.trim()) newErrors.neighborhood = 'La colonia es obligatoria';
    if (customer.gatedCommunity && !customer.accessCode.trim()) newErrors.accessCode = 'Indica cómo acceder';
    if (customer.paymentMethod === 'efectivo' && !customer.cashAmount?.trim()) newErrors.cashAmount = 'Indica con cuánto pagarás';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToDelivery = () => {
    setStep('delivery');
  };

  const handleBackToCart = () => {
    setStep('cart');
  };

  const handleSendOrder = () => {
    if (!validateDeliveryForm()) {
      toast.error('Completa todos los campos obligatorios');
      return;
    }
    if (!isBusinessOpen()) {
      toast.error('Lo sentimos, estamos cerrados. Nuestro horario es de 10 AM a 6 PM.');
      return;
    }
    const message = generateWhatsAppMessage(items, total, customer);
    sendToWhatsApp(message);
    clearCart();
    setCustomer(INITIAL_CUSTOMER);
    setStep('cart');
    onClose();
  };

  const handleClose = () => {
    setStep('cart');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="absolute inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto md:w-[420px] max-h-[92vh] md:max-h-full bg-background rounded-t-3xl md:rounded-none animate-slide-up flex flex-col shadow-float">

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <header className="flex items-center justify-between px-5 py-3 md:py-4">
          <div className="flex items-center gap-3">
            {step === 'delivery' && (
              <button
                onClick={handleBackToCart}
                className="w-8 h-8 flex items-center justify-center bg-muted rounded-full hover:bg-muted/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <h2 className="font-display font-bold text-lg text-foreground">
              {step === 'cart' ? 'Tu Pedido' : '📍 Datos de Entrega'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center bg-muted rounded-full hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </header>

        <div className="h-px bg-border mx-5" />

        {/* Step indicator */}
        {items.length > 0 && (
          <div className="flex items-center gap-2 px-5 pt-3">
            <div className={`flex-1 h-1 rounded-full transition-colors ${step === 'cart' ? 'bg-primary' : 'bg-primary'}`} />
            <div className={`flex-1 h-1 rounded-full transition-colors ${step === 'delivery' ? 'bg-primary' : 'bg-border'}`} />
          </div>
        )}

        {/* ===== STEP 1: CART ===== */}
        {step === 'cart' && (
          <>
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

            {/* Footer - Continue to delivery */}
            {items.length > 0 && (
              <footer className="px-5 pb-5 pt-3 bg-background border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground font-medium">Total</span>
                  <span className="font-display font-extrabold text-xl text-primary">${total}</span>
                </div>

                <button
                  onClick={handleContinueToDelivery}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-base transition-colors active:scale-[0.98]"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>
              </footer>
            )}
          </>
        )}

        {/* ===== STEP 2: DELIVERY INFO ===== */}
        {step === 'delivery' && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="text-muted-foreground text-sm mb-5">
                Para poder hacerte una entrega perfecta, necesitamos tu información completa.
              </p>

              <div className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1.5">
                    <User className="w-4 h-4 text-primary" /> Tu nombre *
                  </label>
                  <input
                    value={customer.name}
                    onChange={(e) => updateCustomer('name', e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className={`w-full px-4 py-3 rounded-xl bg-muted border-2 text-sm focus:outline-none transition-colors ${errors.name ? 'border-destructive' : 'border-transparent focus:border-primary'}`}
                  />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1.5">
                    <Phone className="w-4 h-4 text-primary" /> Teléfono *
                  </label>
                  <input
                    value={customer.phone}
                    onChange={(e) => updateCustomer('phone', e.target.value)}
                    placeholder="644 123 4567"
                    type="tel"
                    className={`w-full px-4 py-3 rounded-xl bg-muted border-2 text-sm focus:outline-none transition-colors ${errors.phone ? 'border-destructive' : 'border-transparent focus:border-primary'}`}
                  />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Divider */}
                <div className="h-px bg-border" />

                {/* Calle */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1.5">
                    <MapPin className="w-4 h-4 text-primary" /> Calle *
                  </label>
                  <input
                    value={customer.street}
                    onChange={(e) => updateCustomer('street', e.target.value)}
                    placeholder="Ej. Blvd. Morelos"
                    className={`w-full px-4 py-3 rounded-xl bg-muted border-2 text-sm focus:outline-none transition-colors ${errors.street ? 'border-destructive' : 'border-transparent focus:border-primary'}`}
                  />
                  {errors.street && <p className="text-destructive text-xs mt-1">{errors.street}</p>}
                </div>

                {/* Num Ext + Num Int */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block"># Exterior *</label>
                    <input
                      value={customer.exteriorNumber}
                      onChange={(e) => updateCustomer('exteriorNumber', e.target.value)}
                      placeholder="123"
                      className={`w-full px-4 py-3 rounded-xl bg-muted border-2 text-sm focus:outline-none transition-colors ${errors.exteriorNumber ? 'border-destructive' : 'border-transparent focus:border-primary'}`}
                    />
                    {errors.exteriorNumber && <p className="text-destructive text-xs mt-1">{errors.exteriorNumber}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block"># Interior</label>
                    <input
                      value={customer.interiorNumber}
                      onChange={(e) => updateCustomer('interiorNumber', e.target.value)}
                      placeholder="Opcional"
                      className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Colonia */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Colonia *</label>
                  <input
                    value={customer.neighborhood}
                    onChange={(e) => updateCustomer('neighborhood', e.target.value)}
                    placeholder="Ej. Centro"
                    className={`w-full px-4 py-3 rounded-xl bg-muted border-2 text-sm focus:outline-none transition-colors ${errors.neighborhood ? 'border-destructive' : 'border-transparent focus:border-primary'}`}
                  />
                  {errors.neighborhood && <p className="text-destructive text-xs mt-1">{errors.neighborhood}</p>}
                </div>

                {/* Tipo de vivienda */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1.5">
                    <Home className="w-4 h-4 text-primary" /> Tipo de vivienda
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['casa', 'departamento', 'edificio'] as DwellingType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => updateCustomer('dwellingType', type)}
                        className={`py-2.5 rounded-xl border-2 text-sm font-medium capitalize transition-all ${customer.dwellingType === type
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                          }`}
                      >
                        {type === 'casa' ? '🏠 Casa' : type === 'departamento' ? '🏢 Depto' : '🏗️ Edificio'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fraccionamiento privado */}
                <div className="flex items-center justify-between bg-muted rounded-xl px-4 py-3">
                  <span className="text-sm font-medium text-foreground">¿Fraccionamiento privado?</span>
                  <button
                    onClick={() => updateCustomer('gatedCommunity', !customer.gatedCommunity)}
                    className={`w-12 h-7 rounded-full transition-colors relative ${customer.gatedCommunity ? 'bg-primary' : 'bg-border'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${customer.gatedCommunity ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {customer.gatedCommunity && (
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">🔒 Código de acceso *</label>
                    <input
                      value={customer.accessCode}
                      onChange={(e) => updateCustomer('accessCode', e.target.value)}
                      placeholder="Ej. Portón azul, código 1234"
                      className={`w-full px-4 py-3 rounded-xl bg-muted border-2 text-sm focus:outline-none transition-colors ${errors.accessCode ? 'border-destructive' : 'border-transparent focus:border-primary'}`}
                    />
                    {errors.accessCode && <p className="text-destructive text-xs mt-1">{errors.accessCode}</p>}
                  </div>
                )}

                {/* Referencias */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">👀 Referencias</label>
                  <textarea
                    value={customer.references}
                    onChange={(e) => updateCustomer('references', e.target.value)}
                    placeholder="Ej. Casa blanca con portón negro, frente a la tienda"
                    className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent text-sm focus:outline-none focus:border-primary resize-none transition-colors"
                    rows={2}
                  />
                </div>

                {/* Divider */}
                <div className="h-px bg-border" />

                {/* Método de pago */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1.5">
                    <CreditCard className="w-4 h-4 text-primary" /> Método de pago *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateCustomer('paymentMethod', 'efectivo')}
                      className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${customer.paymentMethod === 'efectivo'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                        }`}
                    >
                      💵 Efectivo
                    </button>
                    <button
                      onClick={() => updateCustomer('paymentMethod', 'transferencia')}
                      className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${customer.paymentMethod === 'transferencia'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                        }`}
                    >
                      🏦 Transferencia
                    </button>
                  </div>
                </div>

                {customer.paymentMethod === 'efectivo' && (
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">💵 ¿Con cuánto pagas? *</label>
                    <input
                      value={customer.cashAmount || ''}
                      onChange={(e) => updateCustomer('cashAmount', e.target.value)}
                      placeholder="Ej. 200"
                      type="number"
                      className={`w-full px-4 py-3 rounded-xl bg-muted border-2 text-sm focus:outline-none transition-colors ${errors.cashAmount ? 'border-destructive' : 'border-transparent focus:border-primary'}`}
                    />
                    {errors.cashAmount && <p className="text-destructive text-xs mt-1">{errors.cashAmount}</p>}
                    {customer.cashAmount && Number(customer.cashAmount) > 0 && Number(customer.cashAmount) >= total && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Tu cambio: <span className="font-bold text-primary">${Number(customer.cashAmount) - total}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Send to WhatsApp */}
            <footer className="px-5 pb-5 pt-3 bg-background border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground font-medium">Total del pedido</span>
                <span className="font-display font-extrabold text-xl text-primary">${total}</span>
              </div>
              <button
                onClick={handleSendOrder}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-base transition-colors active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                Enviar pedido por WhatsApp
              </button>
            </footer>
          </>
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
        {item.selectedExtras.map((extra, idx) => (
          <div key={`${extra.id}-${idx}`} className="flex justify-between text-muted-foreground">
            <span className="flex items-center gap-1">
              <Plus className="w-3 h-3" /> {extra.name}
            </span>
            <span>{extra.price > 0 ? `+$${extra.price}` : 'Incluido'}</span>
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
