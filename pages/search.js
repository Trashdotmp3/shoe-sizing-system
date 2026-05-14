const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_KEY = window.SUPABASE_KEY;

const brandFilterEl = document.getElementById("brand-filter");
const categoryFilterEl = document.getElementById("category-filter");
const sizeFilterEl = document.getElementById("size-filter");
const modelFilterEl = document.getElementById("model-filter");
const searchButtonEl = document.getElementById("search-button");
const searchStatusEl = document.getElementById("search-status");
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

async function loadBrandsIntoFilter() {
  try {
    const brands = await fetchJson("brands?select=id,name&order=name.asc");

    brands.forEach((brand) => {
      const option = document.createElement("option");
      option.value = String(brand.id);
      option.textContent = brand.name;
      brandFilterEl.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    searchStatusEl.textContent = `Error loading brands: ${error.message}`;
  }
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
        <div><strong>Price:</strong> ${item.price != null ? `${item.price} ${item.currency ?? ""}` : ""}</div>
        <div><strong>Merchant:</strong> ${item.merchantName ?? ""}</div>
        <div><strong>Status:</strong> ${item.stock_status ?? ""}</div>
      </div>
      <p><a href="${item.product_url}" target="_blank" rel="noopener noreferrer">Open product page</a></p>
    </div>
  `).join("");
}

async function runSearch() {
  try {
    searchStatusEl.textContent = "Searching...";
    searchResultsEl.innerHTML = "";

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

    const filteredProducts = products
      .filter((product) => modelMap.has(product.shoe_model_id))
      .filter((product) => {
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
    searchStatusEl.textContent = `Found ${filteredProducts.length} result(s).`;
  } catch (error) {
    console.error(error);
    searchStatusEl.textContent = `Search error: ${error.message}`;
  }
}

searchButtonEl.addEventListener("click", runSearch);

loadBrandsIntoFilter();
