import { MENU_PRODUCTS } from './menu';
import { Product } from '@/types/menu';

export interface UpsellRule {
    /** What triggers this rule */
    trigger: {
        /** Match by category */
        category?: string;
        /** Match by specific product IDs */
        productIds?: string[];
    };
    /** Product IDs to suggest */
    suggestedProductIds: string[];
    /** Badge label (e.g. "🔥 Popular", "💰 Ahorra") */
    badge?: string;
    /** Priority (higher = shown first) */
    priority: number;
}

export const UPSELL_RULES: UpsellRule[] = [
    // Tacos → Promo Taquera (upgrade!)
    {
        trigger: { productIds: ['tacos-harina', 'tacos-maiz', 'taco-dorado', 'taco-tripa'] },
        suggestedProductIds: ['promo-taquera', 'coca-cola-600'],
        badge: '💰 Mejor lleva la promo',
        priority: 10,
    },
    // Cualquier platillo → Bebidas
    {
        trigger: { category: 'platillos' },
        suggestedProductIds: ['coca-cola-600', 'agua-horchata', 'agua-jamaica'],
        badge: '🥤 Acompáñalo',
        priority: 5,
    },
    // Cualquier promoción → Coca-Cola + extras
    {
        trigger: { category: 'promociones' },
        suggestedProductIds: ['coca-cola-600', 'coca-cola-355'],
        badge: '🔥 Popular',
        priority: 7,
    },
    // Cualquier bebida → Una promo
    {
        trigger: { category: 'bebidas' },
        suggestedProductIds: ['promo-taquera', 'promo-chorreada'],
        badge: '🌮 ¿Con hambre?',
        priority: 6,
    },
];

/**
 * Given a product the user just added, return up to `maxSuggestions` upsell products.
 * Filters out the product itself and any products already in the cart.
 */
export function getUpsellSuggestions(
    addedProduct: Product,
    cartProductIds: string[],
    maxSuggestions: number = 3
): { product: Product; badge?: string }[] {
    // Collect all matching rules, sorted by priority descending
    const matchingRules = UPSELL_RULES
        .filter(rule => {
            if (rule.trigger.productIds?.includes(addedProduct.id)) return true;
            if (rule.trigger.category && addedProduct.category === rule.trigger.category) return true;
            return false;
        })
        .sort((a, b) => b.priority - a.priority);

    // Flatten suggested products, preserving badge from rule
    const seen = new Set<string>();
    const suggestions: { product: Product; badge?: string }[] = [];

    for (const rule of matchingRules) {
        for (const productId of rule.suggestedProductIds) {
            // Skip if already suggested, is the added product, or is already in cart
            if (seen.has(productId)) continue;
            if (productId === addedProduct.id) continue;
            if (cartProductIds.includes(productId)) continue;

            const product = MENU_PRODUCTS.find(p => p.id === productId);
            if (!product) continue;

            seen.add(productId);
            suggestions.push({ product, badge: rule.badge });

            if (suggestions.length >= maxSuggestions) return suggestions;
        }
    }

    return suggestions;
}
