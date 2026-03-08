import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Send, Search, ArrowLeft, User, ShoppingBag, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Conversation {
    id: string;
    phone: string;
    name: string;
    last_message_body: string;
    last_message_at: string;
    unread_count: number;
    status: string;
}

interface Message {
    id: string;
    conversation_id: string;
    direction: "inbound" | "outbound";
    body: string;
    sent_by: string;
    created_at: string;
    status: string;
}

export default function ChatCenter() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConvo, setActiveConvo] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load conversations
    useEffect(() => {
        loadConversations();

        // Subscribe to realtime updates on conversations
        const channel = (supabase as any)
            .channel("conversations-changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "conversations" },
                () => loadConversations()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Load messages when active conversation changes
    useEffect(() => {
        if (activeConvo) {
            loadMessages(activeConvo.id);
            markAsRead(activeConvo.id);

            // Subscribe to new messages in this convo
            const channel = (supabase as any)
                .channel(`messages-${activeConvo.id}`)
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "messages",
                        filter: `conversation_id=eq.${activeConvo.id}`,
                    },
                    (payload: any) => {
                        setMessages((prev) => [...prev, payload.new]);
                        scrollToBottom();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [activeConvo?.id]);

    // Auto-scroll on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const loadConversations = async () => {
        const { data, error } = await (supabase as any)
            .from("conversations")
            .select("*")
            .order("last_message_at", { ascending: false });

        if (data) setConversations(data);
        setLoading(false);
    };

    const loadMessages = async (convoId: string) => {
        const { data } = await (supabase as any)
            .from("messages")
            .select("*")
            .eq("conversation_id", convoId)
            .order("created_at", { ascending: true });

        if (data) setMessages(data);
    };

    const markAsRead = async (convoId: string) => {
        await (supabase as any)
            .from("conversations")
            .update({ unread_count: 0 })
            .eq("id", convoId);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeConvo || sending) return;

        setSending(true);
        const messageBody = newMessage.trim();
        setNewMessage("");

        try {
            // 1. Save outbound message to DB
            await (supabase as any).from("messages").insert({
                conversation_id: activeConvo.id,
                direction: "outbound",
                body: messageBody,
                sent_by: "cashier",
                status: "pending",
            });

            // 2. Call Edge Function to send via Twilio
            const { error } = await supabase.functions.invoke("send-whatsapp", {
                body: { to: activeConvo.phone, message: messageBody },
            });

            if (error) {
                toast.error("Error al enviar mensaje");
                console.error(error);
            } else {
                toast.success("Mensaje enviado");
            }

            // 3. Update conversation's last message
            await (supabase as any)
                .from("conversations")
                .update({
                    last_message_body: messageBody,
                    last_message_at: new Date().toISOString(),
                })
                .eq("id", activeConvo.id);
        } catch (err) {
            toast.error("Error de conexión");
        } finally {
            setSending(false);
        }
    };

    const filteredConversations = conversations.filter(
        (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery)
    );

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        if (isToday) {
            return date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
        }
        return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
    };

    return (
        <div className="flex h-full bg-slate-100">
            {/* Left: Conversations List */}
            <div
                className={`w-full md:w-96 flex flex-col bg-white border-r ${activeConvo ? "hidden md:flex" : "flex"
                    }`}
            >
                {/* Search Header */}
                <div className="p-4 border-b">
                    <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                        Mensajes WhatsApp
                    </h2>
                    <div className="relative">
                        <Input
                            placeholder="Buscar contacto..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-slate-50"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-40 text-slate-400">
                            Cargando conversaciones...
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-400 px-6 text-center">
                            <MessageCircle className="w-10 h-10 mb-2 opacity-30" />
                            <p className="text-sm">No hay conversaciones aún.</p>
                            <p className="text-xs mt-1">
                                Cuando un cliente te escriba por WhatsApp, aparecerá aquí.
                            </p>
                        </div>
                    ) : (
                        filteredConversations.map((convo) => (
                            <button
                                key={convo.id}
                                onClick={() => setActiveConvo(convo)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left ${activeConvo?.id === convo.id ? "bg-green-50 border-l-4 border-l-green-500" : ""
                                    }`}
                            >
                                {/* Avatar */}
                                <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-green-700" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-sm text-slate-900 truncate">
                                            {convo.name}
                                        </h4>
                                        <span className="text-[11px] text-slate-400 flex-shrink-0">
                                            {convo.last_message_at && formatTime(convo.last_message_at)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-0.5">
                                        <p className="text-xs text-slate-500 truncate pr-2">
                                            {convo.last_message_body || "Sin mensajes"}
                                        </p>
                                        {convo.unread_count > 0 && (
                                            <span className="w-5 h-5 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                                {convo.unread_count}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Right: Chat Window */}
            <div
                className={`flex-1 flex flex-col ${!activeConvo ? "hidden md:flex" : "flex"
                    }`}
            >
                {activeConvo ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white px-4 py-3 border-b flex items-center gap-3 shadow-sm">
                            <button
                                onClick={() => setActiveConvo(null)}
                                className="md:hidden p-1 hover:bg-slate-100 rounded-lg"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <User className="w-5 h-5 text-green-700" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-sm">{activeConvo.name}</h3>
                                <p className="text-xs text-slate-500">{activeConvo.phone}</p>
                            </div>
                            {/* Future: Customer context panel */}
                            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
                                <ShoppingBag className="w-4 h-4" />
                                <span>Panel de cliente (próximamente)</span>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f1f5f9' fill-opacity='0.8'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}>
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <MessageCircle className="w-16 h-16 mb-3 opacity-20" />
                                    <p>Aún no hay mensajes en esta conversación</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm ${msg.direction === "outbound"
                                                    ? "bg-green-500 text-white rounded-br-md"
                                                    : "bg-white text-slate-900 rounded-bl-md border"
                                                }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                                            <div
                                                className={`flex items-center gap-1 mt-1 ${msg.direction === "outbound" ? "justify-end" : "justify-start"
                                                    }`}
                                            >
                                                <Clock className="w-3 h-3 opacity-50" />
                                                <span className={`text-[10px] ${msg.direction === "outbound" ? "text-white/70" : "text-slate-400"}`}>
                                                    {formatTime(msg.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-3 bg-white border-t">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="flex items-center gap-2"
                            >
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1 h-12 rounded-xl bg-slate-50"
                                    disabled={sending}
                                />
                                <Button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="h-12 w-12 rounded-xl bg-green-500 hover:bg-green-600 text-white p-0"
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-4">
                            <MessageCircle className="w-12 h-12 text-green-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-500 mb-1">Chat Center</h3>
                        <p className="text-sm">Selecciona una conversación para empezar a chatear</p>
                    </div>
                )}
            </div>
        </div>
    );
}
