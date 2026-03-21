import logo from '@/assets/logo-los-de-villa.png';
import { MapPin, Clock, Phone, ExternalLink } from 'lucide-react';
import { BUSINESS_INFO, getBusinessStatus } from '@/utils/businessHours';

interface HeroSectionProps {
  onViewMenu: () => void;
}

export function HeroSection({ onViewMenu }: HeroSectionProps) {
  const { isOpen, message } = getBusinessStatus();

  const handleLocationClick = () => {
    window.open(BUSINESS_INFO.googleMapsUrl, '_blank');
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${BUSINESS_INFO.phone}`;
  };

  return (
    <header className="bg-card">
      {/* Status Bar - Keeping it as a global sticky/thin bar at the very top is best practice */}
      <div className={`px-4 py-2 ${isOpen ? 'bg-green-600' : 'bg-destructive'}`}>
        <div className="flex items-center justify-center gap-2 text-white text-[13px] font-semibold">
          <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-white animate-pulse' : 'bg-white/80'}`} />
          <span>{message}</span>
        </div>
      </div>

      {/* Cover Image Background (Hero) */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9', maxHeight: '320px' }}>
        <img 
          src="/images/hero-cover.png" 
          alt="Taquería Los de Villa" 
          className="w-full h-full object-cover object-top"
        />
        {/* Gradiente oscuro sutil para darle elegancia */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Main Header Content */}
      <div className="px-4 pb-4 relative">
        {/* Floating Logo */}
        <div className="-mt-12 mb-3 relative z-10">
          <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden shadow-elevated bg-card">
            <img
              src={logo}
              alt="Taquería Los de Villa - Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Title & Delivery Tag Header */}
        <div className="flex justify-between items-start mb-1">
          <div>
            <h1 className="font-display font-black text-[26px] text-foreground leading-tight tracking-tight">
              Taquería Los de Villa
            </h1>
            <h2 className="font-display font-bold text-sm text-primary mt-0.5 uppercase tracking-wider">
              Carne Asada y Tripa
            </h2>
          </div>
        </div>
          
        <div className="flex flex-wrap items-center gap-2 mt-2 mb-4">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-highlight/20 text-highlight-foreground px-2 py-1 rounded-full">
            ⭐ 4.9 (200+)
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-green-500/15 text-green-600 dark:text-green-500 px-2 py-1 rounded-full">
            🛵 Envío disponible
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <MapPin className="w-3 h-3" /> Cd. Obregón
          </span>
        </div>

        {/* Action Chips (Minimalist Row) */}
        <div className="flex flex-wrap gap-2">
          {/* Location */}
          <button
            onClick={handleLocationClick}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-muted/50 hover:bg-muted text-foreground rounded-xl text-[12px] font-semibold transition-colors border border-border/50"
          >
            <MapPin className="w-4 h-4 text-destructive" strokeWidth={2.5} />
            Ubicación
          </button>

          {/* Phone */}
          <button
            onClick={handlePhoneClick}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-muted/50 hover:bg-muted text-foreground rounded-xl text-[12px] font-semibold transition-colors border border-border/50"
          >
            <Phone className="w-4 h-4 text-secondary" strokeWidth={2.5} />
            Llamar
          </button>

          {/* Schedule */}
          <div className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-muted/50 text-foreground rounded-xl text-[12px] font-semibold border border-border/50">
            <Clock className={`w-4 h-4 ${isOpen ? 'text-green-600' : 'text-destructive'}`} strokeWidth={2.5} />
            <span className={isOpen ? 'text-green-600' : 'text-destructive'}>
              {isOpen ? 'Abierto' : 'Cerrado'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
