import { CATEGORIES } from '@/types/menu';
import { Flame, UtensilsCrossed, GlassWater } from 'lucide-react';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  promociones: <Flame className="w-6 h-6" strokeWidth={1.8} />,
  platillos: <UtensilsCrossed className="w-6 h-6" strokeWidth={1.8} />,
  bebidas: <GlassWater className="w-6 h-6" strokeWidth={1.8} />,
};

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/50">
      <div className="px-3 py-3">
        <div
          className="flex gap-2 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            const isPromo = category.id === 'promociones';

            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  category-chip
                  ${isActive
                    ? isPromo
                      ? 'category-chip-promo-active'
                      : 'category-chip-active'
                    : isPromo
                      ? 'category-chip-promo'
                      : 'category-chip-inactive'
                  }
                `}
              >
                {/* Icon Container */}
                <div className={`
                  category-chip-icon
                  ${isActive
                    ? isPromo
                      ? 'bg-white/25'
                      : 'bg-white/20'
                    : isPromo
                      ? 'bg-destructive/12'
                      : 'bg-muted'
                  }
                `}>
                  <span className={`
                    ${isActive
                      ? 'text-white'
                      : isPromo
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }
                  `}>
                    {CATEGORY_ICONS[category.id] || <span className="text-lg">{category.emoji}</span>}
                  </span>
                </div>

                {/* Label */}
                <span className={`
                  text-[11px] font-semibold tracking-wide whitespace-nowrap leading-none
                  ${isActive
                    ? 'text-white'
                    : isPromo
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                  }
                `}>
                  {category.name}
                </span>

                {/* Promo badge pulse */}
                {isPromo && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full animate-ping" />
                )}
                {isPromo && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
