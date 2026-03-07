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
    /** Product IDs to suggest. Use '*category:xxx' to include all products from a category */
    suggestedProductIds: string[];
    /** Badge label (e.g. "🔥 Popular", "💰 Ahorra") */
    badge?: string;
    /** Priority (higher = shown first) */
    priority: number;
}

// Helper: get all product IDs from a category
function getProductIdsByCategory(category: string): string[] {
    return MENU_PRODUCTS.filter(p => p.category === category).map(p => p.id);
}

export const UPSELL_RULES: UpsellRule[] = [
    // Tacos → Promo Taquera first, then ALL beverages
    {
        trigger: { productIds: ['tacos-harina', 'tacos-maiz', 'taco-dorado', 'taco-tripa'] },
        suggestedProductIds: ['promo-taquera'],
        badge: '💰 Mejor lleva la promo',
        priority: 10,
    },
    // Cualquier platillo → ALL beverages
    {
        trigger: { category: 'platillos' },
        suggestedProductIds: ['*category:bebidas'],
        badge: '🥤 Acompáñalo',
        priority: 5,
    },
    // Cualquier promoción → ALL beverages
    {
        trigger: { category: 'promociones' },
        suggestedProductIds: ['*category:bebidas'],
        badge: '🔥 Popular',
        priority: 7,
    },
    // Cualquier bebida → Promos + platillos populares
    {
        trigger: { category: 'bebidas' },
        suggestedProductIds: ['promo-taquera', 'promo-chorreada', 'promo-torito', 'promo-quesadilla', 'tacos-harina', 'gringas', 'taco-macho'],
        badge: '🌮 ¿Con hambre?',
        priority: 6,
    },
];

/**
 * Resolve a suggestion ID - handles '*category:xxx' wildcards
 */
function resolveSuggestionIds(ids: string[]): string[] {
    const resolved: string[] = [];
    for (const id of ids) {
        if (id.startsWith('*category:')) {
            const category = id.replace('*category:', '');
            resolved.push(...getProductIdsByCategory(category));
        } else {
            resolved.push(id);
        }
    }
    return resolved;
}

/**
 * Given a product the user just added, return upsell products.
 * No max limit - show ALL relevant suggestions to maximize ticket.
 * Filters out the product itself and any products already in the cart.
 */
export function getUpsellSuggestions(
    addedProduct: Product,
    cartProductIds: string[],
    maxSuggestions: number = 20
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
        const resolvedIds = resolveSuggestionIds(rule.suggestedProductIds);
        for (const productId of resolvedIds) {
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
