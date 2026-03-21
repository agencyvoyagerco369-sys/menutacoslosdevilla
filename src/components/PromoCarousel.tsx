import { useState } from 'react';

// Carrusel enfocado en destacar la calidad del menú cuando no hay descuentos explícitos
const HIGHLIGHT_BANNERS = [
  {
    id: 1,
    image: '/images/tacos_asada_guacamole.png',
    title: 'Nuestros Auténticos Tacos',
    subtitle: 'La especialidad de la casa a las brasas',
  },
  {
    id: 2,
    image: '/images/quesadilla_gringa.png',
    title: 'Gringas y Quesadillas',
    subtitle: 'Con abundante queso fundido',
  },
  {
    id: 3,
    image: '/images/chorreadas_especialidad.png',
    title: 'Chorreadas',
    subtitle: 'Gordita de masa con asiento, queso fundido y carne asada',
  },
  {
    id: 4,
    image: '/images/carne_asada_picada.png',
    title: 'Carne Asada Picada',
    subtitle: 'Jugosos trozos de carne asada a las brasas',
  }
];

export function PromoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const itemWidth = container.offsetWidth;
    const newIndex = Math.round(scrollPosition / itemWidth);
    setActiveIndex(newIndex);
  };

  return (
    <section className="py-4 bg-background">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="font-display font-bold text-lg text-foreground">
          ⭐ Especialidades de la Casa
        </h2>
      </div>

      <div 
        className="flex overflow-x-auto gap-4 px-4 pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={handleScroll}
      >
        {HIGHLIGHT_BANNERS.map((banner) => (
          <div 
            key={banner.id} 
            className="relative flex-none w-[85%] md:w-[60%] aspect-[21/9] rounded-2xl overflow-hidden shadow-card snap-center transition-transform active:scale-[0.98]"
          >
            <img 
              src={banner.image} 
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay so the white text reads clearly */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-white font-bold text-[15px] leading-tight drop-shadow-md">
                {banner.title}
              </h3>
              <p className="text-white/90 text-[11px] font-medium mt-0.5 drop-shadow-md text-balance">
                {banner.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mt-2">
        {HIGHLIGHT_BANNERS.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === idx ? 'w-4 bg-primary' : 'w-1.5 bg-muted-foreground/30'
            }`} 
          />
        ))}
      </div>
    </section>
  );
}
