import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  quantity: number;
  productName: string;
  sizeName?: string;
  extras: string[];
  notes?: string;
  subtotal: number;
}

interface OrderPayload {
  items: OrderItem[];
  total: number;
  customer: {
    name: string;
    phone: string;
    dwellingType: string;
    street: string;
    exteriorNumber: string;
    interiorNumber?: string;
    neighborhood: string;
    gatedCommunity: boolean;
    accessCode?: string;
    references?: string;
    paymentMethod: string;
    cashAmount?: string;
  };
}

function buildEmailHtml(order: OrderPayload): string {
  const dwellingLabels: Record<string, string> = {
    casa: 'Casa',
    departamento: 'Departamento',
    edificio: 'Edificio',
  };
  const dwellingLabel = dwellingLabels[order.customer.dwellingType] || 'Casa';
  const interiorLine = order.customer.interiorNumber ? `, Int. ${order.customer.interiorNumber}` : '';
  const addressLine = `${order.customer.street} #${order.customer.exteriorNumber}${interiorLine}, ${order.customer.neighborhood}`;

  const itemsHtml = order.items.map(item => {
    let html = `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;">
        <strong>${item.quantity}× ${item.productName}</strong>`;
    if (item.sizeName) html += `<br><span style="color:#666;">Tamaño: ${item.sizeName}</span>`;
    if (item.extras.length > 0) html += `<br><span style="color:#666;">Extras: ${item.extras.join(', ')}</span>`;
    if (item.notes) html += `<br><span style="color:#888;font-style:italic;">📝 ${item.notes}</span>`;
    html += `</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;font-size:14px;font-weight:600;">$${item.subtotal}</td>
    </tr>`;
    return html;
  }).join('');

  const gatedLine = order.customer.gatedCommunity && order.customer.accessCode
    ? `<tr><td style="padding:4px 0;color:#555;">🔒 Acceso privado</td><td style="padding:4px 0;color:#333;font-weight:500;">${order.customer.accessCode}</td></tr>`
    : '';

  const referencesLine = order.customer.references
    ? `<tr><td style="padding:4px 0;color:#555;">👀 Referencias</td><td style="padding:4px 0;color:#333;font-weight:500;">${order.customer.references}</td></tr>`
    : '';

  const paymentInfo = order.customer.paymentMethod === 'efectivo'
    ? `Efectivo${order.customer.cashAmount ? ` (paga con $${order.customer.cashAmount})` : ''}`
    : 'Transferencia';

  return `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">
    <div style="background:#1a1a2e;padding:20px 24px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:20px;">🦐 Nuevo Pedido — El Yaqui</h1>
    </div>
    
    <div style="padding:20px 24px;">
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr style="background:#f8f8f8;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;color:#888;letter-spacing:0.5px;">Producto</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase;color:#888;letter-spacing:0.5px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="background:#f0fdf4;border-radius:8px;padding:12px 16px;text-align:right;margin-bottom:20px;">
        <span style="font-size:18px;font-weight:700;color:#16a34a;">✅ Total: $${order.total}</span>
      </div>

      <h3 style="margin:0 0 12px;font-size:14px;color:#1a1a2e;text-transform:uppercase;letter-spacing:0.5px;">📍 Datos de Entrega</h3>
      <table style="width:100%;font-size:14px;border-collapse:collapse;">
        <tr><td style="padding:4px 0;color:#555;width:140px;">👤 Cliente</td><td style="padding:4px 0;color:#333;font-weight:500;">${order.customer.name}</td></tr>
        <tr><td style="padding:4px 0;color:#555;">📞 Teléfono</td><td style="padding:4px 0;color:#333;font-weight:500;">${order.customer.phone}</td></tr>
        <tr><td style="padding:4px 0;color:#555;">🏠 Tipo</td><td style="padding:4px 0;color:#333;font-weight:500;">${dwellingLabel}</td></tr>
        <tr><td style="padding:4px 0;color:#555;">🗺️ Dirección</td><td style="padding:4px 0;color:#333;font-weight:500;">${addressLine}</td></tr>
        ${gatedLine}
        ${referencesLine}
        <tr><td style="padding:4px 0;color:#555;">💳 Pago</td><td style="padding:4px 0;color:#333;font-weight:500;">${paymentInfo}</td></tr>
      </table>
    </div>

    <div style="background:#f8f8f8;padding:12px 24px;text-align:center;font-size:12px;color:#999;">
      Pedido recibido automáticamente desde la app El Yaqui
    </div>
  </div>`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const order: OrderPayload = await req.json();
    const emailHtml = buildEmailHtml(order);

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'El Yaqui Pedidos <onboarding@resend.dev>',
        to: ['mariscosycahuamantaselyaqui@gmail.com'],
        subject: `🦐 Nuevo Pedido — ${order.customer.name} — $${order.total}`,
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error('Resend API error:', resendData);
      throw new Error(`Resend API error [${resendRes.status}]: ${JSON.stringify(resendData)}`);
    }

    return new Response(JSON.stringify({ success: true, id: resendData.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
