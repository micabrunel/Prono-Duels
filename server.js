import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "256kb" }));
app.use(express.static(path.join(__dirname, "public")));

// Destinataire du récap (le mari, par défaut).
const RECIPIENT = process.env.RECIPIENT_EMAIL || "brunel.michael@gmail.com";

// Construit un transporteur email si la config SMTP est présente.
function buildTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

function fmtDate(d) {
  try {
    return new Date(d).toLocaleString("fr-FR", {
      weekday: "long", day: "numeric", month: "long",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function buildRecap({ name, maxLevelChosen, highestReached, startedAt, history }) {
  const who = name ? name : "Ta partenaire";
  const lines = history.map(
    (h, i) =>
      `${i + 1}. [Niveau ${h.level} ${h.emoji} ${h.levelName}] ${h.teaser ? `« ${h.teaser} » → ` : ""}Choix ${h.choiceNumber} : ${h.action}`
  );

  const text = [
    `💌 Récap de la soirée Prono-Duels`,
    ``,
    `${who} a joué le ${fmtDate(startedAt)}.`,
    `Limite qu'elle s'était fixée : niveau ${maxLevelChosen}.`,
    `Niveau le plus chaud atteint : ${highestReached || 0}.`,
    `Nombre de cartes jouées : ${history.length}.`,
    ``,
    `— Ses choix —`,
    ...(lines.length ? lines : ["(aucune carte jouée)"]),
    ``,
    `À toi de jouer maintenant 😉`,
  ].join("\n");

  const rows = history
    .map(
      (h, i) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0d6dd;color:#9b4a5e;font-weight:700;white-space:nowrap;">N.${h.level} ${h.emoji}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0d6dd;color:#5a2230;">
          ${h.teaser ? `<em style="color:#a06b76;">« ${escapeHtml(h.teaser)} »</em><br/>` : ""}
          <strong style="color:#c1121f;">Choix ${h.choiceNumber} :</strong> ${escapeHtml(h.action)}
        </td>
      </tr>`
    )
    .join("");

  const html = `
  <div style="font-family:Georgia,serif;max-width:560px;margin:auto;background:#fff6f8;border-radius:18px;overflow:hidden;border:1px solid #f3c6d0;">
    <div style="background:linear-gradient(120deg,#ff8fab,#e63946);padding:26px;text-align:center;color:#fff;">
      <div style="font-size:34px;">❤️‍🔥</div>
      <h1 style="margin:6px 0 0;font-size:24px;">Récap Prono-Duels</h1>
    </div>
    <div style="padding:22px 24px;color:#5a2230;">
      <p style="font-size:16px;line-height:1.6;">
        <strong>${escapeHtml(who)}</strong> a joué le ${fmtDate(startedAt)}.
      </p>
      <p style="font-size:15px;line-height:1.6;color:#7a4350;">
        🎚️ Limite fixée : <strong>niveau ${maxLevelChosen}</strong><br/>
        🔥 Niveau atteint : <strong>${highestReached || 0}</strong><br/>
        🃏 Cartes jouées : <strong>${history.length}</strong>
      </p>
      <h3 style="color:#c1121f;margin:22px 0 8px;">Ses choix de la soirée</h3>
      <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
        ${rows || `<tr><td style="padding:12px;color:#a06b76;">Aucune carte jouée.</td></tr>`}
      </table>
      <p style="margin-top:24px;font-size:15px;color:#9b4a5e;text-align:center;">À toi de jouer maintenant 😉</p>
    </div>
  </div>`;

  return { text, html, subject: `💌 ${who} a joué ce soir — récap Prono-Duels (niveau ${highestReached || 0})` };
}

function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

app.post("/api/recap", async (req, res) => {
  const payload = req.body || {};
  payload.history = Array.isArray(payload.history) ? payload.history : [];
  const recap = buildRecap(payload);

  const transport = buildTransport();

  // Pas de SMTP configuré : on renvoie un lien mailto en secours + on logge.
  if (!transport) {
    console.log("\n===== RÉCAP (email non configuré) =====\n" + recap.text + "\n=======================================\n");
    const mailto =
      `mailto:${encodeURIComponent(RECIPIENT)}` +
      `?subject=${encodeURIComponent(recap.subject)}` +
      `&body=${encodeURIComponent(recap.text)}`;
    return res.json({ sent: false, mailto });
  }

  try {
    await transport.sendMail({
      from: process.env.MAIL_FROM || `Prono-Duels <${process.env.SMTP_USER}>`,
      to: RECIPIENT,
      subject: recap.subject,
      text: recap.text,
      html: recap.html,
    });
    res.json({ sent: true });
  } catch (err) {
    console.error("Erreur d'envoi email :", err.message);
    res.status(500).json({ sent: false, error: "send_failed" });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`❤️  Prono-Duels en ligne sur http://localhost:${PORT}`);
  console.log(buildTransport() ? "📧 Email configuré." : "⚠️  Email non configuré (mode lien mailto).");
});
