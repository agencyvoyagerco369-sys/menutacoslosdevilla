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
      <div className={`px-4 py-2 ${isOpen ? 'bg-secondary' : 'bg-destructive'}`}>
        <div className="flex items-center justify-center gap-2 text-white text-[13px] font-semibold">
          <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-white animate-pulse' : 'bg-white/80'}`} />
          <span>{message}</span>
        </div>
      </div>

      {/* Cover Image Background (Hero) */}
      <div className="relative h-32 sm:h-40 w-full overflow-hidden">
        {/* Usando una imagen muy apetitosa de carne asada estilo parrilla como fondo */}
        <img 
          src="/images/hero-cover.png" 
          alt="Taquería Los de Villa" 
          className="w-full h-full object-cover object-[center_25%]"
        />
        {/* Gradiente oscuro sutil para darle elegancia */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Main Header Content */}
      <div className="px-4 pb-5 relative">
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

        {/* Title & Info (Hierarchy fixed: Brand big, subtitle small) */}
        <div className="mb-5">
          <h1 className="font-display font-black text-[26px] text-foreground leading-tight tracking-tight">
            Taquería Los de Villa
          </h1>
          <h2 className="font-display font-bold text-sm text-primary mt-1 uppercase tracking-wider">
            Carne Asada y Tripa
          </h2>
          
          <div className="flex items-center gap-2 mt-2.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-highlight/20 text-highlight-foreground px-2 py-1 rounded-full">
              ⭐ 4.9 (200+ calif.)
            </span>
            <span className="text-[12px] font-medium text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Cd. Obregón, Son.
            </span>
          </div>
        </div>

        {/* Business Info Cards */}
        <div className="flex gap-2.5 mb-4">
          {/* Location */}
          <button
            onClick={handleLocationClick}
            className="group flex-1 flex flex-col items-center gap-2 bg-muted/60 rounded-2xl px-2 py-4 hover:bg-muted transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-2xl bg-destructive/15 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6 text-destructive" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-semibold text-foreground text-center leading-tight">Ver en Google Maps</span>
              <ExternalLink className="w-3 h-3 text-primary flex-shrink-0" />
            </div>
          </button>

          {/* Phone */}
          <button
            onClick={handlePhoneClick}
            className="group flex-1 flex flex-col items-center gap-2 bg-muted/60 rounded-2xl px-2 py-4 hover:bg-muted transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Phone className="w-6 h-6 text-secondary" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-semibold text-foreground text-center leading-tight">Llamar a la taquería</span>
          </button>

          {/* Schedule */}
          <div className="flex-1 flex flex-col items-center gap-2 bg-muted/60 rounded-2xl px-2 py-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" strokeWidth={2} />
            </div>
            <div className="text-center flex flex-col items-center justify-center">
              <span className={`text-[11px] font-bold ${isOpen ? 'text-secondary' : 'text-destructive'}`}>
                {isOpen ? 'Abierto' : 'Cerrado'}
              </span>
              <span className="text-[9px] font-semibold text-foreground text-center leading-tight mt-0.5">
                6pm - 12am<br/>
                <span className="opacity-80">Vie-Sáb 1am</span>
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Tag */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/20 text-foreground text-sm font-bold">
            <span className="text-base">🚗</span>
            Servicio a domicilio
          </span>
        </div>
      </div>
    </header>
  );
}
