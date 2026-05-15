const recommendButton = document.getElementById("recommend-button");
const categoryEl = document.getElementById("category");
const lengthEl = document.getElementById("length-mm");
const statusEl = document.getElementById("recommend-status");
const recommendSourceEl = document.getElementById("recommend-source");
const generalResultEl = document.getElementById("general-result");
const brandResultsEl = document.getElementById("brand-recommendations");
const continueActionsEl = document.getElementById("continue-actions");

const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_KEY = window.SUPABASE_KEY;

const generalSizeTables = {
  women: [
    { foot_length_mm: 228, eu: "35", us: "5", uk: "2.5", aus: "3.5", jap: "21", chn: "35.5", mex: "-", kor: "228" },
    { foot_length_mm: 231, eu: "35.5", us: "5.5", uk: "3", aus: "4", jap: "21.5", chn: "36", mex: "-", kor: "231" },
    { foot_length_mm: 235, eu: "36", us: "6", uk: "3.5", aus: "4.5", jap: "22", chn: "37", mex: "-", kor: "235" },
    { foot_length_mm: 238, eu: "37", us: "6.5", uk: "4", aus: "5", jap: "22.5", chn: "37.5", mex: "-", kor: "238" },
    { foot_length_mm: 241, eu: "37.5", us: "7", uk: "4.5", aus: "5.5", jap: "23", chn: "38", mex: "-", kor: "241" },
    { foot_length_mm: 245, eu: "38", us: "7.5", uk: "5", aus: "6", jap: "23.5", chn: "39", mex: "4.5", kor: "245" },
    { foot_length_mm: 248, eu: "38.5", us: "8", uk: "5.5", aus: "6.5", jap: "24", chn: "39.5", mex: "5", kor: "248" },
    { foot_length_mm: 251, eu: "39", us: "8.5", uk: "6", aus: "7", jap: "24.5", chn: "40", mex: "5.5", kor: "251" },
    { foot_length_mm: 254, eu: "40", us: "9", uk: "6.5", aus: "7.5", jap: "25", chn: "41", mex: "6", kor: "254" },
    { foot_length_mm: 257, eu: "41", us: "9.5", uk: "7", aus: "8", jap: "25.5", chn: "41.5", mex: "6.5", kor: "257" },
    { foot_length_mm: 260, eu: "42", us: "10", uk: "7.5", aus: "8.5", jap: "26", chn: "42", mex: "7", kor: "260" },
    { foot_length_mm: 267, eu: "43", us: "10.5", uk: "8", aus: "9", jap: "27", chn: "43", mex: "7.5", kor: "267" },
    { foot_length_mm: 273, eu: "44", us: "12", uk: "9.5", aus: "10.5", jap: "28", chn: "44.5", mex: "9", kor: "273" },
    { foot_length_mm: 279, eu: "45", us: "13", uk: "10.5", aus: "11.5", jap: "29", chn: "46", mex: "10", kor: "279" },
    { foot_length_mm: 286, eu: "46.5", us: "14", uk: "11.5", aus: "12.5", jap: "30", chn: "47", mex: "11", kor: "286" },
    { foot_length_mm: 292, eu: "48.5", us: "15.5", uk: "13", aus: "14", jap: "31", chn: "48", mex: "12.5", kor: "292" }
  ],
  men: [
    { foot_length_mm: 228, eu: "35", us: "3.5", uk: "3", aus: "3", jap: "21.5", chn: "35", mex: "-", kor: "228" },
    { foot_length_mm: 231, eu: "35.5", us: "4", uk: "3.5", aus: "3.5", jap: "22", chn: "36", mex: "-", kor: "231" },
    { foot_length_mm: 235, eu: "36", us: "4.5", uk: "4", aus: "4", jap: "22.5", chn: "37", mex: "-", kor: "235" },
    { foot_length_mm: 238, eu: "37", us: "5", uk: "4.5", aus: "4.5", jap: "23", chn: "38", mex: "4.5", kor: "238" },
    { foot_length_mm: 241, eu: "37.5", us: "5.5", uk: "5", aus: "5", jap: "23.5", chn: "39", mex: "5", kor: "241" },
    { foot_length_mm: 245, eu: "38", us: "6", uk: "5.5", aus: "5.5", jap: "24", chn: "39.5", mex: "5.5", kor: "245" },
    { foot_length_mm: 248, eu: "38.5", us: "6.5", uk: "6", aus: "6", jap: "24.5", chn: "40", mex: "6", kor: "248" },
    { foot_length_mm: 251, eu: "39", us: "7", uk: "6.5", aus: "6.5", jap: "25", chn: "41", mex: "6.5", kor: "251" },
    { foot_length_mm: 254, eu: "40", us: "7.5", uk: "7", aus: "7", jap: "25.5", chn: "-", mex: "7", kor: "254" },
    { foot_length_mm: 257, eu: "41", us: "8", uk: "7.5", aus: "7.5", jap: "26", chn: "42", mex: "7.5", kor: "257" },
    { foot_length_mm: 260, eu: "42", us: "8.5", uk: "8", aus: "8", jap: "26.5", chn: "43", mex: "9", kor: "260" },
    { foot_length_mm: 263, eu: "43", us: "9", uk: "8.5", aus: "8.5", jap: "27", chn: "43.5", mex: "-", kor: "263" },
    { foot_length_mm: 267, eu: "43.5", us: "9.5", uk: "9", aus: "9", jap: "27.5", chn: "44", mex: "10", kor: "267" },
    { foot_length_mm: 270, eu: "44", us: "10", uk: "9.5", aus: "9.5", jap: "28", chn: "44.5", mex: "-", kor: "270" },
    { foot_length_mm: 273, eu: "44.5", us: "10.5", uk: "10", aus: "10", jap: "28.5", chn: "45", mex: "11", kor: "273" },
    { foot_length_mm: 276, eu: "45", us: "11", uk: "10.5", aus: "10.5", jap: "29", chn: "46", mex: "-", kor: "276" },
    { foot_length_mm: 279, eu: "45.5", us: "11.5", uk: "11", aus: "11", jap: "29.5", chn: "-", mex: "12.5", kor: "279" },
    { foot_length_mm: 283, eu: "46", us: "12", uk: "11.5", aus: "11.5", jap: "30", chn: "47", mex: "-", kor: "283" },
    { foot_length_mm: 286, eu: "46.5", us: "12.5", uk: "12", aus: "12", jap: "30.5", chn: "47.5", mex: "-", kor: "286" },
    { foot_length_mm: 289, eu: "47", us: "13", uk: "12.5", aus: "12.5", jap: "31", chn: "48", mex: "-", kor: "289" },
    { foot_length_mm: 292, eu: "47.5", us: "13.5", uk: "13", aus: "13", jap: "31.5", chn: "-", mex: "-", kor: "292" }
  ],
  kids: [
    { foot_length_mm: 83, eu: "15.5", us: "0.5", uk: "0", aus: "0", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 89, eu: "16", us: "1", uk: "0.5", aus: "0.5", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 92, eu: "16.5", us: "1.5", uk: "1", aus: "1", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 95, eu: "17", us: "2", uk: "1", aus: "1", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 102, eu: "17.5", us: "2.5", uk: "1.5", aus: "1.5", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 105, eu: "18", us: "3", uk: "2", aus: "2", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 108, eu: "18.5", us: "3.5", uk: "2.5", aus: "2.5", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 114, eu: "19", us: "4", uk: "3", aus: "3", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 117, eu: "19.5", us: "4.5", uk: "3.5", aus: "3.5", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 121, eu: "20", us: "5", uk: "4", aus: "4", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 127, eu: "21", us: "5.5", uk: "4.5", aus: "4.5", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 130, eu: "22", us: "6", uk: "5", aus: "5", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 133, eu: "22.5", us: "6.5", uk: "5.5", aus: "5.5", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 140, eu: "23", us: "7", uk: "6", aus: "6", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 143, eu: "23.5", us: "7.5", uk: "6.5", aus: "6.5", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 146, eu: "24", us: "8", uk: "7", aus: "7", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 152, eu: "24.5", us: "8.5", uk: "7.5", aus: "7.5", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 156, eu: "25", us: "9", uk: "8", aus: "8", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 159, eu: "26", us: "9.5", uk: "8.5", aus: "8.5", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 165, eu: "27", us: "10", uk: "9", aus: "9", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 168, eu: "27.5", us: "10.5", uk: "9.5", aus: "9.5", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 171, eu: "28", us: "11", uk: "10", aus: "10", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 178, eu: "29", us: "11.5", uk: "10.5", aus: "10.5", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 181, eu: "30", us: "12", uk: "11", aus: "11", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 184, eu: "30.5", us: "12.5", uk: "11.5", aus: "11.5", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 191, eu: "31", us: "13", uk: "12", aus: "12", jap: "-", chn: "-", mex: "-", kor: "-" },
    { foot_length_mm: 194, eu: "31.5", us: "13.5", uk: "12.5", aus: "12.5", jap: "-", chn: "-", mex: "-", kor: "-" }
  ]
};

