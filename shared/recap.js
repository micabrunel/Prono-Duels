// Construction du récap (texte + HTML + sujet).
// Module pur, sans dépendance : utilisable côté serveur Node (server.js)
// ET côté Cloudflare Pages Functions (functions/api/recap.js).

export function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function fmtDate(d) {
  try {
    return new Date(d).toLocaleString("fr-FR", {
      weekday: "long", day: "numeric", month: "long",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function buildRecap({ name, maxLevelChosen, highestReached, startedAt, history }) {
  history = Array.isArray(history) ? history : [];
  const who = name ? name : "Ta partenaire";

  const lines = history.map(
    (h, i) =>
      `${i + 1}. [Niveau ${h.level} ${h.emoji} ${h.levelName}] ${h.teaser ? `« ${h.teaser} » → ` : ""}Choix ${h.choiceNumber} : ${h.action}`
  );

  const text = [
    `💌 Récap de la soirée Duo Délice`,
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
      (h) => `
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
      <h1 style="margin:6px 0 0;font-size:24px;">Récap Duo Délice</h1>
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

  const subject = `💌 ${who} a joué ce soir — récap Duo Délice (niveau ${highestReached || 0})`;

  return { text, html, subject };
}

// Construit un lien mailto de secours (si aucun envoi auto n'est configuré).
export function buildMailto(recipient, recap) {
  return (
    `mailto:${encodeURIComponent(recipient)}` +
    `?subject=${encodeURIComponent(recap.subject)}` +
    `&body=${encodeURIComponent(recap.text)}`
  );
}
