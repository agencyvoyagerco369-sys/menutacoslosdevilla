import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  Calendar, 
  Search, 
  Download,
  Filter,
  ChevronRight,
  MapPin,
  Phone,
  User,
  LayoutDashboard
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  order_total: number;
  order_details: any[];
  status: string;
}

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();

    // Suscribirse a cambios en tiempo real
    const channel = (supabase as any)
      .channel('whatsapp-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'whatsapp_orders'
        },
        (payload: any) => {
          setOrders((current) => [payload.new as Order, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('whatsapp_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('not found')) {
            console.warn('La tabla whatsapp_orders no existe aún en Supabase.');
        } else {
            throw error;
        }
      }
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    (order.customer_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (order.customer_phone || "").includes(searchTerm) ||
    (order.customer_address?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.order_total) || 0), 0);
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map(o => o.customer_phone)).size;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <LayoutDashboard className="text-primary-foreground w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard de Pedidos</h1>
            <p className="text-slate-500 text-sm">Monitorea los clics y base de datos de clientes WhatsApp.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-white">
            <Download className="w-4 h-4" /> Exportar
          </Button>
          <Button size="sm" className="gap-2 bg-slate-900 hover:bg-slate-800">
            <Filter className="w-4 h-4" /> Filtros
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Clics (WhatsApp)</CardTitle>
            <div className="p-2 bg-green-50 rounded-lg">
                <ShoppingBag className="w-4 h-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalOrders}</div>
            <p className="text-[10px] text-green-600 font-medium mt-1 flex items-center gap-1">
                +100% <span className="text-slate-400">Desde activación</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Venta Potencial</CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
                <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</div>
            <p className="text-[10px] text-slate-400 mt-1">Ticket promedio: ${(totalRevenue / (totalOrders || 1)).toFixed(0)}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Base de Datos</CardTitle>
            <div className="p-2 bg-orange-50 rounded-lg">
                <Users className="w-4 h-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{uniqueCustomers}</div>
            <p className="text-[10px] text-slate-400 mt-1 text-nowrap">Clientes con teléfono registrado</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-white border-none shadow-lg shadow-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tracking</CardTitle>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-none hover:bg-green-500/20">En Vivo</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Activo</div>
            <p className="text-[10px] text-slate-500 mt-1">Sincronizado con Supabase</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Table */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar cliente, tel o dirección..." 
              className="pl-9 bg-slate-50 border-none h-11 focus-visible:ring-1 focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-slate-100 px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {filteredOrders.length} Registros encontrados
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none">
                    <TableHead className="w-[180px] text-xs font-bold text-slate-400 text-center">FECHA / HORA</TableHead>
                    <TableHead className="text-xs font-bold text-slate-400">CLIENTE</TableHead>
                    <TableHead className="text-xs font-bold text-slate-400">DIRECCIÓN DE ENTREGA</TableHead>
                    <TableHead className="text-right text-xs font-bold text-slate-400">TOTAL</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {loading ? (
                    <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <span className="text-xs font-medium">Buscando base de datos...</span>
                        </div>
                    </TableCell>
                    </TableRow>
                ) : filteredOrders.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center">
                        <div className="flex flex-col items-center gap-2 max-w-xs mx-auto">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-2">
                                <Search className="w-6 h-6 text-slate-300" />
                            </div>
                            <span className="text-sm font-bold text-slate-900">Sin datos que mostrar</span>
                            <span className="text-xs text-slate-500">Aún no se han registrado clics en el botón de WhatsApp o la tabla no existe en Supabase.</span>
                        </div>
                    </TableCell>
                    </TableRow>
                ) : (
                    filteredOrders.map((order) => (
                    <TableRow key={order.id} className="group hover:bg-slate-50/80 transition-colors border-b border-slate-50 cursor-pointer">
                        <TableCell>
                        <div className="flex flex-col items-center gap-0.5">
                            <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                            {new Date(order.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }).toUpperCase()}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                            <Calendar className="w-2.5 h-2.5" />
                            {new Date(order.created_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        </TableCell>
                        <TableCell>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                            {order.customer_name}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold mt-0.5">
                            <Phone className="w-3 h-3" />
                            {order.customer_phone}
                            </div>
                        </div>
                        </TableCell>
                        <TableCell>
                        <div className="flex items-start gap-2 max-w-[320px]">
                            <MapPin className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-slate-600 font-medium leading-relaxed">
                            {order.customer_address}
                            </span>
                        </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex flex-col items-end">
                                <span className="font-black text-slate-900 text-sm">${Number(order.order_total).toLocaleString()}</span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Cobrado</span>
                            </div>
                        </TableCell>
                        <TableCell>
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                        </div>
                        </TableCell>
                    </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Table Creation Help (Hidden by default, shown if no table) */}
      {!loading && orders.length === 0 && (
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <p className="text-xs text-orange-800 flex items-center gap-2 font-medium">
                  💡 <strong>Tip para el dueño:</strong> Si ves la tabla vacía después de probar, asegúrate de ejecutar el SQL en el editor de Supabase para crear la tabla "whatsapp_orders".
              </p>
          </div>
      )}
    </div>
  );
}
