import { useRef, useEffect } from 'react';
import { CATEGORIES } from '@/types/menu';

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll active category into view
    const activeElement = scrollRef.current?.querySelector(`[data-category="${activeCategory}"]`);
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeCategory]);

  return (
    <nav className="category-nav py-3">
      <div 
        ref={scrollRef}
        className="flex gap-2 px-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            data-category={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`category-pill flex items-center gap-2 ${
              activeCategory === category.id
                ? 'category-pill-active'
                : 'category-pill-inactive'
            }`}
          >
            <span>{category.emoji}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
