const canvas = document.querySelector("#card-canvas");
const ctx = canvas.getContext("2d");
const badge = new Image();
badge.src = "../../assets/images/badges/copilot-ux-components-2026.png";

const fields = {
  name: document.querySelector("#recipient-name"),
  role: document.querySelector("#community-role"),
  date: document.querySelector("#earned-date"),
  showDate: document.querySelector("#show-date"),
  accent: document.querySelector("#accent"),
  message: document.querySelector("#message")
};
const themes = {
  "aurora-circuit": { top: "#06323a", bottom: "#061820", glow: "#17e2d8", second: "#4abfff", flare: "#8e49d7", texture: "circuit", text: "#f4feff", muted: "#b4d6da", subtle: "#87abb2", panel: "rgba(4,18,24,.96)" },
  "midnight-grid": { top: "#101c3c", bottom: "#050a18", glow: "#36a6ff", second: "#876cff", flare: "#1bd9d0", texture: "grid", text: "#f6f7ff", muted: "#c5d4ff", subtle: "#96aad9", panel: "rgba(5,9,25,.96)" },
  "sunset-chrome": { top: "#3b162a", bottom: "#160b19", glow: "#ff4e94", second: "#ff9b38", flare: "#8d5cff", texture: "chrome", text: "#fff8fb", muted: "#ffd0e0", subtle: "#d7a4b8", panel: "rgba(24,8,19,.96)" },
  "arctic-glass": { top: "#173946", bottom: "#07151d", glow: "#b9f5ff", second: "#54d7ef", flare: "#9aaeff", texture: "frost", text: "#ffffff", muted: "#d5f8ff", subtle: "#a9d4dd", panel: "rgba(7,22,30,.94)" },
  "electric-bloom": { top: "#301040", bottom: "#10071b", glow: "#f85cff", second: "#45e6d3", flare: "#786cff", texture: "bloom", text: "#fff8ff", muted: "#f2caff", subtle: "#c9a0d4", panel: "rgba(20,7,29,.96)" },
  "solar-flare": { top: "#401b0d", bottom: "#170a08", glow: "#ffbe46", second: "#ff643d", flare: "#ff2d74", texture: "rays", text: "#fffdf8", muted: "#ffe0ae", subtle: "#d8b787", panel: "rgba(23,10,8,.96)" }
};
let selectedMotion = "still";
let motionPlaying = false;
let animationFrame = 0;
let animationStartedAt = performance.now();

const motionDuration = 5000;
const motionButtons = [...document.querySelectorAll(".motion-option")];
const toggleMotion = document.querySelector("#toggle-motion");

function roundedRect(x, y, w, h, r) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return ctx;
}

function fitText(text, maxWidth, startSize, weight = 700) {
  let size = startSize;
  do { ctx.font = `${weight} ${size}px "Space Grotesk", sans-serif`; size -= 2; } while (ctx.measureText(text).width > maxWidth && size > 28);
  return size + 2;
}

function drawCoverImage(image, x, y, w, h) {
  const scale = Math.min(w / image.width, h / image.height);
  const dw = image.width * scale, dh = image.height * scale;
  ctx.drawImage(image, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function drawThemeTexture(theme, phase) {
  ctx.save();
  if (theme.texture === "grid") {
    ctx.strokeStyle = `${theme.second}22`; ctx.lineWidth = 2;
    for (let x = -200; x < 1400; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 360, 1500); ctx.stroke(); }
    for (let y = 100; y < 1500; y += 110) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1200, y); ctx.stroke(); }
  } else if (theme.texture === "circuit") {
    ctx.strokeStyle = `${theme.glow}24`; ctx.lineWidth = 3;
    for (let i = 0; i < 11; i += 1) {
      const y = 235 + i * 95; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(90 + (i % 3) * 60, y); ctx.lineTo(150 + (i % 3) * 60, y + 45); ctx.lineTo(330, y + 45); ctx.stroke();
      ctx.fillStyle = `${theme.glow}55`; ctx.beginPath(); ctx.arc(330, y + 45, 5, 0, Math.PI * 2); ctx.fill();
    }
  } else if (theme.texture === "chrome") {
    for (let y = 0; y < 1500; y += 55) { const g = ctx.createLinearGradient(0, y, 1200, y); g.addColorStop(0, "transparent"); g.addColorStop(.48, `${theme.glow}12`); g.addColorStop(.52, "rgba(255,255,255,.08)"); g.addColorStop(1, "transparent"); ctx.fillStyle = g; ctx.fillRect(0, y, 1200, 2); }
  } else if (theme.texture === "frost") {
    ctx.filter = "blur(2px)";
    for (let i = 0; i < 24; i += 1) { const x = (i * 173) % 1200, y = (i * 307) % 1500, r = 18 + (i % 5) * 9; ctx.fillStyle = `rgba(210,248,255,${.018 + (i % 3) * .012})`; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
    ctx.filter = "none";
  } else if (theme.texture === "bloom") {
    for (let i = 0; i < 9; i += 1) { const angle = (Math.PI * 2 / 9) * i + phase * .08; ctx.strokeStyle = i % 2 ? `${theme.glow}16` : `${theme.second}16`; ctx.lineWidth = 28; ctx.beginPath(); ctx.ellipse(600, 430, 160 + i * 18, 360, angle, 0, Math.PI * 2); ctx.stroke(); }
  } else if (theme.texture === "rays") {
    ctx.translate(600, 340); ctx.globalAlpha = .08;
    for (let i = 0; i < 22; i += 1) { ctx.rotate(Math.PI / 11); ctx.fillStyle = i % 2 ? theme.glow : theme.flare; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-26, 1050); ctx.lineTo(26, 1050); ctx.closePath(); ctx.fill(); }
  }
  ctx.restore();
}

