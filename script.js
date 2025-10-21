document.addEventListener("DOMContentLoaded", () => {
  // === ELEMEN DOM ===
  const kotobaList = document.getElementById("kotobaList");
  const searchInput = document.getElementById("searchInput");
  const levelFilter = document.getElementById("levelFilter");
  const statusMessage = document.getElementById("statusMessage");
  const darkModeToggle = document.getElementById("darkModeToggle");

  // === STATE ===
  // PERUBAHAN: Data sekarang dimuat langsung dari variabel di data.js
  let allKotoba = allKotobaData || [];
  let currentLevel = "all";
  let currentSearch = "";

  // === DARK MODE (Tidak ada perubahan) ===
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

  // === FUNGSI PARSING CSV (DIHAPUS) ===
  // Fungsi ini tidak lagi diperlukan karena data sudah dalam format JavaScript.

  // === FUNGSI RENDER DAN FILTER (VERSI TABEL) ===
  const renderKotoba = () => {
    kotobaList.innerHTML = "";
    statusMessage.style.display = "none";

    let filteredByLevel =
      currentLevel === "all"
        ? allKotoba
        : allKotoba.filter((k) => k["JLPT Level"] === currentLevel);

    const searchTerm = currentSearch.toLowerCase();
    const finalFiltered = filteredByLevel.filter((k) => {
      return (
        k.Original?.toLowerCase().includes(searchTerm) ||
        k.Furigana?.toLowerCase().includes(searchTerm) ||
        k.Indonesia?.toLowerCase().includes(searchTerm)
      );
    });

    if (finalFiltered.length === 0) {
      statusMessage.innerHTML = "<p>Kosakata tidak ditemukan.</p>";
      statusMessage.style.display = "block";
      kotobaList.style.display = "none";
    } else {
      statusMessage.style.display = "none";
      kotobaList.style.display = "block";

      const table = document.createElement("table");
      table.className = "kotoba-table";

      table.innerHTML = `
                <thead>
                    <tr>
                        <th>Kosakata</th>
                        <th>Furigana</th>
                        <th>Arti</th>
                        <th>Level</th>
                    </tr>
                </thead>
            `;

      const tbody = document.createElement("tbody");
      finalFiltered.forEach((kotoba) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td class="original-col">${kotoba.Original || ""}</td>
                    <td>${kotoba.Furigana || ""}</td>
                    <td>${kotoba.Indonesia || ""}</td>
                    <td><span class="level-tag">${
                      kotoba["JLPT Level"] || "N/A"
                    }</span></td>
                `;
        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      kotobaList.appendChild(table);
    }
  };

  // === EVENT LISTENERS (Tidak ada perubahan) ===
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

  // === INISIALISASI (Disederhanakan) ===
  const init = () => {
    // Cukup panggil renderKotoba() karena data sudah tersedia.
    if (allKotoba.length > 0) {
      renderKotoba();
    } else {
      statusMessage.innerHTML =
        "<p>Gagal memuat data kosakata. Pastikan file 'data.js' ada dan tidak kosong.</p>";
      statusMessage.style.display = "block";
    }
  };

  init();
});
