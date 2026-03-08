// Supabase Edge Function: send-whatsapp
// Deploy to: supabase functions deploy send-whatsapp
// This function sends a WhatsApp message via Twilio API

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID")!;
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN")!;
const TWILIO_WHATSAPP_FROM = Deno.env.get("TWILIO_WHATSAPP_FROM") || "whatsapp:+14155238886";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { to, message } = await req.json();

        if (!to || !message) {
            return new Response(
                JSON.stringify({ error: "Missing 'to' or 'message'" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Format the phone number for WhatsApp
        const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to.startsWith("+") ? to : "+52" + to}`;

        // Send via Twilio REST API
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

        const body = new URLSearchParams({
            From: TWILIO_WHATSAPP_FROM,
            To: formattedTo,
            Body: message,
        });

        const response = await fetch(twilioUrl, {
            method: "POST",
            headers: {
                Authorization: "Basic " + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body.toString(),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Twilio error:", result);
            return new Response(
                JSON.stringify({ error: result.message || "Twilio error" }),
                { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, sid: result.sid }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Edge function error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
