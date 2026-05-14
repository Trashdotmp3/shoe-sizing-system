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

function renderSimpleList(target, items, emptyText) {
  if (!items.length) {
    target.innerHTML = `<p>${emptyText}</p>`;
    return;
  }

  target.innerHTML = `
    <ul>
      ${items.map(item => `<li><strong>${item.label}</strong>: ${item.count}</li>`).join("")}
    </ul>
  `;
}

function renderOverview(measurements, qrScans, searchLogs) {
  statsOverviewEl.innerHTML = `
    <div class="result-grid">
      <div><strong>Total measurements:</strong> ${measurements.length}</div>
      <div><strong>Total QR scans:</strong> ${qrScans.length}</div>
      <div><strong>Total searches:</strong> ${searchLogs.length}</div>
    </div>
  `;
}

function renderRecentSearches(searchLogs) {
  if (!searchLogs.length) {
    statsSearchesEl.innerHTML = "<p>No search data found.</p>";
    return;
  }

  const recent = [...searchLogs].slice(0, 5);

  statsSearchesEl.innerHTML = recent.map(item => `
    <div class="brand-card">
      <div><strong>Query:</strong> ${item.query_text ?? ""}</div>
      <div><strong>Results:</strong> ${item.results_count ?? 0}</div>
      <div><strong>Time:</strong> ${item.created_at ?? ""}</div>
    </div>
  `).join("");
}

async function loadStatistics() {
  try {
    statsStatusEl.textContent = "Loading statistics...";

    const [measurements, qrScans, searchLogs] = await Promise.all([
      fetchJson("measurements?select=created_at,language,mode,measured_length_mm,recommended_eu&order=created_at.desc"),
      fetchJson("qr_scans?select=created_at,device_id,campaign,landing_page,country,region&order=created_at.desc"),
      fetchJson("search_logs?select=created_at,query_text,results_count&order=created_at.desc")
    ]);

    renderOverview(measurements, qrScans, searchLogs);

    const modeCounts = countBy(measurements, "mode");
    renderSimpleList(statsModesEl, modeCounts, "No measurement mode data found.");

    const sizeCounts = countBy(measurements, "recommended_eu").slice(0, 10);
    renderSimpleList(statsSizesEl, sizeCounts, "No size recommendation data found.");

    renderRecentSearches(searchLogs);

    statsStatusEl.textContent = "Statistics loaded successfully.";
  } catch (error) {
    console.error(error);
    statsStatusEl.textContent = `Error loading statistics: ${error.message}`;
  }
}

loadStatsButton.addEventListener("click", loadStatistics);
