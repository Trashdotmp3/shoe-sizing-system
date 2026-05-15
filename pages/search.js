const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_KEY = window.SUPABASE_KEY;

const brandFilterEl = document.getElementById("brand-filter");
const categoryFilterEl = document.getElementById("category-filter");
const sizeFilterEl = document.getElementById("size-filter");
const modelFilterEl = document.getElementById("model-filter");
const searchButtonEl = document.getElementById("search-button");
const searchStatusEl = document.getElementById("search-status");
const searchSourceEl = document.getElementById("search-source");
const searchResultsEl = document.getElementById("search-results");

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
    brand: params.get("brand"),
    category: params.get("category"),
    eu: params.get("eu"),
    model: params.get("model"),
    length: params.get("length"),
    source: params.get("source"),
    device: params.get("device"),
    lang: params.get("lang")
  };
}

function normalizeCategory(category) {
  if (!category) return "";

  const value = category.toLowerCase().trim();
  if (["men", "women", "kids", "unisex"].includes(value)) {
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

function nearestRow(rows, targetMm) {
  if (!rows.length) return null;

  let best = rows[0];
  let bestDiff = Math.abs(Number(rows[0].foot_length_mm) - targetMm);

  for (const row of rows) {
    const diff = Math.abs(Number(row.foot_length_mm) - targetMm);
    if (diff < bestDiff) {
      best = row;
      bestDiff = diff;
    }
  }

  return best;
}

async function loadBrandsIntoFilter() {
  const brands = await fetchJson("brands?select=id,name&order=name.asc");

  brands.forEach((brand) => {
    const option = document.createElement("option");
    option.value = String(brand.id);
    option.textContent = brand.name;
    brandFilterEl.appendChild(option);
  });

  return brands;
}

function renderResults(items) {
  if (!items.length) {
    searchResultsEl.innerHTML = "<p>No matching shoes found.</p>";
    return;
  }

  searchResultsEl.innerHTML = items.map((item) => `
    <div class="brand-card">
      <h3>${item.brandName} - ${item.modelName}</h3>
      <div class="result-grid">
        <div><strong>Category:</strong> ${item.category ?? ""}</div>
        <div><strong>Color:</strong> ${item.color ?? ""}</div>
        <div><strong>EU:</strong> ${item.eu_size ?? ""}</div>
        <div><strong>US:</strong> ${item.us_size ?? ""}</div>
        <div><strong>UK:</strong> ${item.uk_size ?? ""}</div>
      </div>
      <p><a href="${item.product_url}" target="_blank" rel="noopener noreferrer">Open product page</a></p>
    </div>
  `).join("");
}

async function logSearch(queryText, filters, resultsCount) {
  try {
    await insertRow("search_logs", {
      query_text: queryText || null,
      filters_json: filters,
      results_count: resultsCount
    });
  } catch (error) {
    console.error("Search log error:", error);
  }
}

async function getBrandRecommendedEuMap(category, measuredLengthMm) {
  const targetMm = measuredLengthMm + 20;

  const [brands, sizeCharts, sizeChartRows] = await Promise.all([
    fetchJson("brands?select=id,name"),
    fetchJson(`size_charts?select=id,brand_id,category,region&category=eq.${category}&region=eq.global`),
    fetchJson("size_chart_rows?select=size_chart_id,foot_length_mm,eu_size")
  ]);

  const brandMap = new Map(brands.map((b) => [b.id, b.name]));
  const result = new Map();

  for (const chart of sizeCharts) {
    const brandName = brandMap.get(chart.brand_id);
    if (!brandName) continue;

    const rows = sizeChartRows
      .filter((row) => row.size_chart_id === chart.id)
      .sort((a, b) => Number(a.foot_length_mm) - Number(b.foot_length_mm));

    const row = nearestRow(rows, targetMm);

    if (row && row.eu_size) {
      result.set(brandName, String(row.eu_size).trim());
    }
  }

  return result;
}

async function runSearch() {
  try {
    searchStatusEl.textContent = "Searching...";
    searchResultsEl.innerHTML = "";

    const params = getUrlParams();
    const lengthFromUrl = parseLength(params.length);

    const [brands, shoeModels, merchants, products] = await Promise.all([
      fetchJson("brands?select=id,name"),
      fetchJson("shoe_models?select=id,brand_id,model_name,category,is_active"),
      fetchJson("merchants?select=id,name"),
      fetchJson("products?select=id,shoe_model_id,merchant_id,color,eu_size,us_size,uk_size,price,currency,product_url,stock_status")
    ]);

    const brandMap = new Map(brands.map((b) => [b.id, b.name]));
    const merchantMap = new Map(merchants.map((m) => [m.id, m.name]));

    const selectedBrandId = brandFilterEl.value.trim();
    const selectedCategory = categoryFilterEl.value.trim().toLowerCase();
    const sizeFilter = sizeFilterEl.value.trim().toLowerCase();
    const modelFilter = modelFilterEl.value.trim().toLowerCase();

    const activeModels = shoeModels.filter((model) => model.is_active);

    const filteredModels = activeModels.filter((model) => {
      if (selectedBrandId && String(model.brand_id) !== selectedBrandId) {
        return false;
      }

      if (selectedCategory && (model.category || "").toLowerCase() !== selectedCategory) {
        return false;
      }

      if (modelFilter && !(model.model_name || "").toLowerCase().includes(modelFilter)) {
        return false;
      }

      return true;
    });

    const modelMap = new Map(filteredModels.map((m) => [m.id, m]));

    let brandRecommendedEuMap = null;

    if (lengthFromUrl !== null && selectedCategory && ["men", "women", "kids"].includes(selectedCategory)) {
      brandRecommendedEuMap = await getBrandRecommendedEuMap(selectedCategory, lengthFromUrl);
    }

    const filteredProducts = products
      .filter((product) => modelMap.has(product.shoe_model_id))
      .filter((product) => {
        const model = modelMap.get(product.shoe_model_id);
        const brandName = brandMap.get(model.brand_id) || "";

        if (brandRecommendedEuMap) {
          const recommendedEu = brandRecommendedEuMap.get(brandName);
          if (!recommendedEu) return false;
          return String(product.eu_size || "").trim().toLowerCase() === recommendedEu.trim().toLowerCase();
        }

        if (sizeFilter && !(product.eu_size || "").toLowerCase().includes(sizeFilter)) {
          return false;
        }

        return true;
      })
      .map((product) => {
        const model = modelMap.get(product.shoe_model_id);
        return {
          brandName: brandMap.get(model.brand_id) || "",
          modelName: model.model_name || "",
          category: model.category || "",
          merchantName: merchantMap.get(product.merchant_id) || "",
          color: product.color,
          eu_size: product.eu_size,
          us_size: product.us_size,
          uk_size: product.uk_size,
          price: product.price,
          currency: product.currency,
          product_url: product.product_url,
          stock_status: product.stock_status
        };
      });

    filteredProducts.sort((a, b) => {
      const brandCompare = a.brandName.localeCompare(b.brandName);
      if (brandCompare !== 0) return brandCompare;
      return a.modelName.localeCompare(b.modelName);
    });

    renderResults(filteredProducts);

    await logSearch(
      modelFilter || sizeFilter || selectedCategory || selectedBrandId || "manual-search",
      {
        brand_id: selectedBrandId || null,
        category: selectedCategory || null,
        eu_size: sizeFilter || null,
        model_name: modelFilter || null,
        measured_length_mm: lengthFromUrl,
        brand_specific_search: !!brandRecommendedEuMap
      },
      filteredProducts.length
    );

    if (brandRecommendedEuMap) {
      searchStatusEl.textContent = `Found ${filteredProducts.length} result(s) using brand-specific recommended sizes.`;
    } else {
      searchStatusEl.textContent = `Found ${filteredProducts.length} result(s).`;
    }
  } catch (error) {
    console.error(error);
    searchStatusEl.textContent = `Search error: ${error.message}`;
  }
}

function applyUrlParams(brands) {
  const params = getUrlParams();

  const normalizedCategory = normalizeCategory(params.category);
  if (normalizedCategory) {
    categoryFilterEl.value = normalizedCategory;
  }

  if (params.eu) {
    sizeFilterEl.value = params.eu;
  }

  if (params.model) {
    modelFilterEl.value = params.model;
  }

  if (params.brand) {
    const brandMatch = brands.find(
      (brand) => brand.name.toLowerCase() === params.brand.toLowerCase().trim()
    );
    if (brandMatch) {
      brandFilterEl.value = String(brandMatch.id);
    }
  }

  const parts = [];
  if (params.source) parts.push(`Source: ${params.source}`);
  if (params.device) parts.push(`Device: ${params.device}`);
  if (params.lang) parts.push(`Language: ${params.lang}`);
  if (params.length) parts.push(`Measured length: ${params.length} mm`);

  searchSourceEl.textContent = parts.length ? parts.join(" | ") : "";

  return !!(normalizedCategory || params.eu || params.model || params.brand || params.length);
}

searchButtonEl.addEventListener("click", runSearch);

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const brands = await loadBrandsIntoFilter();
    const shouldAutoSearch = applyUrlParams(brands);

    if (shouldAutoSearch) {
      searchStatusEl.textContent = "URL parameters detected. Running search automatically...";
      await runSearch();
    }
  } catch (error) {
    console.error(error);
    searchStatusEl.textContent = `Error loading brands: ${error.message}`;
  }
});
