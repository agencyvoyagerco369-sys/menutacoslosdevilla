// Supabase Edge Function: receive-whatsapp (Webhook de Twilio)
// Deploy to: supabase functions deploy receive-whatsapp
// Configure the Twilio Sandbox Webhook URL to point to this function.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
    try {
        // Twilio sends webhooks as URL-encoded form data
        const formData = await req.formData();
        const from = formData.get("From") as string; // "whatsapp:+5216441234567"
        const body = formData.get("Body") as string;
        const messageSid = formData.get("MessageSid") as string;
        const profileName = formData.get("ProfileName") as string || "Cliente";

        if (!from || !body) {
            return new Response("Missing data", { status: 400 });
        }

        // Extract clean phone number (remove "whatsapp:" prefix)
        const cleanPhone = from.replace("whatsapp:", "").replace("+52", "").replace("+", "");

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // 1. Find or create conversation
        let { data: conversation } = await supabase
            .from("conversations")
            .select("*")
            .eq("phone", cleanPhone)
            .single();

        if (!conversation) {
            // New conversation! Create it
            const { data: newConvo } = await supabase
                .from("conversations")
                .insert({
                    phone: cleanPhone,
                    name: profileName,
                    last_message_body: body,
                    last_message_at: new Date().toISOString(),
                    unread_count: 1,
                    status: "open",
                })
                .select()
                .single();

            conversation = newConvo;

            // Also try to link to existing customer
            const { data: customer } = await supabase
                .from("customers")
                .select("id")
                .eq("phone", cleanPhone)
                .single();

            if (customer && conversation) {
                await supabase
                    .from("conversations")
                    .update({ customer_id: customer.id })
                    .eq("id", conversation.id);
            }
        } else {
            // Update existing conversation
            await supabase
                .from("conversations")
                .update({
                    last_message_body: body,
                    last_message_at: new Date().toISOString(),
                    unread_count: (conversation.unread_count || 0) + 1,
                })
                .eq("id", conversation.id);
        }

        // 2. Save the message
        if (conversation) {
            await supabase.from("messages").insert({
                conversation_id: conversation.id,
                direction: "inbound",
                body: body,
                twilio_sid: messageSid,
                sent_by: "customer",
                status: "received",
            });
        }

        // 3. Respond with empty TwiML (no auto-reply for now)
        return new Response(
            '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
            {
                status: 200,
                headers: { "Content-Type": "text/xml" },
            }
        );
    } catch (error) {
        console.error("Webhook error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
});
