document.addEventListener("DOMContentLoaded", () => {
  // === ELEMEN DOM ===
  const kotobaList = document.getElementById("kotobaList");
  const searchInput = document.getElementById("searchInput");
  const levelFilter = document.getElementById("levelFilter");
  const statusMessage = document.getElementById("statusMessage");
  const darkModeToggle = document.getElementById("darkModeToggle");

  // === STATE ===
  let allKotoba = [];
  let currentLevel = "all";
  let currentSearch = "";

  // === DARK MODE ===
  const sunIcon = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;
  const moonIcon = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      darkModeToggle.innerHTML = sunIcon;
    } else {
      document.documentElement.classList.remove("dark");
      darkModeToggle.innerHTML = moonIcon;
    }
  };

  // Cek preferensi tema dari localStorage atau sistem
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let isDarkMode =
    localStorage.getItem("theme") === "dark" ||
    (localStorage.getItem("theme") === null && prefersDark);
  applyTheme(isDarkMode);

  darkModeToggle.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    applyTheme(isDarkMode);
  });

  // === FUNGSI PARSING CSV ===
  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      // Regex untuk memisahkan CSV dengan benar, menangani koma di dalam kutipan
      const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];

      if (values.length === headers.length) {
        const entry = {};
        headers.forEach((header, index) => {
          let value = values[index] || "";
          // Menghapus kutipan di awal dan akhir jika ada
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          entry[header] = value.trim();
        });
        data.push(entry);
      }
    }
    return data;
  };

  // === FUNGSI RENDER DAN FILTER ===
  const renderKotoba = () => {
    kotobaList.innerHTML = "";
    statusMessage.style.display = "none";

    // 1. Filter berdasarkan level
    let filteredByLevel =
      currentLevel === "all"
        ? allKotoba
        : allKotoba.filter((k) => k["JLPT Level"] === currentLevel);

    // 2. Filter berdasarkan pencarian
    const searchTerm = currentSearch.toLowerCase();
    const finalFiltered = filteredByLevel.filter((k) => {
      return (
        k.Original?.toLowerCase().includes(searchTerm) ||
        k.Furigana?.toLowerCase().includes(searchTerm) ||
        k.English?.toLowerCase().includes(searchTerm)
      );
    });

    if (finalFiltered.length === 0) {
      statusMessage.innerHTML = "<p>Kosakata tidak ditemukan.</p>";
      statusMessage.style.display = "block";
    } else {
      finalFiltered.forEach((kotoba) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
                    <div class="card-header">
                        <h3 class="card-original">${kotoba.Original || ""}</h3>
                        <p class="card-furigana">${kotoba.Furigana || ""}</p>
                    </div>
                    <p class="card-english">${kotoba.English || ""}</p>
                    <div class="card-footer">
                        <span class="card-level">${
                          kotoba["JLPT Level"] || "N/A"
                        }</span>
                    </div>
                `;
        kotobaList.appendChild(card);
      });
    }
  };

  // === EVENT LISTENERS ===
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderKotoba();
  });

  levelFilter.addEventListener("click", (e) => {
    if (e.target.classList.contains("level-btn")) {
      levelFilter.querySelector(".active")?.classList.remove("active");
      e.target.classList.add("active");
      currentLevel = e.target.dataset.level;
      renderKotoba();
    }
  });

  // === INISIALISASI ===
  const init = async () => {
    try {
      const response = await fetch("kotoba.csv");
      if (!response.ok) {
        throw new Error(`Gagal memuat file: ${response.statusText}`);
      }
      const csvText = await response.text();
      allKotoba = parseCSV(csvText);
      renderKotoba();
    } catch (error) {
      console.error("Error:", error);
      statusMessage.innerHTML = `<p>Gagal memuat data kosakata. Pastikan file 'kotoba.csv' ada di folder yang sama.</p>`;
      statusMessage.style.display = "block";
    }
  };

  init();
});
