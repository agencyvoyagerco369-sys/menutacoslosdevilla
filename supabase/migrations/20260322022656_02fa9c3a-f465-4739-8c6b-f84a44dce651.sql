
CREATE TABLE public.whatsapp_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT,
    order_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    order_details JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'received',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.whatsapp_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_anon_insert_whatsapp_orders" ON public.whatsapp_orders
FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_authenticated_select_whatsapp_orders" ON public.whatsapp_orders
FOR SELECT TO authenticated USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_orders;
