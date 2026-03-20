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
      {/* Status Bar */}
      <div className={`px-4 py-2.5 ${isOpen ? 'bg-secondary' : 'bg-destructive'}`}>
        <div className="flex items-center justify-center gap-2 text-white text-sm font-semibold">
          <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-white animate-pulse' : 'bg-white/80'}`} />
          <span>{message}</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 py-5">
        {/* Logo & Info */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-elevated flex-shrink-0">
            <img
              src={logo}
              alt="Taquería Los de Villa - Carne Asada y Tripa"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-base text-foreground leading-tight">
              Carne Asada y Tripa
            </h1>
            <h2 className="font-display font-bold text-lg text-primary">
              "Los de Villa"
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-highlight/20 text-highlight-foreground px-2 py-0.5 rounded-full">
                ⭐ 4.9
              </span>
              <span className="text-xs text-muted-foreground">
                Cd. Obregón, Son.
              </span>
            </div>
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