function nearestRow(rows, targetMm) {
  if (!rows.length) return null;

  let best = rows[0];
  let bestDiff = Math.abs(rows[0].foot_length_mm - targetMm);

  for (const row of rows) {
    const diff = Math.abs(row.foot_length_mm - targetMm);
    if (diff < bestDiff) {
      best = row;
      bestDiff = diff;
    }
  }

  return best;
}

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

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    length: params.get("length"),
    category: params.get("category"),
    lang: params.get("lang"),
    device: params.get("device"),
    source: params.get("source")
  };
}

function normalizeCategory(category) {
  if (!category) return "";

  const value = category.toLowerCase().trim();
  if (value === "men" || value === "women" || value === "kids") {
    return value;
  }

  return "";
}

function parseLength(value) {
  if (!value) return null;

  const normalized = String(value).replace(",", ".").trim();
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function applyUrlParamsToForm() {
  const params = getUrlParams();

  const parsedCategory = normalizeCategory(params.category);
  const parsedLength = parseLength(params.length);

  if (parsedCategory) {
    categoryEl.value = parsedCategory;
  }

  if (parsedLength !== null) {
    lengthEl.value = parsedLength;
  }

  if (recommendSourceEl) {
    const parts = [];
    if (params.source) parts.push(`Source: ${params.source}`);
    if (params.device) parts.push(`Device: ${params.device}`);
    if (params.lang) parts.push(`Language: ${params.lang}`);
    recommendSourceEl.textContent = parts.length ? parts.join(" | ") : "";
  }

  return {
    hasAutoData: !!parsedCategory && parsedLength !== null,
    parsedCategory,
    parsedLength
  };
}

function renderGeneralResult(row) {
  if (!row) {
    generalResultEl.innerHTML = "<p>No general recommendation found.</p>";
    return;
  }

  generalResultEl.innerHTML = `
    <div class="result-grid">
      <div><strong>EU:</strong> ${row.eu ?? ""}</div>
      <div><strong>US:</strong> ${row.us ?? ""}</div>
      <div><strong>UK:</strong> ${row.uk ?? ""}</div>
      <div><strong>AUS:</strong> ${row.aus ?? ""}</div>
      <div><strong>JAP:</strong> ${row.jap ?? ""}</div>
      <div><strong>CHN:</strong> ${row.chn ?? ""}</div>
      <div><strong>MEX:</strong> ${row.mex ?? ""}</div>
      <div><strong>KOR:</strong> ${row.kor ?? ""}</div>
    </div>
  `;
}

function renderContinueActions(category, row) {
  if (!continueActionsEl) return;

  if (!row) {
    continueActionsEl.innerHTML = "<p>No actions available.</p>";
    return;
  }

  const currentParams = new URLSearchParams(window.location.search);
  const source = currentParams.get("source");
  const device = currentParams.get("device");
  const lang = currentParams.get("lang");
  const length = parseLength(lengthEl.value);

  const searchParams = new URLSearchParams();
  searchParams.set("category", category);

  if (length !== null) {
    searchParams.set("length", String(length));
  }

  if (source) searchParams.set("source", source);
  if (device) searchParams.set("device", device);
  if (lang) searchParams.set("lang", lang);

  const brandParams = new URLSearchParams();
  brandParams.set("category", category);
  if (source) brandParams.set("source", source);
  if (device) brandParams.set("device", device);
  if (lang) brandParams.set("lang", lang);

  continueActionsEl.innerHTML = `
    <div class="action-grid">
      <a class="action-card" href="search.html?${searchParams.toString()}">
        <h3>Search shoes by brand recommendation</h3>
        <p>Open shoe search using manufacturer-specific recommended sizes.</p>
      </a>
      <a class="action-card" href="brand-sizes.html?${brandParams.toString()}">
        <h3>Open brand size tables</h3>
        <p>Compare manufacturer size tables for the selected category.</p>
      </a>
    </div>
  `;
}

function renderBrandResults(results) {
  if (!results.length) {
    brandResultsEl.innerHTML = "<p>No brand recommendations found.</p>";
    return;
  }

  brandResultsEl.innerHTML = results.map((item) => `
    <div class="brand-card">
      <h3>${item.brandName}</h3>
      <div class="result-grid">
        <div><strong>EU:</strong> ${item.row?.eu_size ?? ""}</div>
        <div><strong>US:</strong> ${item.row?.us_size ?? ""}</div>
        <div><strong>UK:</strong> ${item.row?.uk_size ?? ""}</div>
      </div>
    </div>
  `).join("");
}

async function loadBrandRecommendations(category, measuredLengthMm) {
  const brandTargetMm = measuredLengthMm + 20;

  const [brands, sizeCharts, sizeChartRows] = await Promise.all([
    fetchJson("brands?select=id,name&order=name.asc"),
    fetchJson(`size_charts?select=id,brand_id,category,region&category=eq.${category}&region=eq.global`),
    fetchJson("size_chart_rows?select=size_chart_id,foot_length_mm,eu_size,us_size,uk_size")
  ]);

  const wantedBrands = ["Nike", "Adidas", "New Balance"];
  const brandMap = new Map(brands.map((b) => [b.id, b.name]));

  const results = [];

  for (const chart of sizeCharts) {
    const brandName = brandMap.get(chart.brand_id);
    if (!wantedBrands.includes(brandName)) continue;

    const rows = sizeChartRows
      .filter((row) => row.size_chart_id === chart.id)
      .sort((a, b) => a.foot_length_mm - b.foot_length_mm);

    const row = nearestRow(rows, brandTargetMm);

    results.push({
      brandName,
      row
    });
  }

  results.sort((a, b) => a.brandName.localeCompare(b.brandName));
  return results;
}

async function logMeasurement(category, measuredLengthMm, generalRow) {
  try {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    const device = params.get("device");

    await insertRow("measurements", {
      language: lang === "lt" ? "lt" : "en",
      mode: category,
      measured_length_mm: measuredLengthMm,
      recommended_eu: generalRow?.eu ?? null,
      recommended_brand_id: null,
      device_id: device || null
    });
  } catch (error) {
    console.error("Measurement log error:", error);
  }
}

async function handleRecommendation() {
  try {
    const category = categoryEl.value;
    const measuredLengthMm = parseLength(lengthEl.value);

    if (measuredLengthMm === null) {
      statusEl.textContent = "Please enter a valid measured length in mm.";
      generalResultEl.innerHTML = "No result yet.";
      brandResultsEl.innerHTML = "No result yet.";
      if (continueActionsEl) {
        continueActionsEl.innerHTML = "No actions yet.";
      }
      return;
    }

    statusEl.textContent = "Calculating recommendation...";

    const generalTable = generalSizeTables[category];
    const generalRow = nearestRow(generalTable, measuredLengthMm);

    renderGeneralResult(generalRow);
    renderContinueActions(category, generalRow);

    const brandResults = await loadBrandRecommendations(category, measuredLengthMm);
    renderBrandResults(brandResults);

    await logMeasurement(category, measuredLengthMm, generalRow);

    statusEl.textContent = "Recommendation loaded successfully.";
  } catch (error) {
    console.error(error);
    statusEl.textContent = `Error: ${error.message}`;
  }
}

recommendButton.addEventListener("click", handleRecommendation);

window.addEventListener("DOMContentLoaded", async () => {
  const autoData = applyUrlParamsToForm();

  if (autoData.hasAutoData) {
    statusEl.textContent = "QR parameters detected. Loading recommendation automatically...";
    await handleRecommendation();
  }
});
