import { CATEGORIES } from '@/types/menu';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <nav className="sticky top-0 z-40 bg-card border-b border-border">
      <div
        className="flex overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map((category) => {
          const isPromo = category.id === 'promociones';
          const isActive = activeCategory === category.id;

          let tabClasses = 'category-tab ';
          if (isPromo) {
            tabClasses += isActive
              ? 'bg-destructive text-destructive-foreground font-bold shadow-md rounded-xl mx-1 my-1 '
              : 'text-destructive font-bold hover:bg-destructive/10 rounded-xl mx-1 my-1 border border-destructive/20 ';
          } else {
            tabClasses += isActive ? 'category-tab-active' : 'category-tab-inactive';
          }

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={tabClasses}
            >
              <span className="text-lg">{category.emoji}</span>
              <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
