const t = window.t;

const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_KEY = window.SUPABASE_KEY;

const loadStatsButton = document.getElementById("load-stats-button");
const statsStatusEl = document.getElementById("stats-status");
const statsOverviewEl = document.getElementById("stats-overview");
const statsModesEl = document.getElementById("stats-modes");
const statsSizesEl = document.getElementById("stats-sizes");
const statsSearchesEl = document.getElementById("stats-searches");

async function fetchJson(path) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return response.json();
}

function countBy(items, key) {
  const map = new Map();

  for (const item of items) {
    const value = item[key] ?? "unknown";
    map.set(value, (map.get(value) || 0) + 1);
  }

  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function translateModeLabel(label) {
  if (label === "men") return t("common.men");
  if (label === "women") return t("common.women");
  if (label === "kids") return t("common.kids");
  return label;
}

function renderSimpleList(target, items, emptyText) {
  if (!items.length) {
    target.innerHTML = `<p>${emptyText}</p>`;
    return;
  }

  target.innerHTML = `
    <ul>
      ${items.map(item => `<li><strong>${translateModeLabel(item.label)}</strong>: ${item.count}</li>`).join("")}
    </ul>
  `;
}

function renderOverview(measurements, qrScans, searchLogs) {
  statsOverviewEl.innerHTML = `
    <div class="result-grid">
      <div><strong>${t("stats.totalMeasurements")}:</strong> ${measurements.length}</div>
      <div><strong>${t("stats.totalQrScans")}:</strong> ${qrScans.length}</div>
      <div><strong>${t("stats.totalSearches")}:</strong> ${searchLogs.length}</div>
    </div>
  `;
}

function renderRecentSearches(searchLogs) {
  if (!searchLogs.length) {
    statsSearchesEl.innerHTML = `<p>${t("stats.noSearchData")}</p>`;
    return;
  }

  const recent = [...searchLogs].slice(0, 5);

  statsSearchesEl.innerHTML = recent.map(item => `
    <div class="brand-card">
      <div><strong>${t("stats.query")}:</strong> ${item.query_text ?? ""}</div>
      <div><strong>${t("stats.results")}:</strong> ${item.results_count ?? 0}</div>
    </div>
  `).join("");
}

async function loadStatistics() {
  try {
    statsStatusEl.textContent = t("stats.statusLoading");

    const [measurements, qrScans, searchLogs] = await Promise.all([
      fetchJson("measurements?select=created_at,language,mode,measured_length_mm,recommended_eu&order=created_at.desc"),
      fetchJson("qr_scans?select=created_at,device_id,campaign,landing_page,country,region&order=created_at.desc"),
      fetchJson("search_logs?select=query_text,results_count&order=created_at.desc")
    ]);

    renderOverview(measurements, qrScans, searchLogs);

    const modeCounts = countBy(measurements, "mode");
    renderSimpleList(statsModesEl, modeCounts, t("stats.noData"));

    const sizeCounts = countBy(measurements, "recommended_eu").slice(0, 10);
    renderSimpleList(statsSizesEl, sizeCounts, t("stats.noData"));

    renderRecentSearches(searchLogs);

    statsStatusEl.textContent = t("stats.statusSuccess");
  } catch (error) {
    console.error(error);
    statsStatusEl.textContent = `Error loading statistics: ${error.message}`;
  }
}

loadStatsButton.addEventListener("click", loadStatistics);

window.addEventListener("languageChanged", () => {
  location.reload();
});
