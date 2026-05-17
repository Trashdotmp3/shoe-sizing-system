(function () {
  const translations = {
    en: {
      nav: {
        home: "Home",
        recommendation: "Recommendation",
        brandSizes: "Brand Sizes",
        qrPage: "QR Page",
        search: "Search",
        statistics: "Statistics"
      },
      common: {
        men: "Men",
        women: "Women",
        kids: "Kids",
        unisex: "Unisex",
        allBrands: "All brands",
        allCategories: "All categories",
        eu: "EU",
        us: "US",
        uk: "UK",
        aus: "AUS",
        jp: "JAP",
        cn: "CHN",
        mx: "MEX",
        kr: "KOR",
        category: "Category",
        color: "Color",
        results: "Results",
        openProductPage: "Open product page",
        source: "Source",
        device: "Device",
        measuredLength: "Measured length"
      },
      home: {
        title: "Automatic Shoe Sizing System",
        subtitle: "A web platform for shoe size recommendation, brand size comparison, and shoe search.",
        aboutTitle: "About",
        aboutText: "This website is part of an automatic shoe sizing system. It helps users get a shoe size recommendation, compare sizes across brands, and search for suitable shoes.",
        functionsTitle: "Main functions",
        func1: "Shoe size recommendation",
        func2: "Brand size comparison",
        func3: "QR code landing page",
        func4: "Shoe search",
        func5: "Statistics overview"
      },
      recommend: {
        title: "Size Recommendation",
        subtitle: "Find general and brand-specific size recommendations",
        enterTitle: "Enter measurement",
        categoryLabel: "Category",
        lengthLabel: "Measured length (mm)",
        lengthPlaceholder: "e.g. 275",
        button: "Get recommendation",
        statusReady: "Ready.",
        statusCalculating: "Calculating recommendation...",
        statusSuccess: "Recommendation loaded successfully.",
        statusInvalid: "Please enter a valid measured length in mm.",
        generalTitle: "General recommendation",
        generalEmpty: "No result yet.",
        brandTitle: "Brand recommendations",
        brandNote: "Brand sizes are calculated using measured length + 20 mm for comfort allowance.",
        brandEmpty: "No result yet.",
        continueTitle: "Continue",
        continueEmpty: "No actions yet.",
        continueSearchTitle: "Search shoes by brand recommendation",
        continueSearchText: "Open shoe search using manufacturer-specific recommended sizes.",
        continueBrandsTitle: "Open brand size tables",
        continueBrandsText: "Compare manufacturer size tables for the selected category.",
        noGeneral: "No general recommendation found.",
        noBrand: "No brand recommendations found."
      },
      brands: {
        title: "Brand Sizes",
        subtitle: "Manufacturer size tables loaded from Supabase",
        chooseTitle: "Choose category",
        categoryLabel: "Category",
        loadButton: "Load brand sizes",
        statusReady: "Ready to load data.",
        statusLoading: "Loading data from Supabase...",
        statusAuto: "URL parameters detected. Loading brand size tables automatically...",
        statusLoaded: "Loaded {count} recommended brand size tables with 20 mm allowance for \"{category}\".",
        note: "Displayed length is adjusted for recommendation with 20 mm comfort allowance.",
        noData: "No data found.",
        recommendedLength: "Recommended foot length (mm)"
      },
      qr: {
        title: "QR Landing Page",
        subtitle: "QR landing page for measurement results and further actions",
        welcomeTitle: "Welcome",
        welcomeText: "This page is opened after scanning the QR code from the automatic shoe sizing system. Here the user can continue to recommendation, compare brand sizes, and search for shoes.",
        summaryTitle: "Measurement summary",
        summaryEmpty: "No measurement parameters provided.",
        nextTitle: "Next actions",
        recommendationTitle: "Recommendation",
        recommendationText: "View general and brand-specific size recommendation.",
        brandSizesTitle: "Brand Sizes",
        brandSizesText: "Compare manufacturer shoe size tables.",
        searchTitle: "Shoe Search",
        searchText: "Search shoes by brand, model, and size.",
        aboutTitle: "About QR integration",
        aboutText: "The QR code can later redirect users directly to this page with measurement parameters, for example foot length, selected category, device ID, or language.",
        statusReady: "QR landing page ready.",
        statusLoaded: "QR parameters loaded successfully.",
        statusEmpty: "QR page opened without measurement parameters."
      },
      stats: {
        title: "Statistics",
        subtitle: "Collected measurement, QR, and search statistics",
        loadTitle: "Load statistics",
        loadButton: "Load statistics",
        statusReady: "Ready.",
        statusLoading: "Loading statistics...",
        statusSuccess: "Statistics loaded successfully.",
        overviewTitle: "Overview",
        measurementsByModeTitle: "Measurements by category",
        commonSizesTitle: "Most common recommended EU sizes",
        recentSearchesTitle: "Recent searches",
        noData: "No data loaded yet.",
        noSearchData: "No search data found.",
        totalMeasurements: "Total measurements",
        totalQrScans: "Total QR scans",
        totalSearches: "Total searches",
        query: "Query",
        results: "Results"
      },
      search: {
        title: "Shoe Search",
        subtitle: "Search shoes by brand, model, and size",
        filtersTitle: "Search filters",
        brandLabel: "Brand",
        categoryLabel: "Category",
        sizeLabel: "EU size",
        sizePlaceholder: "e.g. 44",
        modelLabel: "Model name",
        modelPlaceholder: "e.g. Air Max",
        button: "Search shoes",
        statusReady: "Ready.",
        statusSearching: "Searching...",
        statusAuto: "URL parameters detected. Running search automatically...",
        statusFound: "Found {count} result(s).",
        statusFoundBrand: "Found {count} result(s) using brand-specific recommended sizes.",
        noResults: "No matching shoes found.",
        noSearch: "No search performed yet."
      }
    },
    lt: {
      nav: {
        home: "Pradžia",
        recommendation: "Rekomendacija",
        brandSizes: "Gamintojų dydžiai",
        qrPage: "QR puslapis",
        search: "Paieška",
        statistics: "Statistika"
      },
      common: {
        men: "Vyrai",
        women: "Moterys",
        kids: "Vaikai",
        unisex: "Unisex",
        allBrands: "Visi gamintojai",
        allCategories: "Visos kategorijos",
        eu: "EU",
        us: "US",
        uk: "UK",
        aus: "AUS",
        jp: "JAP",
        cn: "CHN",
        mx: "MEX",
        kr: "KOR",
        category: "Kategorija",
        color: "Spalva",
        results: "Rezultatai",
        openProductPage: "Atidaryti produkto puslapį",
        source: "Šaltinis",
        device: "Įrenginys",
        measuredLength: "Išmatuotas ilgis"
      },
      home: {
        title: "Automatinė avalynės dydžio nustatymo sistema",
        subtitle: "Internetinė platforma avalynės dydžio rekomendacijai, gamintojų dydžių palyginimui ir batų paieškai.",
        aboutTitle: "Apie sistemą",
        aboutText: "Ši svetainė yra automatinės avalynės dydžio nustatymo sistemos dalis. Ji padeda gauti dydžio rekomendaciją, palyginti skirtingų gamintojų dydžius ir rasti tinkamus batus.",
        functionsTitle: "Pagrindinės funkcijos",
        func1: "Avalynės dydžio rekomendacija",
        func2: "Gamintojų dydžių palyginimas",
        func3: "QR kodo nukreipimo puslapis",
        func4: "Batų paieška",
        func5: "Statistikos peržiūra"
      },
      recommend: {
        title: "Dydžio rekomendacija",
        subtitle: "Gauk bendrą ir gamintojų dydžių rekomendaciją",
        enterTitle: "Įvesk matavimą",
        categoryLabel: "Kategorija",
        lengthLabel: "Išmatuotas ilgis (mm)",
        lengthPlaceholder: "pvz. 275",
        button: "Gauti rekomendaciją",
        statusReady: "Pasiruošta.",
        statusCalculating: "Skaičiuojama rekomendacija...",
        statusSuccess: "Rekomendacija sėkmingai parodyta.",
        statusInvalid: "Įvesk tinkamą ilgį milimetrais.",
        generalTitle: "Bendra rekomendacija",
        generalEmpty: "Rezultato dar nėra.",
        brandTitle: "Gamintojų rekomendacijos",
        brandNote: "Gamintojų dydžiai skaičiuojami pagal išmatuotą ilgį + 20 mm patogumo laisvumui.",
        brandEmpty: "Rezultato dar nėra.",
        continueTitle: "Tęsti",
        continueEmpty: "Veiksmų dar nėra.",
        continueSearchTitle: "Ieškoti batų pagal gamintojų rekomendaciją",
        continueSearchText: "Atidaryti batų paiešką pagal gamintojų rekomenduojamus dydžius.",
        continueBrandsTitle: "Atidaryti gamintojų dydžių lenteles",
        continueBrandsText: "Palyginti gamintojų dydžių lenteles pasirinktai kategorijai.",
        noGeneral: "Bendra rekomendacija nerasta.",
        noBrand: "Gamintojų rekomendacijų nerasta."
      },
      brands: {
        title: "Gamintojų dydžiai",
        subtitle: "Gamintojų dydžių lentelės iš Supabase duomenų bazės",
        chooseTitle: "Pasirink kategoriją",
        categoryLabel: "Kategorija",
        loadButton: "Įkelti dydžių lenteles",
        statusReady: "Pasiruošta įkelti duomenis.",
        statusLoading: "Kraunami duomenys iš Supabase...",
        statusAuto: "Aptikti URL parametrai. Lentelės kraunamos automatiškai...",
        statusLoaded: "Įkelta {count} rekomenduojamų gamintojų lentelių su 20 mm laisvumu kategorijai „{category}“.",
        note: "Rodomas ilgis jau perskaičiuotas rekomendacijai su 20 mm patogumo laisvumu.",
        noData: "Duomenų nerasta.",
        recommendedLength: "Rekomenduojamas pėdos ilgis (mm)"
      },
      qr: {
        title: "QR nukreipimo puslapis",
        subtitle: "QR puslapis matavimo rezultatams ir tolimesniems veiksmams",
        welcomeTitle: "Sveiki",
        welcomeText: "Šis puslapis atidaromas nuskaičius QR kodą iš automatinės avalynės dydžio nustatymo sistemos. Čia galima pereiti prie rekomendacijos, palyginti gamintojų dydžius ir ieškoti batų.",
        summaryTitle: "Matavimo santrauka",
        summaryEmpty: "Matavimo parametrų nepateikta.",
        nextTitle: "Tolimesni veiksmai",
        recommendationTitle: "Rekomendacija",
        recommendationText: "Peržiūrėti bendrą ir gamintojų dydžių rekomendaciją.",
        brandSizesTitle: "Gamintojų dydžiai",
        brandSizesText: "Palyginti gamintojų dydžių lenteles.",
        searchTitle: "Batų paieška",
        searchText: "Ieškoti batų pagal gamintoją, modelį ir dydį.",
        aboutTitle: "Apie QR integraciją",
        aboutText: "QR kodas vėliau gali nukreipti tiesiai į šį puslapį su matavimo parametrais, pavyzdžiui, pėdos ilgiu, pasirinkta kategorija, įrenginio ID ar kalba.",
        statusReady: "QR puslapis paruoštas.",
        statusLoaded: "QR parametrai sėkmingai įkelti.",
        statusEmpty: "QR puslapis atidarytas be matavimo parametrų."
      },
      stats: {
        title: "Statistika",
        subtitle: "Sukaupta matavimų, QR ir paieškų statistika",
        loadTitle: "Įkelti statistiką",
        loadButton: "Įkelti statistiką",
        statusReady: "Pasiruošta.",
        statusLoading: "Kraunama statistika...",
        statusSuccess: "Statistika sėkmingai įkelta.",
        overviewTitle: "Apžvalga",
        measurementsByModeTitle: "Matavimai pagal kategoriją",
        commonSizesTitle: "Dažniausiai rekomenduojami EU dydžiai",
        recentSearchesTitle: "Naujausios paieškos",
        noData: "Duomenys dar neįkelti.",
        noSearchData: "Paieškos duomenų nerasta.",
        totalMeasurements: "Iš viso matavimų",
        totalQrScans: "Iš viso QR nuskaitymų",
        totalSearches: "Iš viso paieškų",
        query: "Užklausa",
        results: "Rezultatai"
      },
      search: {
        title: "Batų paieška",
        subtitle: "Ieškok batų pagal gamintoją, modelį ir dydį",
        filtersTitle: "Paieškos filtrai",
        brandLabel: "Gamintojas",
        categoryLabel: "Kategorija",
        sizeLabel: "EU dydis",
        sizePlaceholder: "pvz. 44",
        modelLabel: "Modelio pavadinimas",
        modelPlaceholder: "pvz. Air Max",
        button: "Ieškoti batų",
        statusReady: "Pasiruošta.",
        statusSearching: "Vykdoma paieška...",
        statusAuto: "Aptikti URL parametrai. Paieška paleidžiama automatiškai...",
        statusFound: "Rasta {count} rezultatų.",
        statusFoundBrand: "Rasta {count} rezultatų pagal gamintojų rekomenduojamus dydžius.",
        noResults: "Tinkančių batų nerasta.",
        noSearch: "Paieška dar nevykdyta."
      }
    }
  };

  function getValue(obj, path) {
    return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
  }

  function getLanguage() {
    return localStorage.getItem("site-language") || "en";
  }

  function tf(key, vars = {}) {
    const lang = getLanguage();
    const source = translations[lang] || translations.en;
    let value = getValue(source, key) ?? getValue(translations.en, key) ?? key;

    Object.keys(vars).forEach((name) => {
      value = value.replaceAll(`{${name}}`, String(vars[name]));
    });

    return value;
  }

  function t(key) {
    return tf(key);
  }

  function translatePage() {
    document.documentElement.lang = getLanguage();

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });

    document.querySelectorAll("[data-lang-button]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.langButton === getLanguage());
    });
  }

  function setLanguage(lang) {
    localStorage.setItem("site-language", lang);
    location.reload();
  }

  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-lang-button]");
    if (!btn) return;
    setLanguage(btn.dataset.langButton);
  });

  window.t = t;
  window.tf = tf;
  window.getSiteLanguage = getLanguage;
  window.setSiteLanguage = setLanguage;
  window.translatePage = translatePage;

  document.addEventListener("DOMContentLoaded", translatePage);
})();
