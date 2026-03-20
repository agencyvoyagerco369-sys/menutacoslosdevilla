import { Product } from '@/types/menu';
import { ProductCardSimple } from './ProductCardSimple';
import { CATEGORIES } from '@/types/menu';

interface CategorySectionProps {
  categoryId: string;
  products: Product[];
  onCustomize: (product: Product) => void;
}

export function CategorySection({ categoryId, products, onCustomize }: CategorySectionProps) {
  const category = CATEGORIES.find(c => c.id === categoryId);
  const categoryProducts = products.filter(p => p.category === categoryId);

  if (!category || categoryProducts.length === 0) return null;

  return (
    <section id={`category-${categoryId}`} className="px-4 py-4 pt-20 -mt-16">
      {/* Category Header */}
      <div className="mb-4">
        <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
          <span>{category.emoji}</span>
          <span>{category.name}</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {categoryProducts.length} platillo{categoryProducts.length > 1 ? 's' : ''} disponible{categoryProducts.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {categoryProducts.map((product) => (
          <ProductCardSimple 
            key={product.id} 
            product={product} 
            onCustomize={onCustomize}
          />
        ))}
      </div>
    </section>
  );
}
