// Cloudflare Pages Function → route POST /api/recap
// Envoie le récap par email via l'API HTTP Resend (https://resend.com).
//
// Variables d'environnement à définir dans Cloudflare Pages :
//   RESEND_API_KEY   → ta clé API Resend (obligatoire pour l'envoi auto)
//   RECIPIENT_EMAIL  → destinataire du récap (def. brunel.michael@gmail.com)
//   MAIL_FROM        → expéditeur (def. "Duo Délice <onboarding@resend.dev>")

import { buildRecap, buildMailto } from "../../shared/recap.js";

export async function onRequestPost({ request, env }) {
  let payload = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const recipient = env.RECIPIENT_EMAIL || "brunel.michael@gmail.com";
  const recap = buildRecap(payload);

  // Pas de clé : on renvoie un lien mailto de secours.
  if (!env.RESEND_API_KEY) {
    return json({ sent: false, mailto: buildMailto(recipient, recap) });
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.MAIL_FROM || "Duo Délice <onboarding@resend.dev>",
        to: [recipient],
        subject: recap.subject,
        text: recap.text,
        html: recap.html,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      return json({ sent: false, error: "send_failed", detail, mailto: buildMailto(recipient, recap) }, 502);
    }
    return json({ sent: true });
  } catch (err) {
    return json({ sent: false, error: "send_failed", mailto: buildMailto(recipient, recap) }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
