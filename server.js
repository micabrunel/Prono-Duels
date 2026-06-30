import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildRecap, buildMailto } from "./shared/recap.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "256kb" }));
app.use(express.static(path.join(__dirname, "public")));

// Destinataire du récap (le mari, par défaut).
const RECIPIENT = process.env.RECIPIENT_EMAIL || "brunel.michael@gmail.com";

// Construit un transporteur SMTP si la config est présente (dev local).
function buildTransport() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

// Envoi via l'API HTTP Resend (même méthode qu'en prod sur Cloudflare).
async function sendViaResend(recap) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || "Duo Délice <onboarding@resend.dev>",
      to: [RECIPIENT],
      subject: recap.subject,
      text: recap.text,
      html: recap.html,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return true;
}

app.post("/api/recap", async (req, res) => {
  const recap = buildRecap(req.body || {});

  try {
    // 1) Resend (HTTP) si configuré
    if (process.env.RESEND_API_KEY) {
      await sendViaResend(recap);
      return res.json({ sent: true });
    }
    // 2) SMTP (nodemailer) si configuré
    const transport = buildTransport();
    if (transport) {
      await transport.sendMail({
        from: process.env.MAIL_FROM || `Duo Délice <${process.env.SMTP_USER}>`,
        to: RECIPIENT,
        subject: recap.subject,
        text: recap.text,
        html: recap.html,
      });
      return res.json({ sent: true });
    }
  } catch (err) {
    console.error("Erreur d'envoi email :", err.message);
    return res.status(500).json({ sent: false, error: "send_failed" });
  }

  // 3) Aucun envoi configuré : on logge et on renvoie un lien mailto de secours.
  console.log("\n===== RÉCAP (email non configuré) =====\n" + recap.text + "\n=======================================\n");
  res.json({ sent: false, mailto: buildMailto(RECIPIENT, recap) });
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`❤️  Duo Délice en ligne sur http://localhost:${PORT}`);
  const mode = process.env.RESEND_API_KEY
    ? "📧 Email via Resend."
    : buildTransport()
      ? "📧 Email via SMTP."
      : "⚠️  Email non configuré (mode lien mailto).";
  console.log(mode);
});
