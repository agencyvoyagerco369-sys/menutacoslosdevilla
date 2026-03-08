-- Migración Completa para Taquería Los de Villa
-- Incluye: CRM (customers), Órdenes (orders, order_items), y Chat Center (messages)
-- Pega y ejecuta este script en el SQL Editor de tu Dashboard de Supabase.

-- ============================================================
-- 1. TABLA: customers (CRM - La alcancía de números de WhatsApp)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    total_spent DECIMAL(10, 2) DEFAULT 0.00,
    order_count INT DEFAULT 0,
    last_order_date TIMESTAMP WITH TIME ZONE,
    opt_in_marketing BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 2. TABLA: orders (Pedidos del POS y Online)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50) DEFAULT 'efectivo',
    payment_status VARCHAR(50) DEFAULT 'unpaid',
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_type VARCHAR(50) DEFAULT 'pickup',
    delivery_address JSONB,
    cashier_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 3. TABLA: order_items (Platillos de cada orden)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    selected_size VARCHAR(100),
    extras JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 4. TABLA: conversations (Hilos de chat con clientes)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    phone VARCHAR(20) NOT NULL,
    name VARCHAR(100) DEFAULT 'Desconocido',
    last_message_body TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unread_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 5. TABLA: messages (Cada mensaje individual de WhatsApp)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    direction VARCHAR(10) NOT NULL, -- 'inbound' o 'outbound'
    body TEXT NOT NULL,
    media_url TEXT,
    twilio_sid VARCHAR(100),
    status VARCHAR(20) DEFAULT 'sent', -- sent, delivered, read, failed
    sent_by VARCHAR(50), -- 'system', 'cashier', 'bot', o el email del admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 6. SEGURIDAD (RLS)
-- ============================================================
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para desarrollo rápido
CREATE POLICY "allow_all_customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_order_items" ON public.order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_conversations" ON public.conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 7. TRIGGERS (Auto-actualizar timestamps)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================
-- 8. REALTIME (Habilitar para actualizaciones en vivo)
-- ============================================================
-- IMPORTANTE: Habilita Realtime para estas tablas en el Dashboard de Supabase:
-- Ve a Database > Replication > y activa las tablas: orders, conversations, messages
