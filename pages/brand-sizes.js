const t = window.t;
const tf = window.tf;

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
  note.textContent = t("brands.note");
  section.appendChild(note);

  if (!rows.length) {
    const empty = document.createElement("p");
    empty.textContent = t("brands.noData");
    section.appendChild(empty);
    return section;
  }

  const table = document.createElement("table");
  table.className = "size-table";

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>${t("brands.recommendedLength")}</th>
      <th>${t("common.eu")}</th>
      <th>${t("common.us")}</th>
      <th>${t("common.uk")}</th>
      <th>${t("common.aus")}</th>
      <th>${t("common.jp")}</th>
      <th>${t("common.cn")}</th>
      <th>${t("common.mx")}</th>
      <th>${t("common.kr")}</th>
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
    statusEl.textContent = t("brands.statusLoading");
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

    const categoryLabel =
      selectedCategory === "men" ? t("common.men") :
      selectedCategory === "women" ? t("common.women") :
      t("common.kids");

    statusEl.textContent = tf("brands.statusLoaded", {
      count: chartsWithRows.length,
      category: categoryLabel
    });
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
  if (params.source) parts.push(`${t("common.source")}: ${params.source}`);
  if (params.device) parts.push(`${t("common.device")}: ${params.device}`);
  if (params.lang) parts.push(`Language: ${params.lang}`);

  sourceEl.textContent = parts.length ? parts.join(" | ") : "";

  return { hasCategory: !!category };
}

loadButton.addEventListener("click", loadBrandSizes);

window.addEventListener("DOMContentLoaded", async () => {
  const info = applyUrlParams();

  if (info.hasCategory) {
    statusEl.textContent = t("brands.statusAuto");
    await loadBrandSizes();
  }
});