function drawCard(timestamp = 0) {
  const t = themes[fields.accent.value];
  const phase = ((timestamp % motionDuration) / motionDuration) * Math.PI * 2;
  const isAnimated = selectedMotion !== "still";
  const name = fields.name.value.trim() || "Your Name";
  const role = fields.role.value.trim() || "Community Contributor";
  const date = fields.showDate.checked && fields.date.value ? new Date(`${fields.date.value}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bg.addColorStop(0, t.top); bg.addColorStop(.58, t.bottom); bg.addColorStop(1, "#030c11");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glowX = selectedMotion === "aurora-flow" ? 600 + Math.sin(phase) * 330 : 890;
  const glowY = selectedMotion === "aurora-flow" ? 350 + Math.cos(phase) * 170 : 250;
  const glow = ctx.createRadialGradient(glowX, glowY, 10, glowX, glowY, 620);
  glow.addColorStop(0, `${t.glow}55`); glow.addColorStop(.5, `${t.flare}18`); glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, canvas.width, 920);
  drawThemeTexture(t, phase);

  ctx.fillStyle = "rgba(255,255,255,.04)"; roundedRect(58, 58, 1084, 1384, 44).fill();
  ctx.strokeStyle = "rgba(180,239,244,.18)"; ctx.lineWidth = 2; roundedRect(58, 58, 1084, 1384, 44).stroke();
  const border = ctx.createLinearGradient(100, 80, 1100, 80);
  border.addColorStop(0, "#ff9c39"); border.addColorStop(.28, "#fc3f90"); border.addColorStop(.58, "#7357ff"); border.addColorStop(1, t.glow);
  ctx.strokeStyle = border; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(105, 83); ctx.lineTo(1095, 83); ctx.stroke();

  ctx.fillStyle = t.text; ctx.font = "700 30px 'DM Sans', sans-serif"; ctx.letterSpacing = "4px"; ctx.fillText("MICROSOFT 365 & POWER PLATFORM", 103, 146);
  ctx.fillStyle = t.glow; ctx.font = "700 24px 'DM Sans', sans-serif"; ctx.letterSpacing = "5px"; ctx.fillText("COMMUNITY RECOGNITION", 103, 188);
  ctx.letterSpacing = "0px";

  const pulse = selectedMotion === "neon-pulse" ? .5 + (Math.sin(phase) + 1) * .5 : 1;
  ctx.shadowColor = `${t.glow}88`; ctx.shadowBlur = 35 + pulse * 45;
  ctx.fillStyle = "rgba(5,20,27,.76)"; roundedRect(150, 235, 900, 720, 44).fill();
  ctx.shadowBlur = 0; ctx.strokeStyle = "rgba(185,246,249,.13)"; ctx.lineWidth = 2; roundedRect(150, 235, 900, 720, 44).stroke();
  const badgeFloat = isAnimated ? Math.sin(phase) * 9 : 0;
  const progress = (timestamp % motionDuration) / motionDuration;
  let revealScale = 1, revealAlpha = 1;
  if (selectedMotion === "collector-reveal") {
    const intro = Math.min(1, progress / .24); const outro = progress > .86 ? Math.max(0, (1 - progress) / .14) : 1;
    revealScale = (.72 + .28 * (1 - Math.pow(1 - intro, 3))) * (.92 + .08 * outro); revealAlpha = Math.min(1, intro * 1.8) * outro;
  }
  if (badge.complete && badge.naturalWidth) {
    ctx.save(); ctx.globalAlpha = revealAlpha; ctx.translate(600, 595); ctx.scale(revealScale, revealScale); ctx.translate(-600, -595);
    drawCoverImage(badge, 210, 278 + badgeFloat, 780, 630); ctx.restore();
  }

  if (selectedMotion === "neon-pulse") {
    const wave = (Math.sin(phase) + 1) / 2;
    ctx.save(); ctx.translate(600, 595);
    for (let i = 0; i < 3; i += 1) {
      const spread = (wave + i / 3) % 1;
      ctx.globalAlpha = (1 - spread) * .62;
      ctx.strokeStyle = i % 2 ? t.second : t.glow;
      ctx.lineWidth = 8 - spread * 5;
      ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 34;
      ctx.beginPath(); ctx.ellipse(0, 0, 365 + spread * 115, 285 + spread * 88, 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
    ctx.save(); ctx.globalAlpha = .35 + wave * .55; ctx.strokeStyle = t.glow; ctx.lineWidth = 5 + wave * 7; ctx.shadowColor = t.glow; ctx.shadowBlur = 45 + wave * 40; roundedRect(65, 65, 1070, 1370, 40).stroke(); ctx.restore();
  }

  if (selectedMotion === "holographic") {
    const sweepX = -480 + ((timestamp % motionDuration) / motionDuration) * 2150;
    const sweep = ctx.createLinearGradient(sweepX - 210, 0, sweepX + 210, 0);
    sweep.addColorStop(0, "transparent"); sweep.addColorStop(.4, "rgba(79,214,255,.03)"); sweep.addColorStop(.5, "rgba(255,255,255,.25)"); sweep.addColorStop(.6, "rgba(255,68,171,.07)"); sweep.addColorStop(1, "transparent");
    ctx.save(); roundedRect(150, 235, 900, 720, 44).clip(); ctx.fillStyle = sweep; ctx.fillRect(150, 235, 900, 720); ctx.restore();
  }

  if (selectedMotion === "celebration") {
    const colors = [t.glow, t.second, t.flare, "#ff9c39", "#ffffff"];
    ctx.save();
    for (let i = 0; i < 34; i += 1) {
      const seed = (i * 47) % 101;
      const x = 70 + ((seed * 83) % 1060);
      const y = ((progress * 1750 + seed * 31) % 1750) - 150;
      ctx.globalAlpha = Math.min(1, progress * 8, (1 - progress) * 8);
      ctx.fillStyle = colors[i % colors.length];
      ctx.translate(x, y); ctx.rotate(phase + i); ctx.fillRect(-4, -11, 8, 22); ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.restore();
  }

  if (selectedMotion === "orbit") {
    ctx.save(); ctx.translate(600, 595); ctx.strokeStyle = `${t.glow}55`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, 420, 205, -.22, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 4; i += 1) { const a = phase + i * Math.PI / 2; const x = Math.cos(a) * 420, y = Math.sin(a) * 205; ctx.fillStyle = i % 2 ? t.second : t.glow; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }

  if (selectedMotion === "signal-scan") {
    const scanY = 210 + progress * 790; const scan = ctx.createLinearGradient(0, scanY - 42, 0, scanY + 42); scan.addColorStop(0, "transparent"); scan.addColorStop(.5, `${t.glow}66`); scan.addColorStop(1, "transparent");
    ctx.save(); roundedRect(150, 235, 900, 720, 44).clip(); ctx.fillStyle = scan; ctx.fillRect(150, scanY - 42, 900, 84); ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fillRect(150, scanY, 900, 2); ctx.restore();
  }

  if (selectedMotion === "fall-leaves") {
    const leafColors = ["#ffbf42", "#e66a2a", "#b73b27", "#8e4f28", "#f18d32"];
    ctx.save();
    for (let i = 0; i < 30; i += 1) {
      const seed = (i * 61) % 137;
      const fall = (progress + seed / 137) % 1;
      const x = 40 + ((seed * 97) % 1120) + Math.sin(phase * 2 + i) * 34;
      const y = -90 + fall * 1680;
      ctx.translate(x, y); ctx.rotate(phase * (i % 2 ? 1.4 : -1.1) + i);
      ctx.globalAlpha = .45 + (i % 4) * .13; ctx.fillStyle = leafColors[i % leafColors.length];
      ctx.beginPath(); ctx.moveTo(0, -14); ctx.bezierCurveTo(17, -9, 18, 9, 0, 15); ctx.bezierCurveTo(-18, 9, -17, -9, 0, -14); ctx.fill();
      ctx.strokeStyle = "rgba(73,30,14,.55)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -11); ctx.lineTo(0, 19); ctx.stroke();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.restore();
  }

  if (selectedMotion === "winter-snow") {
    ctx.save();
    for (let i = 0; i < 48; i += 1) {
      const seed = (i * 73) % 149;
      const fall = (progress * (.55 + (i % 5) * .1) + seed / 149) % 1;
      const x = 25 + ((seed * 89) % 1150) + Math.sin(phase + i) * (8 + i % 4 * 5);
      const y = -30 + fall * 1570; const radius = 2 + (i % 6);
      ctx.globalAlpha = .3 + (i % 5) * .13; ctx.fillStyle = i % 4 ? "#eafcff" : t.glow; ctx.shadowColor = "#c9f7ff"; ctx.shadowBlur = radius * 2;
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  ctx.fillStyle = t.panel; roundedRect(103, 930, 994, 147, 28).fill();
  const ribbon = ctx.createLinearGradient(103, 0, 1097, 0); ribbon.addColorStop(0, t.glow); ribbon.addColorStop(.48, t.second); ribbon.addColorStop(1, t.flare);
  ctx.fillStyle = ribbon; roundedRect(103, 930, 994, 8, 4).fill();
  ctx.textAlign = "center"; ctx.fillStyle = t.muted; ctx.font = "700 21px 'DM Sans', sans-serif"; ctx.letterSpacing = "4px"; ctx.fillText("SKILLS RECOGNIZED", 600, 982); ctx.letterSpacing = "0px";
  const skillChips = [{ label: "COPILOT", x: 208, w: 225 }, { label: "GITHUB", x: 448, w: 205 }, { label: "SHAREPOINT", x: 668, w: 324 }];
  skillChips.forEach((chip, index) => {
    ctx.fillStyle = index === 1 ? `${t.second}18` : `${t.glow}15`; roundedRect(chip.x, 1000, chip.w, 49, 18).fill();
    ctx.strokeStyle = index === 1 ? `${t.second}88` : `${t.glow}77`; ctx.lineWidth = 2; roundedRect(chip.x, 1000, chip.w, 49, 18).stroke();
    ctx.fillStyle = t.text; ctx.font = "700 24px 'Space Grotesk', sans-serif"; ctx.fillText(chip.label, chip.x + chip.w / 2, 1033);
  });

  ctx.fillStyle = t.muted; ctx.font = "700 24px 'DM Sans', sans-serif"; ctx.letterSpacing = "7px"; ctx.fillText("PROUDLY EARNED BY", 600, 1148); ctx.letterSpacing = "0px";
  const nameSize = fitText(name, 950, 78); ctx.fillStyle = t.text; ctx.font = `700 ${nameSize}px 'Space Grotesk', sans-serif`; ctx.fillText(name, 600, 1234);
  ctx.fillStyle = t.glow; ctx.font = "600 28px 'DM Sans', sans-serif"; ctx.fillText(role, 600, 1290);
  if (date) { ctx.fillStyle = t.muted; ctx.font = "600 26px 'DM Sans', sans-serif"; ctx.fillText(date, 600, 1344); }

  ctx.textAlign = "left"; ctx.fillStyle = t.glow; ctx.beginPath(); ctx.arc(105, 1392, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = t.muted; ctx.font = "700 22px 'DM Sans', sans-serif"; ctx.letterSpacing = "3px"; ctx.fillText("#SHARINGISCARING", 127, 1400); ctx.letterSpacing = "0px";
  ctx.textAlign = "left";
}

function animationLoop(now) {
  drawCard(now - animationStartedAt);
  if (motionPlaying && selectedMotion !== "still") animationFrame = requestAnimationFrame(animationLoop);
}

function setMotionPlaying(playing) {
  motionPlaying = playing && selectedMotion !== "still";
  cancelAnimationFrame(animationFrame);
  toggleMotion.setAttribute("aria-pressed", String(motionPlaying));
  toggleMotion.innerHTML = motionPlaying ? '<span aria-hidden="true">Ⅱ</span> Pause motion' : '<span aria-hidden="true">▶</span> Preview motion';
  if (motionPlaying) { animationStartedAt = performance.now(); animationFrame = requestAnimationFrame(animationLoop); }
  else drawCard(0);
}

function announce(message) {
  const status = document.querySelector("#status"); status.textContent = message;
  window.setTimeout(() => { if (status.textContent === message) status.textContent = ""; }, 2600);
}

function download(type) {
  drawCard(0);
  const link = document.createElement("a");
  const safeName = (fields.name.value.trim() || "community-member").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  link.download = `${safeName}-copilot-ux-components-card.${type === "image/png" ? "png" : "jpg"}`;
  link.href = canvas.toDataURL(type, .94); link.click(); announce(`${type === "image/png" ? "PNG" : "JPG"} card downloaded!`);
}

function safeFileName(extension) {
  const safeName = (fields.name.value.trim() || "community-member").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${safeName}-copilot-ux-components-card.${extension}`;
}

function supportedVideoType() {
  if (!window.MediaRecorder) return null;
  const choices = [
    { mime: 'video/mp4;codecs="avc1.42E01E"', extension: "mp4" },
    { mime: "video/mp4", extension: "mp4" },
    { mime: "video/webm;codecs=vp9", extension: "webm" },
    { mime: "video/webm;codecs=vp8", extension: "webm" },
    { mime: "video/webm", extension: "webm" }
  ];
  return choices.find(choice => MediaRecorder.isTypeSupported(choice.mime)) || null;
}

async function downloadVideo() {
  const format = supportedVideoType();
  if (!canvas.captureStream || !format) { announce("Video export is not supported by this browser yet."); return; }
  if (selectedMotion === "still") { announce("Choose an animation preset first."); return; }

  const button = document.querySelector("#download-video");
  const chunks = [];
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: format.mime, videoBitsPerSecond: 7000000 });
  button.disabled = true; button.textContent = "Rendering 5s…";
  recorder.addEventListener("dataavailable", event => { if (event.data.size) chunks.push(event.data); });
  recorder.addEventListener("stop", () => {
    const blob = new Blob(chunks, { type: format.mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.download = safeFileName(format.extension); link.href = url; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    stream.getTracks().forEach(track => track.stop());
    button.disabled = false; button.innerHTML = '<span>●</span> Video';
    setMotionPlaying(false); announce(`${format.extension.toUpperCase()} animation downloaded!`);
  });
  setMotionPlaying(true); recorder.start(250);
  window.setTimeout(() => recorder.stop(), motionDuration);
}

async function shareCard() {
  drawCard(0);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
  const file = new File([blob], safeFileName("png"), { type: "image/png" });
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ title: "My Community Recognition Card", text: fields.message.value, files: [file] }); announce("Card shared!"); }
    catch (error) { if (error.name !== "AbortError") announce("Sharing was not completed."); }
  } else {
    await navigator.clipboard?.writeText(fields.message.value).catch(() => {});
    download("image/png"); announce("Card downloaded and post text copied—ready to share!");
  }
}

