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
    const paidExtras = item.selectedExtras.filter(e => e.id !== 'frijoles-promo');
    if (paidExtras.length > 0) {
      lines.push(`   Extras: ${paidExtras.map(e => e.name).join(', ')}`);
    }
    if (item.notes) lines.push(`   ${item.notes}`);
    lines.push(`   💲 $${item.subtotal}`);
    return lines.join('\n');
  }).join('\n\n');

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
 * Detecta si el dispositivo es móvil (iOS/Android)
 */
function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /android|iphone|ipad|ipod|webos|blackberry|opera mini|iemobile/i.test(
    navigator.userAgent
  );
}

/**
 * Abre WhatsApp con el mensaje pre-rellenado.
 * Funciona sin fricción en: iOS, Android, PC (Windows/Mac/Linux).
 * 
 * Estrategia:
 * - Móvil → usa intent:// en Android, wa.me en iOS → abre directo la app
 * - Desktop → wa.me abre WhatsApp Web o la app de escritorio
 * - Fallback → si window.open es bloqueado, redirige con location.href
 */
export function sendToWhatsApp(message: string): void {
  if (!message || message.trim().length === 0) {
    console.error('El mensaje no puede estar vacío');
    return;
  }

  const encodedMessage = encodeURIComponent(message);
  
  // wa.me es el estándar universal recomendado por WhatsApp
  // Funciona en iOS (abre app), Android (abre app), y Desktop (abre WhatsApp Web/Desktop)
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  // En móvil, usar location.href es más confiable que window.open
  // ya que evita bloqueos de popup y abre la app nativa directamente
  if (isMobileDevice()) {
    window.location.href = whatsappUrl;
    return;
  }

  // En desktop, window.open abre en nueva pestaña (WhatsApp Web o app de escritorio)
  const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  
  // Si el navegador bloqueó el popup, fallback a redirección directa
  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
    window.location.href = whatsappUrl;
  }
}
