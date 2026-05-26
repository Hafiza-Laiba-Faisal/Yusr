// Placeholder webhook for Meta WhatsApp Cloud API.
// Phase 2: validate signature, parse payload, store message, trigger AI if mode=ai, send via Graph API.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Webhook verification (Meta calls GET with hub.challenge)
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    const verifyToken = Deno.env.get("WHATSAPP_VERIFY_TOKEN") ?? "yusr-verify";
    if (mode === "subscribe" && token === verifyToken) {
      return new Response(challenge ?? "", { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  // POST: incoming webhook payload
  try {
    const body = await req.json();
    console.log("WhatsApp webhook (stub):", JSON.stringify(body).slice(0, 500));
    // TODO Phase 2: parse entry/changes/value, identify workspace by phone_number_id,
    // upsert contact, conversation, insert message, trigger ai-reply if mode=ai.
    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (e) {
    console.error(e);
    return new Response("Error", { status: 500, headers: corsHeaders });
  }
});
