import { useState } from 'react';
import { X, Minus, Plus, Trash2, ArrowLeft, Send } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CustomerInfo } from '@/types/menu';
import { generateWhatsAppMessage, sendToWhatsApp } from '@/utils/whatsapp';
import { isBusinessOpen } from '@/utils/businessHours';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [customer, setCustomer] = useState<CustomerInfo>({
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
    optInMarketing: true,
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customer.name.trim()) newErrors.name = 'Ingresa tu nombre';
    if (!customer.phone.trim() || customer.phone.length < 10) newErrors.phone = 'Ingresa un teléfono válido';
    if (!customer.street.trim()) newErrors.street = 'Ingresa tu calle';
    if (customer.dwellingType === 'casa' && !customer.exteriorNumber.trim()) newErrors.exteriorNumber = 'Ingresa el número exterior';
    if (!customer.neighborhood.trim()) newErrors.neighborhood = 'Ingresa tu colonia';
    if (customer.gatedCommunity && !customer.accessCode.trim()) {
      newErrors.accessCode = 'Ingresa la contraseña de acceso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!isBusinessOpen()) {
      toast.error('Lo sentimos, estamos cerrados. Nuestro horario es de 10 AM a 6 PM.');
      return;
    }

    if (!validateForm()) return;

    const message = generateWhatsAppMessage(items, total, customer);

    try {
      // 1. Save or Update Customer (CRM)
      // Upsert basándose en el teléfono
      const { data: customerData, error: customerError } = await (supabase as any)
        .from('customers')
        .upsert({
          phone: customer.phone,
          name: customer.name,
          opt_in_marketing: customer.optInMarketing ?? true,
          last_order_date: new Date().toISOString(),
          // Se sumará en el trigger o código backend luego, por ahora solo el upsert básico.
        }, { onConflict: 'phone' })
        .select()
        .single();

      if (customerError) {
        console.error("Error guardando cliente:", customerError);
      }

      // 2. Create Order
      const { data: orderData, error: orderError } = await (supabase as any)
        .from('orders')
        .insert({
          customer_id: customerData?.id || null,
          customer_name: customer.name,
          customer_phone: customer.phone,
          status: 'pending',
          payment_method: customer.paymentMethod,
          payment_status: 'unpaid',
          total_amount: total,
          delivery_type: 'delivery', // o pickup dependiendo de la lógica futura
          delivery_address: {
            street: customer.street,
            exteriorNumber: customer.exteriorNumber,
            interiorNumber: customer.interiorNumber,
            neighborhood: customer.neighborhood,
            dwellingType: customer.dwellingType,
            gatedCommunity: customer.gatedCommunity,
            accessCode: customer.accessCode,
            references: customer.references
          }
        })
        .select()
        .single();

      if (orderError) {
        console.error("Error creando orden:", orderError);
      }

      // 3. Save Order Items if order was created
      if (orderData && !orderError) {
        const orderItemsPayload = items.map(item => ({
          order_id: orderData.id,
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: item.selectedSize?.price || item.product.price,
          subtotal: item.subtotal,
          selected_size: item.selectedSize?.name,
          extras: item.selectedExtras,
          notes: item.notes
        }));

        await (supabase as any).from('order_items').insert(orderItemsPayload);
      }

    } catch (dbError) {
      console.error("Critical DB error during checkout:", dbError);
    }

    sendToWhatsApp(message);

    // Send email notification in background
    try {
      const emailPayload = {
        items: items.map(item => ({
          quantity: item.quantity,
          productName: item.product.name,
          sizeName: item.selectedSize?.name,
          extras: item.selectedExtras.map(e => e.name),
          notes: item.notes,
          subtotal: item.subtotal,
        })),
        total,
        customer,
      };
      supabase.functions.invoke('send-order-email', { body: emailPayload });
    } catch (e) {
      console.error('Email notification failed:', e);
    }

    clearCart();
    onClose();
    setStep('cart');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer - bottom sheet style on mobile */}
      <div className="absolute inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto md:w-[420px] max-h-[92vh] md:max-h-full bg-background rounded-t-3xl md:rounded-none animate-slide-up flex flex-col shadow-float">

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <header className="flex items-center justify-between px-5 py-3 md:py-4">
          {step === 'checkout' ? (
            <button
              onClick={() => setStep('cart')}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold text-sm">Volver</span>
            </button>
          ) : (
            <h2 className="font-display font-bold text-lg text-foreground">
              Tu Pedido
            </h2>
          )}
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
          {step === 'cart' ? (
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
                    <CartItem
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
          ) : (
            <CheckoutForm
              customer={customer}
              setCustomer={setCustomer}
              errors={errors}
            />
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <footer className="px-5 pb-5 pt-3 bg-background border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground font-medium">Total</span>
              <span className="font-display font-extrabold text-xl text-primary">${total}</span>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full btn-primary-gradient text-base py-3.5 rounded-2xl"
              >
                Continuar al checkout →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-base transition-colors"
              >
                <Send className="w-4 h-4" />
                Enviar pedido por WhatsApp
              </button>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}

/* ── Cart Item Card ── */
function CartItem({ item, onUpdateQuantity, onRemove }: {
  item: any;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  const basePrice = item.selectedSize ? item.selectedSize.price : item.product.price;

  return (
    <div className="bg-card rounded-2xl p-4 border border-border/60">
      {/* Header: name + delete */}
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

      {/* Breakdown */}
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
        {item.selectedExtras.map((extra: any) => (
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

      {/* Quantity + subtotal */}
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

/* ── Checkout Form ── */
function CheckoutForm({ customer, setCustomer, errors }: {
  customer: CustomerInfo;
  setCustomer: (c: CustomerInfo) => void;
  errors: Partial<CustomerInfo>;
}) {
  const dwellingOptions: { value: CustomerInfo['dwellingType']; label: string; icon: string }[] = [
    { value: 'casa', label: 'Casa', icon: '🏠' },
    { value: 'departamento', label: 'Depto', icon: '🏢' },
    { value: 'edificio', label: 'Edificio', icon: '🏢' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-display font-bold text-base text-foreground">
        📍 Datos de Entrega
      </h3>

      <div className="space-y-3">
        <FormField label="Nombre completo" required error={errors.name}>
          <input
            type="text"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            placeholder="Tu nombre"
            className={`checkout-input text-sm ${errors.name ? 'border-destructive' : ''}`}
            maxLength={100}
          />
        </FormField>

        <FormField label="Teléfono" required error={errors.phone}>
          <input
            type="tel"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })}
            placeholder="10 dígitos (Para whatsApp)"
            className={`checkout-input text-sm ${errors.phone ? 'border-destructive' : ''}`}
            maxLength={10}
          />
        </FormField>

        {/* Opt-in Marketing WhatsApp */}
        <label className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl cursor-pointer hover:border-primary/40 transition-colors mt-1">
          <input
            type="checkbox"
            checked={customer.optInMarketing}
            onChange={(e) => setCustomer({ ...customer, optInMarketing: e.target.checked })}
            className="w-4 h-4 mt-0.5 accent-primary rounded"
          />
          <div>
            <span className="text-foreground text-sm font-semibold">Recibir promociones exclusivas 🌮</span>
            <p className="text-muted-foreground text-xs leading-tight mt-0.5">
              Me gustaría recibir mi confirmación de orden y promos especiales por WhatsApp.
            </p>
          </div>
        </label>

        {/* Tipo de vivienda */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Tipo de vivienda <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {dwellingOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCustomer({ ...customer, dwellingType: opt.value })}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-sm font-medium transition-all ${customer.dwellingType === opt.value
                  ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                  }`}
              >
                <span className="text-lg">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <FormField label="Calle" required error={errors.street}>
          <input
            type="text"
            value={customer.street}
            onChange={(e) => setCustomer({ ...customer, street: e.target.value })}
            placeholder="Ej. Av. Principal"
            className={`checkout-input text-sm ${errors.street ? 'border-destructive' : ''}`}
            maxLength={150}
          />
        </FormField>

        {/* Números exterior e interior */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="No. Exterior" required={customer.dwellingType === 'casa'} optional={customer.dwellingType !== 'casa'} error={errors.exteriorNumber}>
            <input
              type="text"
              value={customer.exteriorNumber}
              onChange={(e) => setCustomer({ ...customer, exteriorNumber: e.target.value })}
              placeholder="Ej. 123"
              className={`checkout-input text-sm ${errors.exteriorNumber ? 'border-destructive' : ''}`}
              maxLength={20}
            />
          </FormField>

          {(customer.dwellingType === 'departamento' || customer.dwellingType === 'edificio') && (
            <FormField label="No. Interior" optional>
              <input
                type="text"
                value={customer.interiorNumber}
                onChange={(e) => setCustomer({ ...customer, interiorNumber: e.target.value })}
                placeholder="Ej. 4-B"
                className="checkout-input text-sm"
                maxLength={20}
              />
            </FormField>
          )}
        </div>

        <FormField label="Colonia" required error={errors.neighborhood}>
          <input
            type="text"
            value={customer.neighborhood}
            onChange={(e) => setCustomer({ ...customer, neighborhood: e.target.value })}
            placeholder="Tu colonia"
            className={`checkout-input text-sm ${errors.neighborhood ? 'border-destructive' : ''}`}
            maxLength={100}
          />
        </FormField>

        {/* Zona residencial privada */}
        <div className="bg-card border border-border rounded-xl p-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={customer.gatedCommunity}
              onChange={(e) => setCustomer({ ...customer, gatedCommunity: e.target.checked, accessCode: e.target.checked ? customer.accessCode : '' })}
              className="w-4 h-4 accent-primary rounded"
            />
            <div>
              <span className="text-foreground text-sm font-medium">🔒 Zona residencial privada</span>
              <p className="text-muted-foreground text-xs mt-0.5">Activa si se necesita contraseña para entrar</p>
            </div>
          </label>

          {customer.gatedCommunity && (
            <div className="mt-3 animate-fade-in">
              <FormField label="Contraseña de acceso" required error={errors.accessCode}>
                <input
                  type="text"
                  value={customer.accessCode}
                  onChange={(e) => setCustomer({ ...customer, accessCode: e.target.value })}
                  placeholder="Ej. 1234 o clave del guardia"
                  className={`checkout-input text-sm ${errors.accessCode ? 'border-destructive' : ''}`}
                  maxLength={50}
                />
              </FormField>
            </div>
          )}
        </div>

        <FormField label="Referencias" optional>
          <textarea
            value={customer.references}
            onChange={(e) => setCustomer({ ...customer, references: e.target.value })}
            placeholder="Ej. Portón negro, frente al parque..."
            className="checkout-input text-sm min-h-[70px] resize-none"
            maxLength={200}
          />
        </FormField>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Método de Pago
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl cursor-pointer hover:border-primary/40 transition-colors">
              <input
                type="radio"
                name="payment"
                checked={customer.paymentMethod === 'efectivo'}
                onChange={() => setCustomer({ ...customer, paymentMethod: 'efectivo' })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-foreground text-sm font-medium">💵 Efectivo</span>
            </label>

            {customer.paymentMethod === 'efectivo' && (
              <div className="ml-7 animate-fade-in">
                <input
                  type="text"
                  value={customer.cashAmount}
                  onChange={(e) => setCustomer({ ...customer, cashAmount: e.target.value.replace(/\D/g, '') })}
                  placeholder="¿Con cuánto pagará? (opcional)"
                  className="checkout-input text-sm"
                />
              </div>
            )}

            <label className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl cursor-pointer hover:border-primary/40 transition-colors">
              <input
                type="radio"
                name="payment"
                checked={customer.paymentMethod === 'transferencia'}
                onChange={() => setCustomer({ ...customer, paymentMethod: 'transferencia', cashAmount: '' })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-foreground text-sm font-medium">💳 Transferencia</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Form Field wrapper ── */
function FormField({ label, required, optional, error, children }: {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
        {optional && <span className="text-muted-foreground/60 normal-case tracking-normal font-normal">(opcional)</span>}
      </label>
      {children}
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
}
