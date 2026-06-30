import { LEVELS } from "./data/duels.js";

// ---------- State ----------
const state = {
  name: "",
  maxLevel: 3,
  levelIndex: 0,   // index dans LEVELS (0 = niveau 1)
  cardIndex: 0,
  history: [],     // { level, levelName, teaser, choiceNumber, action }
  startedAt: null,
};

// ---------- Helpers ----------
const $ = (sel) => document.querySelector(sel);
const screens = {
  welcome: $("#screen-welcome"),
  setup: $("#screen-setup"),
  play: $("#screen-play"),
  transition: $("#screen-transition"),
  end: $("#screen-end"),
};

function show(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
}

// ---------- Setup screen ----------
function buildLevelPicker() {
  const picker = $("#level-picker");
  picker.innerHTML = "";
  LEVELS.forEach((lvl) => {
    const opt = document.createElement("button");
    opt.type = "button";
    opt.className = "level-option";
    opt.dataset.level = lvl.level;
    opt.innerHTML = `
      <span class="lvl-emoji">${lvl.emoji}</span>
      <span class="lvl-info">
        <span class="lvl-name">Niveau ${lvl.level} · ${lvl.name}</span>
        <span class="lvl-tag">${lvl.tagline}</span>
      </span>
      <span class="lvl-check"></span>`;
    opt.addEventListener("click", () => selectMaxLevel(lvl.level));
    picker.appendChild(opt);
  });
  selectMaxLevel(state.maxLevel);
}

function selectMaxLevel(level) {
  state.maxLevel = level;
  document.querySelectorAll(".level-option").forEach((el) => {
    el.classList.toggle("selected", Number(el.dataset.level) === level);
  });
}

// ---------- Game flow ----------
function startGame() {
  state.name = ($("#player-name").value || "").trim();
  state.levelIndex = 0;
  state.cardIndex = 0;
  state.history = [];
  state.startedAt = new Date();
  show("play");
  renderCard();
}

function currentLevel() {
  return LEVELS[state.levelIndex];
}

function renderCard() {
  const level = currentLevel();
  const card = level.cards[state.cardIndex];

  // header
  $("#level-badge").innerHTML =
    `<span class="lvl-emoji">${level.emoji}</span> Niveau ${level.level} · ${level.name}`;
  const pct = (state.cardIndex / level.cards.length) * 100;
  $("#progress-bar").style.width = `${pct}%`;
  document.documentElement.style.setProperty("--red", level.color);

  // show choice stage, hide reveal
  $("#choice-stage").style.display = "flex";
  $("#reveal-stage").style.display = "none";
  $("#card-teaser").textContent = card.teaser || "Choisis…";

  // (re)bind choice buttons
  document.querySelectorAll(".choice-btn").forEach((btn) => {
    btn.onclick = () => pickChoice(Number(btn.dataset.choice));
  });
}

function pickChoice(choiceIdx) {
  const level = currentLevel();
  const card = level.cards[state.cardIndex];
  const choice = card.choices[choiceIdx];

  state.history.push({
    level: level.level,
    levelName: level.name,
    emoji: level.emoji,
    teaser: card.teaser || "",
    choiceNumber: choiceIdx + 1,
    action: choice.action,
  });

  // reveal
  $("#choice-stage").style.display = "none";
  $("#reveal-stage").style.display = "flex";
  $("#reveal-action").textContent = choice.action;

  const reveal = $("#reveal-card");
  reveal.style.animation = "none";
  void reveal.offsetWidth; // reflow to restart animation
  reveal.style.animation = "";

  // progress as if this card is done
  const pct = ((state.cardIndex + 1) / level.cards.length) * 100;
  $("#progress-bar").style.width = `${pct}%`;
}

function nextCard() {
  const level = currentLevel();
  state.cardIndex += 1;

  if (state.cardIndex < level.cards.length) {
    renderCard();
  } else {
    levelFinished();
  }
}

function levelFinished() {
  const level = currentLevel();
  const reachedOwnMax = level.level >= state.maxLevel;
  const isLastLevel = state.levelIndex >= LEVELS.length - 1;

  $("#trans-emoji").textContent = level.emoji;
  $("#trans-title").textContent = `Niveau ${level.level} bouclé !`;

  const cont = $("#continue-level");
  const stop = $("#stop-here");

  if (reachedOwnMax || isLastLevel) {
    // Elle a atteint la limite qu'elle s'était fixée (ou le dernier niveau)
    $("#trans-text").innerHTML = isLastLevel
      ? "Tu as tout exploré… 🖤 Il n'y a plus de niveau au-dessus."
      : "Tu as atteint la limite que tu t'étais fixée pour ce soir. Tu décides&nbsp;:";
    cont.style.display = "none";
    stop.textContent = "Terminer la soirée 🌙";
  } else {
    const next = LEVELS[state.levelIndex + 1];
    $("#trans-text").innerHTML =
      `Envie de monter d'un cran&nbsp;?<br />Le niveau suivant&nbsp;: <strong>${next.emoji} ${next.name}</strong> — <em>${next.tagline}</em>.`;
    cont.style.display = "block";
    cont.textContent = `Continuer vers le niveau ${next.level} ↑`;
    stop.textContent = "Rester là pour ce soir";
  }

  show("transition");
}

function continueLevel() {
  state.levelIndex += 1;
  state.cardIndex = 0;
  show("play");
  renderCard();
}

async function endGame() {
  show("end");
  const highest = state.history.length
    ? Math.max(...state.history.map((h) => h.level))
    : 0;
  const lvlObj = LEVELS.find((l) => l.level === highest);

  $("#end-title").textContent = "Soirée terminée 🌙";
  $("#end-text").innerHTML = state.history.length
    ? `Tu es montée jusqu'au <strong>niveau ${highest}${lvlObj ? " · " + lvlObj.name : ""}</strong>. ${highest >= 4 ? "Quelle soirée… 🔥" : "Tout en douceur 💕"}`
    : "Pas de carte jouée cette fois. À la prochaine 😉";

  const statusEl = $("#recap-status");
  statusEl.textContent = "Envoi du récap…";
  statusEl.className = "recap-status";

  try {
    const res = await fetch("/api/recap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: state.name,
        maxLevelChosen: state.maxLevel,
        highestReached: highest,
        startedAt: state.startedAt,
        finishedAt: new Date(),
        history: state.history,
      }),
    });
    const data = await res.json().catch(() => ({}));

    if (data.sent) {
      statusEl.textContent = "💌 Le récap lui a été envoyé par email.";
      statusEl.className = "recap-status ok";
    } else if (data.mailto) {
      statusEl.innerHTML = `Email non configuré. <a href="${data.mailto}">Envoyer le récap manuellement →</a>`;
    } else {
      statusEl.textContent = "Récap enregistré (email non configuré).";
    }
  } catch (e) {
    statusEl.textContent = "Impossible d'envoyer le récap (serveur injoignable).";
  }
}

function replay() {
  state.levelIndex = 0;
  state.cardIndex = 0;
  state.history = [];
  $("#player-name").value = state.name;
  show("setup");
}

// ---------- Wire up ----------
$("#go-setup").addEventListener("click", () => {
  buildLevelPicker();
  show("setup");
});
$("#start-game").addEventListener("click", startGame);
$("#next-card").addEventListener("click", nextCard);
$("#continue-level").addEventListener("click", continueLevel);
$("#stop-here").addEventListener("click", endGame);
$("#replay").addEventListener("click", replay);

// init
buildLevelPicker();
