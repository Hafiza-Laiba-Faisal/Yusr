import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { conversation_id } = await req.json();
    if (!conversation_id) {
      return new Response(JSON.stringify({ error: "conversation_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Auth check via user's JWT
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Load conversation + workspace
    const { data: conv } = await admin.from("conversations")
      .select("*, workspace:workspaces(*)")
      .eq("id", conversation_id).single();
    if (!conv) throw new Error("Conversation not found");

    // Verify membership
    const { data: member } = await admin.from("workspace_members")
      .select("id").eq("workspace_id", conv.workspace_id).eq("user_id", user.id).maybeSingle();
    if (!member) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Recent messages (last 20)
    const { data: msgs } = await admin.from("messages")
      .select("direction, sender, body, message_type")
      .eq("conversation_id", conversation_id)
      .order("created_at", { ascending: false }).limit(20);
    const history = (msgs ?? []).reverse();
    const lastUser = [...history].reverse().find(m => m.direction === "inbound")?.body ?? "";

    // RAG: keyword retrieval over knowledge chunks
    let context = "";
    if (lastUser) {
      const keywords = lastUser.split(/\s+/).filter((w: string) => w.length > 2).slice(0, 8);
      const tsquery = keywords.join(" | ");
      let retrieved: { content: string }[] | null = null;
      if (tsquery) {
        try {
          const { data: chunks } = await admin.rpc("search_kb", {
            _workspace_id: conv.workspace_id, _query: tsquery, _limit: 4,
          });
          if (chunks) retrieved = chunks as { content: string }[];
        } catch (_e) { /* fall through */ }
      }
      if (!retrieved && keywords.length) {
        const { data: ilikeChunks } = await admin.from("knowledge_chunks")
          .select("content")
          .eq("workspace_id", conv.workspace_id)
          .ilike("content", `%${keywords[0]}%`)
          .limit(4);
        retrieved = ilikeChunks as { content: string }[] | null;
      }
      if (retrieved && retrieved.length) {
        context = retrieved.map((c, i) => `[Source ${i + 1}]\n${c.content}`).join("\n\n");
      }
    }

    const systemPrompt = `${conv.workspace.system_prompt}

${context ? `Use the following knowledge base context to answer accurately. If the answer is not in the context, say so politely and offer to connect a human.

KNOWLEDGE BASE CONTEXT:
${context}` : "You have no knowledge base context for this query — answer helpfully but concisely from general knowledge, and offer to connect a human if needed."}

Reply in 1-3 short sentences suitable for WhatsApp. Be friendly and direct.`;

    const aiMessages = [
      { role: "system", content: systemPrompt },
      ...history.map((m: any) => ({
        role: m.direction === "inbound" ? "user" : "assistant",
        content: m.body ?? "",
      })),
    ];

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: aiMessages,
      }),
    });

    if (aiResp.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiResp.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Settings → Workspace → Usage." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      throw new Error("AI gateway error");
    }

    const aiData = await aiResp.json();
    const reply = aiData.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a reply.";

    // Insert AI message
    await admin.from("messages").insert({
      workspace_id: conv.workspace_id,
      conversation_id,
      direction: "outbound",
      sender: "ai",
      message_type: "text",
      body: reply,
    });
    await admin.from("conversations").update({
      last_message_preview: reply,
      last_message_at: new Date().toISOString(),
    }).eq("id", conversation_id);

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-reply error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
