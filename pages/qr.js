const t = window.t;

const summaryEl = document.getElementById("qr-measurement-summary");
const qrStatusEl = document.getElementById("qr-status");

const recommendationLink = document.getElementById("go-recommendation");
const brandSizesLink = document.getElementById("go-brand-sizes");
const searchLink = document.getElementById("go-search");

const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_KEY = window.SUPABASE_KEY;

async function insertRow(table, payload) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Insert failed (${table}): ${response.status} ${text}`);
  }
}

function getParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    length: params.get("length"),
    category: params.get("category"),
    lang: params.get("lang"),
    device: params.get("device"),
    source: params.get("source")
  };
}

function formatSummary(data) {
  const items = [];

  if (data.length) items.push(`<div><strong>${t("common.measuredLength")}:</strong> ${data.length} mm</div>`);
  if (data.category) items.push(`<div><strong>${t("common.category")}:</strong> ${data.category}</div>`);
  if (data.lang) items.push(`<div><strong>Language:</strong> ${data.lang}</div>`);
  if (data.device) items.push(`<div><strong>${t("common.device")}:</strong> ${data.device}</div>`);
  if (data.source) items.push(`<div><strong>${t("common.source")}:</strong> ${data.source}</div>`);

  if (!items.length) {
    return `<p>${t("qr.summaryEmpty")}</p>`;
  }

  return `<div class="result-grid">${items.join("")}</div>`;
}

function buildForwardLinks(data) {
  const forwardParams = new URLSearchParams();

  if (data.length) forwardParams.set("length", data.length);
  if (data.category) forwardParams.set("category", data.category);
  if (data.lang) forwardParams.set("lang", data.lang);
  if (data.device) forwardParams.set("device", data.device);
  if (data.source) forwardParams.set("source", data.source);

  const query = forwardParams.toString();
  const suffix = query ? `?${query}` : "";

  recommendationLink.href = `recommend.html${suffix}`;
  brandSizesLink.href = `brand-sizes.html${suffix}`;
  searchLink.href = `search.html${suffix}`;
}

async function logQrScan(data) {
  try {
    await insertRow("qr_scans", {
      device_id: data.device || null,
      campaign: data.source || "qr-page",
      landing_page: window.location.pathname,
      user_agent: navigator.userAgent,
      country: null,
      region: null
    });
  } catch (error) {
    console.error("QR log error:", error);
  }
}

function initQrPage() {
  const data = getParams();

  summaryEl.innerHTML = formatSummary(data);
  buildForwardLinks(data);

  if (data.length || data.category || data.lang || data.device || data.source) {
    qrStatusEl.textContent = t("qr.statusLoaded");
  } else {
    qrStatusEl.textContent = t("qr.statusEmpty");
  }

  logQrScan(data);
}

initQrPage();