Object.values(fields).forEach(field => field.addEventListener("input", () => {
  if (field === fields.message) document.querySelector("#char-count").textContent = `${field.value.length} / 240`;
  if (!motionPlaying) drawCard(0);
}));
fields.showDate.addEventListener("change", () => {
  const dateField = document.querySelector("#date-field");
  dateField.hidden = !fields.showDate.checked;
  fields.date.disabled = !fields.showDate.checked;
  if (!motionPlaying) drawCard(0);
});
document.querySelectorAll(".control-section").forEach(section => section.addEventListener("toggle", () => {
  if (!section.open) return;
  document.querySelectorAll(".control-section").forEach(other => { if (other !== section) other.open = false; });
}));
motionButtons.forEach(button => button.addEventListener("click", () => {
  selectedMotion = button.dataset.motion;
  motionButtons.forEach(option => { const selected = option === button; option.classList.toggle("selected", selected); option.setAttribute("aria-checked", String(selected)); });
  setMotionPlaying(selectedMotion !== "still" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}));
toggleMotion.addEventListener("click", () => {
  if (selectedMotion === "still") { announce("Choose an animation preset to preview motion."); return; }
  setMotionPlaying(!motionPlaying);
});
document.querySelector("#download-png").addEventListener("click", () => download("image/png"));
document.querySelector("#download-jpg").addEventListener("click", () => download("image/jpeg"));
document.querySelector("#download-video").addEventListener("click", downloadVideo);
document.querySelector("#share-card").addEventListener("click", shareCard);
document.querySelector("#copy-message").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(fields.message.value); announce("Social post copied to your clipboard!"); }
  catch { fields.message.select(); document.execCommand("copy"); announce("Social post copied!"); }
});
badge.addEventListener("load", drawCard);
document.fonts.ready.then(drawCard);
document.querySelector("#char-count").textContent = `${fields.message.value.length} / 240`;
drawCard();
