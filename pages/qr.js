const summaryEl = document.getElementById("qr-measurement-summary");
const qrStatusEl = document.getElementById("qr-status");

const recommendationLink = document.getElementById("go-recommendation");
const brandSizesLink = document.getElementById("go-brand-sizes");
const searchLink = document.getElementById("go-search");

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

  if (data.length) items.push(`<div><strong>Measured length:</strong> ${data.length} mm</div>`);
  if (data.category) items.push(`<div><strong>Category:</strong> ${data.category}</div>`);
  if (data.lang) items.push(`<div><strong>Language:</strong> ${data.lang}</div>`);
  if (data.device) items.push(`<div><strong>Device:</strong> ${data.device}</div>`);
  if (data.source) items.push(`<div><strong>Source:</strong> ${data.source}</div>`);

  if (!items.length) {
    return "<p>No measurement parameters provided.</p>";
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

function initQrPage() {
  const data = getParams();

  summaryEl.innerHTML = formatSummary(data);
  buildForwardLinks(data);

  if (data.length || data.category || data.lang || data.device || data.source) {
    qrStatusEl.textContent = "QR parameters loaded successfully.";
  } else {
    qrStatusEl.textContent = "QR page opened without measurement parameters.";
  }
}

initQrPage();
