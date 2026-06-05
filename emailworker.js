import { EmailMessage } from "cloudflare:email";

  export default {
    async fetch(request, env) {
      const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      };

      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers });
      }

      if (request.method !== "POST") {
        return new Response(JSON.stringify({ success: false }), { status: 405, headers });
      }

      let data;
      try {
        data = await request.formData();
      } catch {
        return new Response(JSON.stringify({ success: false }), { status: 400, headers });
      }

      // Honeypot
      if (data.get("website")) {
        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
      }

      const name    = String(data.get("name")    ?? "").trim();
      const contact = String(data.get("contact") ?? "").trim();
      const message = String(data.get("message") ?? "").trim();

      if (!name || !contact || !message) {
        return new Response(JSON.stringify({ success: false, reason: "missing_fields" }), { status: 422, headers });
      }
      if (name.length > 100 || contact.length > 200 || message.length > 4000) {
        return new Response(JSON.stringify({ success: false, reason: "field_too_long" }), { status: 422, headers });
      }

      const rawEmail = [
        "From: Hongshang Website <noreply@hongstex.shop>",
        "To: inquiry@hongstex.shop",
        `Subject: New enquiry from ${name}`,
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=utf-8",
        "",
        `Name: ${name}`,
        `Contact: ${contact}`,
        "",
        "Message:",
        message,
      ].join("\r\n");

      try {
        const msg = new EmailMessage("noreply@hongstex.shop", "inquiry@hongstex.shop", rawEmail);
        await env.SEND_EMAIL.send(msg);
      } catch (err) {
        console.error("Email send failed:", err);
        return new Response(JSON.stringify({ success: false }), { status: 500, headers });
      }

      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    },
  };