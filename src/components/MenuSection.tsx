import { Product } from '@/types/menu';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '@/types/menu';

interface MenuSectionProps {
  products: Product[];
  activeCategoryRef: (id: string) => (el: HTMLElement | null) => void;
}

export function MenuSection({ products, activeCategoryRef }: MenuSectionProps) {
  const groupedProducts = CATEGORIES.map(category => ({
    ...category,
    products: products.filter(p => p.category === category.id),
  })).filter(group => group.products.length > 0);

  return (
    <main className="pb-24">
      {groupedProducts.map((group) => (
        <section
          key={group.id}
          ref={activeCategoryRef(group.id)}
          id={`category-${group.id}`}
          className="scroll-mt-16 py-6"
        >
          {/* Category Header */}
          <div className="px-4 mb-4">
            <h2 className="font-display font-bold text-2xl text-foreground flex items-center gap-2">
              <span>{group.emoji}</span>
              <span>{group.name}</span>
            </h2>
          </div>

          {/* Products Grid */}
          <div className="px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {group.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
