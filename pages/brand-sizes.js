const statusEl = document.getElementById("brand-status");
const sourceEl = document.getElementById("brand-source");
const resultsEl = document.getElementById("brand-results");
const categorySelect = document.getElementById("category-select");
const loadButton = document.getElementById("load-sizes-button");

const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_KEY = window.SUPABASE_KEY;

function getRecommendedFootLength(rowLengthMm) {
  const value = Number(rowLengthMm);
  if (!Number.isFinite(value)) return "";
  return Math.max(0, value - 20);
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

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);

  return {
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

function createTable(title, rows) {
  const section = document.createElement("section");
  section.className = "card";

  const heading = document.createElement("h2");
  heading.textContent = title;
  section.appendChild(heading);

  const note = document.createElement("p");
  note.textContent = "Displayed length is adjusted for recommendation with 20 mm comfort allowance.";
  section.appendChild(note);

  if (!rows.length) {
    const empty = document.createElement("p");
    empty.textContent = "No data found.";
    section.appendChild(empty);
    return section;
  }

  const table = document.createElement("table");
  table.className = "size-table";

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Recommended foot length (mm)</th>
      <th>EU</th>
      <th>US</th>
      <th>UK</th>
      <th>AUS</th>
      <th>JP</th>
      <th>CN</th>
      <th>MX</th>
      <th>KR</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  rows.forEach((row) => {
    const recommendedLength = getRecommendedFootLength(row.foot_length_mm);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${recommendedLength}</td>
      <td>${row.eu_size ?? ""}</td>
      <td>${row.us_size ?? ""}</td>
      <td>${row.uk_size ?? ""}</td>
      <td>${row.aus_size ?? ""}</td>
      <td>${row.jp_size ?? ""}</td>
      <td>${row.cn_size ?? ""}</td>
      <td>${row.mx_size ?? ""}</td>
      <td>${row.kr_size ?? ""}</td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  section.appendChild(table);

  return section;
}

async function loadBrandSizes() {
  try {
    statusEl.textContent = "Loading data from Supabase...";
    resultsEl.innerHTML = "";

    const selectedCategory = categorySelect.value;

    const [brands, sizeCharts, sizeChartRows] = await Promise.all([
      fetchJson("brands?select=id,name&order=name.asc"),
      fetchJson(`size_charts?select=id,brand_id,category,region&category=eq.${selectedCategory}&region=eq.global`),
      fetchJson("size_chart_rows?select=size_chart_id,foot_length_mm,eu_size,us_size,uk_size,aus_size,jp_size,cn_size,mx_size,kr_size&order=foot_length_mm.asc")
    ]);

    const brandMap = new Map(brands.map((b) => [b.id, b.name]));

    const chartsWithRows = sizeCharts.map((chart) => {
      const rows = sizeChartRows.filter((row) => row.size_chart_id === chart.id);
      return {
        brandName: brandMap.get(chart.brand_id) || `Brand ${chart.brand_id}`,
        rows
      };
    });

    chartsWithRows.sort((a, b) => a.brandName.localeCompare(b.brandName));

    chartsWithRows.forEach((item) => {
      resultsEl.appendChild(createTable(item.brandName, item.rows));
    });

    statusEl.textContent = `Loaded ${chartsWithRows.length} recommended brand size tables with 20 mm allowance for "${selectedCategory}".`;
  } catch (error) {
    console.error(error);
    statusEl.textContent = `Error loading data: ${error.message}`;
  }
}

function applyUrlParams() {
  const params = getUrlParams();
  const category = normalizeCategory(params.category);

  if (category) {
    categorySelect.value = category;
  }

  const parts = [];
  if (params.source) parts.push(`Source: ${params.source}`);
  if (params.device) parts.push(`Device: ${params.device}`);
  if (params.lang) parts.push(`Language: ${params.lang}`);

  sourceEl.textContent = parts.length ? parts.join(" | ") : "";

  return { hasCategory: !!category };
}

loadButton.addEventListener("click", loadBrandSizes);

window.addEventListener("DOMContentLoaded", async () => {
  const info = applyUrlParams();

  if (info.hasCategory) {
    statusEl.textContent = "URL parameters detected. Loading brand size tables automatically...";
    await loadBrandSizes();
  }
});
