const CONFIG_URL = "/config/theme.json";
let CURRENT_CFG = null;

function $(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const el = $(id);
  if (!el) return;
  el.textContent = typeof value === "string" ? value : "";
}

function setLink(btnId, label, url) {
  const btn = $(btnId);
  if (!btn) return;

  btn.textContent = typeof label === "string" && label.trim() ? label : btn.textContent;
  const cleanUrl = typeof url === "string" ? url.trim() : "";

  if (!cleanUrl || cleanUrl === "#") {
    btn.classList.add("disabled");
    btn.setAttribute("href", "#");
    btn.setAttribute("aria-disabled", "true");
    btn.removeAttribute("target");
    btn.removeAttribute("rel");
    return;
  }

  btn.classList.remove("disabled");
  btn.setAttribute("href", cleanUrl);
  btn.setAttribute("aria-disabled", "false");
  btn.setAttribute("target", "_blank");
  btn.setAttribute("rel", "noopener noreferrer");
}

async function loadTheme() {
  const res = await fetch(CONFIG_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`config fetch failed: ${res.status}`);
  return await res.json();
}

function renderSteps(stepsEl, steps) {
  if (!stepsEl) return;
  stepsEl.innerHTML = "";
  const arr = Array.isArray(steps) ? steps : [];
  for (const item of arr) {
    const li = document.createElement("li");
    li.textContent = typeof item === "string" ? item : "";
    stepsEl.appendChild(li);
  }
}

function openGuide(kind) {
  const cfg = CURRENT_CFG;
  const modal = $("guideModal");
  const titleEl = $("guideTitle");
  const stepsEl = $("guideSteps");
  const footEl = $("guideFootnote");
  const dlBtn = $("guideDownloadBtn");

  const osCfg = kind === "android" ? cfg?.android : cfg?.ios;
  const guide = osCfg?.applyGuide ?? {};

  if (titleEl) titleEl.textContent = guide?.title ?? "적용 방법";
  renderSteps(stepsEl, guide?.steps);
  if (footEl) footEl.textContent = guide?.footnote ?? "";

  const dlUrl = typeof osCfg?.downloadUrl === "string" ? osCfg.downloadUrl.trim() : "";
  const dlLabel = typeof osCfg?.label === "string" && osCfg.label.trim() ? osCfg.label : "다운로드 진행";
  if (dlBtn) {
    dlBtn.textContent = dlLabel;
    if (dlUrl) {
      dlBtn.classList.remove("disabled");
      dlBtn.setAttribute("href", dlUrl);
      dlBtn.setAttribute("target", "_blank");
      dlBtn.setAttribute("rel", "noopener noreferrer");
      dlBtn.setAttribute("aria-disabled", "false");
    } else {
      dlBtn.classList.add("disabled");
      dlBtn.setAttribute("href", "#");
      dlBtn.setAttribute("aria-disabled", "true");
      dlBtn.removeAttribute("target");
      dlBtn.removeAttribute("rel");
    }
  }

  if (modal) {
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeGuide() {
  const modal = $("guideModal");
  if (modal) modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function wireGuides() {
  const androidBtn = $("androidBtn");
  const iosBtn = $("iosBtn");

  const closeBtn = $("guideCloseBtn");
  const doneBtn = $("guideDoneBtn");
  const backdrop = $("guideBackdrop");

  const onKeyDown = (e) => {
    if (e.key === "Escape") closeGuide();
  };

  if (androidBtn) {
    androidBtn.addEventListener("click", (e) => {
      if (androidBtn.classList.contains("disabled")) return;
      e.preventDefault();
      openGuide("android");
    });
  }

  if (iosBtn) {
    iosBtn.addEventListener("click", (e) => {
      if (iosBtn.classList.contains("disabled")) return;
      e.preventDefault();
      openGuide("ios");
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeGuide);
  if (doneBtn) doneBtn.addEventListener("click", closeGuide);
  if (backdrop) backdrop.addEventListener("click", closeGuide);

  document.addEventListener("keydown", onKeyDown);
}

function applyTheme(cfg) {
  CURRENT_CFG = cfg;
  setText("themeName", cfg?.themeName ?? "카카오톡 테마");
  setText("subtitle", cfg?.subtitle ?? "");
  setText("description", cfg?.description ?? "");
  setText("footerNote", cfg?.footerNote ?? "");

  setLink("androidBtn", cfg?.android?.label, cfg?.android?.downloadUrl);
  setLink("iosBtn", cfg?.ios?.label, cfg?.ios?.downloadUrl);

  setText("androidNote", cfg?.android?.note ?? "");
  setText("iosNote", cfg?.ios?.note ?? "");

  const title = cfg?.themeName ? `${cfg.themeName} · 테마 다운로드` : "카카오톡 테마 다운로드";
  document.title = title;
}

function applyError(err) {
  setText("description", "설정 파일을 불러오지 못했습니다. (config/theme.json 확인 필요)");
  setText("androidNote", String(err?.message ?? err));
  setText("iosNote", "");
  setLink("androidBtn", "Android용 다운로드", "");
  setLink("iosBtn", "iOS용 다운로드", "");
}

try {
  const cfg = await loadTheme();
  applyTheme(cfg);
  wireGuides();
} catch (err) {
  applyError(err);
}
