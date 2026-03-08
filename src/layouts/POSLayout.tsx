import { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function POSLayout() {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Top Navbar */}
            <header className="bg-primary text-primary-foreground h-14 px-4 flex items-center justify-between shadow-sm z-10 relative">
                <div className="flex items-center gap-4">
                    <h1 className="font-bold text-lg tracking-tight">Caja - Los de Villa</h1>
                    <span className="text-sm bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        Terminal Principal
                    </span>
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
