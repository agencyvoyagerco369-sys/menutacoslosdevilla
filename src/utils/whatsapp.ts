import { CustomerInfo, CartItem } from '@/types/menu';

const WHATSAPP_NUMBER = '526442045477';

/**
 * Genera un mensaje de pedido pre-formateado para WhatsApp
 * con todos los detalles del carrito y datos de entrega
 */
export function generateWhatsAppMessage(
  items: CartItem[],
  total: number,
  customer: CustomerInfo
): string {
  const itemsList = items.map(item => {
    const lines: string[] = [];
    lines.push(`*${item.quantity}x ${item.product.name}*`);
    if (item.selectedSize) lines.push(`   Tamaño: ${item.selectedSize.name}`);
    if (item.selectedExtras.length > 0) {
      lines.push(`   Extras: ${item.selectedExtras.map(e => e.name).join(', ')}`);
    }
    if (item.notes) lines.push(`   Nota: ${item.notes}`);
    lines.push(`   💲 $${item.subtotal}`);
    return lines.join('\n');
  }).join('\n\n');

  // Build address line
  const dwellingLabels: Record<string, string> = {
    casa: 'Casa',
    departamento: 'Departamento',
    edificio: 'Edificio',
  };
  const dwellingLabel = dwellingLabels[customer.dwellingType] || 'Casa';
  const interiorLine = customer.interiorNumber ? `, Int. ${customer.interiorNumber}` : '';
  const addressLine = `${customer.street} #${customer.exteriorNumber}${interiorLine}, ${customer.neighborhood}`;

  const gatedLine = customer.gatedCommunity && customer.accessCode
    ? `\n🔒 *Acceso privado:* ${customer.accessCode}`
    : '';

  const referencesLine = customer.references ? `\n👀 *Ref:* ${customer.references}` : '';

  const paymentInfo = customer.paymentMethod === 'efectivo' && customer.cashAmount
    ? `\n💵 Pagaré con: $${customer.cashAmount}`
    : '';

  const message = `🌮 *NUEVO PEDIDO — LOS DE VILLA*
━━━━━━━━━━━━━━━━━

${itemsList}

━━━━━━━━━━━━━━━━━
✅ *TOTAL: $${total}*

📍 *ENTREGA*
👤 *Cliente:* ${customer.name}
📞 *Tel:* ${customer.phone}
🏠 *Tipo:* ${dwellingLabel}
🗺️ *Dirección:* ${addressLine}${gatedLine}${referencesLine}

💳 *Pago:* ${customer.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}${paymentInfo}`;

  return message;
}

/**
 * Abre WhatsApp con el mensaje pre-rellenado
 * Soporta iOS, Android y navegadores web sin fricción
 */
export function sendToWhatsApp(message: string): void {
  if (!message || message.trim().length === 0) {
    console.error('El mensaje no puede estar vacío');
    return;
  }

  // URL-encode el mensaje de manera segura para caracteres especiales
  const encodedMessage = encodeURIComponent(message);

  // Usar wa.me en lugar de api.whatsapp.com para máxima compatibilidad
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  try {
    // window.open abre en app de WhatsApp (móvil) o WhatsApp Web (desktop)
    // noreferrer y noopener previenen acceso al objeto window
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Error al abrir WhatsApp:', error);
    // Fallback: intenta con location.href si window.open falla
    window.location.href = whatsappUrl;
  }
}
