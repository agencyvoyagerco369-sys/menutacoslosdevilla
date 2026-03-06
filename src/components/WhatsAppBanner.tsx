import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

export function WhatsAppBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="md:hidden mx-4 mt-4 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[hsl(142,70%,40%)] to-[hsl(142,60%,32%)] text-white p-4 shadow-lg">
      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        aria-label="Cerrar"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-sm leading-tight">
            Pide por WhatsApp 📲
          </h3>
          <p className="text-white/85 text-xs mt-1 leading-relaxed">
            Arma tu pedido de tacos, confirma y te enviamos directo al chat para que lo recibas en tu puerta.
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
        className="mt-3 w-full bg-white text-[hsl(142,70%,30%)] font-bold text-sm py-2.5 rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
      >
        <span>Ver menú y ordenar</span>
        <span>→</span>
      </button>
    </div>
  );
}
