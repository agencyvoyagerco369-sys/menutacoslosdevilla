import { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, LayoutDashboard, ShoppingBag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function POSLayout() {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/admin/login");
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando Sistema...</div>;
    }

    if (!session) {
        return <Navigate to="/admin/login" replace />;
    }

    const navItems = [
        { path: "/admin/pos", label: "Caja", icon: ShoppingBag },
        { path: "/admin/mensajes", label: "Mensajes", icon: MessageCircle },
        { path: "/admin/dashboard", label: "Métricas WA", icon: LayoutDashboard },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Top Navbar */}
            <header className="bg-slate-900 text-white h-16 px-6 flex items-center justify-between shadow-lg z-20 sticky top-0">
                <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                        <h1 className="font-black text-xl tracking-tighter text-white">LOS DE VILLA</h1>
                        <span className="text-[10px] font-bold text-primary tracking-[0.2em] -mt-1 uppercase">Admin Panel</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                        isActive 
                                        ? "bg-primary text-primary-foreground shadow-md" 
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium leading-none">{session.user.email}</p>
                        <p className="text-xs text-primary-foreground/70">Cajero en turno</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="hover:bg-black/20 text-white rounded-full"
                        title="Cerrar turno"
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden relative">
                <Outlet />
            </main>
        </div>
    );
}
