import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, Store } from "lucide-react";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Si ya tiene sesión, mandarlo directo al POS
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) navigate("/admin/pos");
        });
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error("Credenciales incorrectas");
                console.error(error);
            } else {
                toast.success("¡Bienvenido al sistema!");
                navigate("/admin/pos");
            }
        } catch (err) {
            toast.error("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
                <div className="bg-primary p-6 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Store className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Punto de Venta</h1>
                    <p className="text-primary-foreground/80 text-sm">Taquería Los de Villa</p>
                </div>

                <form onSubmit={handleLogin} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Usuario Cajero
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="caja1@losdevilla.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                PIN / Contraseña
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-12 pl-10"
                                />
                                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 text-base font-bold rounded-xl"
                        disabled={loading}
                    >
                        {loading ? "Entrando..." : "Abrir Turno"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
