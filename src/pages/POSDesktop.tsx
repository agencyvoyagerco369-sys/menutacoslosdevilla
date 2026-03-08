import { useState } from "react";
import { MENU_PRODUCTS } from "@/data/menu";
import { Product, CATEGORIES } from "@/types/menu";
import { Search, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PosCartItem {
    product: Product;
    quantity: number;
}

export default function POSDesktop() {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[1].id); // Default to platillos
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState<PosCartItem[]>([]);
    const [customerName, setCustomerName] = useState("");

    const filteredProducts = MENU_PRODUCTS.filter(p => {
        if (searchQuery) return p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return p.category === activeCategory;
    });

    const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const clearCart = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("¿Limpiar orden actual?")) {
            setCart([]);
            setCustomerName("");
        }
    };

    const handleCharge = async (method: "cash" | "card") => {
        if (cart.length === 0) return;
        if (!customerName) {
            alert("Ingresa un nombre para la orden");
            return;
        }

        if (method === "card") {
            alert("En el futuro esto mandará la orden a la terminal de Mercado Pago.");
        } else {
            alert("Orden en efectivo registrada. Enviando a cocina...");
            // Todo: Save to database Supabase
            setCart([]);
            setCustomerName("");
        }
    };

    return (
        <div className="flex h-full bg-slate-100">
            {/* Left side: Menu / Products (70%) */}
            <div className="flex-1 flex flex-col h-full bg-white border-r">
                {/* Top Controls */}
                <div className="px-6 py-4 border-b flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => { setActiveCategory(cat.id); setSearchQuery(""); }}
                                className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeCategory === cat.id && !searchQuery
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                <span className="mr-2">{cat.emoji}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-64 flex-shrink-0">
                        <Input
                            placeholder="Buscar platillo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 bg-slate-100 border-transparent focus:bg-white"
                        />
                        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="bg-white border rounded-2xl p-4 text-left hover:border-blue-500 hover:shadow-md transition-all active:scale-95 flex flex-col"
                            >
                                <div className="w-full h-32 bg-slate-100 rounded-xl mb-3 overflow-hidden">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-tight flex-1">
                                    {product.name}
                                </h3>
                                <p className="font-bold text-blue-600 mt-2">${product.price}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>


            {/* Right side: Current Order (30%) */}
            <div className="w-96 flex flex-col bg-slate-50 relative">
                {/* Order Header */}
                <div className="p-4 border-b bg-white">
                    <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-slate-500" />
                        Nueva Orden
                    </h2>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                            Nombre o Mesa
                        </label>
                        <Input
                            placeholder="Ej. Mesa 4 / Para llevar Juan"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="font-semibold text-base"
                        />
                    </div>
                </div>

                {/* Order Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <ShoppingBag className="w-12 h-12 mb-3 opacity-20" />
                            <p>La orden está vacía</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.product.id} className="bg-white p-3 rounded-xl border flex gap-3 shadow-sm">
                                <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={item.product.image} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                    <h4 className="font-semibold text-sm leading-tight text-slate-900 truncate">
                                        {item.product.name}
                                    </h4>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="font-bold text-blue-600">${item.product.price}</span>
                                        <div className="flex items-center bg-slate-100 rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, -1)}
                                                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-6 text-center font-bold text-sm">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, 1)}
                                                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Totals & Charge */}
                <div className="p-4 bg-white border-t space-y-4">
                    <div className="flex items-end justify-between">
                        <div className="text-slate-500">
                            <span className="block text-sm">Total ({cartItemCount} items)</span>
                        </div>
                        <span className="text-3xl font-black tracking-tight text-slate-900">
                            ${cartTotal.toFixed(2)}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            className="h-14 text-base font-bold bg-slate-900 hover:bg-slate-800"
                            disabled={cart.length === 0}
                            onClick={() => handleCharge("cash")}
                        >
                            💵 Pago Efectivo
                        </Button>
                        <Button
                            className="h-14 text-base font-bold bg-[#009EE3] hover:bg-[#0089C5] text-white"
                            disabled={cart.length === 0}
                            onClick={() => handleCharge("card")}
                        >
                            💳 Terminal MP
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                        disabled={cart.length === 0}
                        onClick={clearCart}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Limpiar Orden
                    </Button>
                </div>
            </div>
        </div>
    );
}
