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
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`category-tab ${
              activeCategory === category.id
                ? 'category-tab-active'
                : 'category-tab-inactive'
            }`}
          >
            <span className="text-lg">{category.emoji}</span>
            <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
