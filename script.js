document.addEventListener("DOMContentLoaded", function () {
  const cardContainer = document.getElementById("card-container");
  const loadingIndicator = document.getElementById("loading");
  const noResultsIndicator = document.getElementById("no-results");
  const searchInput = document.getElementById("searchInput");
  const jlptLevelFilter = document.getElementById("jlptLevel");
  let vocabularyData = []; // Untuk menyimpan semua data dari CSV

  /**
   * Fungsi untuk mengambil dan mem-parsing data CSV.
   * Menggunakan PapaParse untuk kemudahan.
   */
  function fetchData() {
    Papa.parse("kotoba.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        loadingIndicator.style.display = "none"; // Sembunyikan loading
        vocabularyData = results.data;
        displayCards(vocabularyData); // Tampilkan semua kartu saat pertama kali dimuat
      },
      error: function (err) {
        loadingIndicator.textContent = "Gagal memuat data. Silakan coba lagi.";
        console.error("Error fetching or parsing CSV:", err);
      },
    });
  }

  /**
   * Fungsi untuk menampilkan kartu kosakata ke dalam container.
   * @param {Array} data - Array objek kosakata yang akan ditampilkan.
   */
  function displayCards(data) {
    cardContainer.innerHTML = ""; // Kosongkan container sebelum menampilkan data baru
    if (data.length === 0) {
      noResultsIndicator.style.display = "block"; // Tampilkan pesan 'tidak ditemukan'
    } else {
      noResultsIndicator.style.display = "none"; // Sembunyikan pesan
    }

    data.forEach((word) => {
      // Membuat elemen kartu
      const card = document.createElement("div");
      card.className = "card";

      // Membuat konten kartu
      // Sanitasi sederhana untuk mencegah masalah keamanan dasar, meskipun data dari CSV Anda sendiri.
      const original = escapeHTML(word.Original);
      const furigana = escapeHTML(word.Furigana);
      const english = escapeHTML(word.English);
      const level = escapeHTML(word["JLPT Level"]);

      card.innerHTML = `
                <div class="card-header">
                    <div class="flex justify-between items-start">
                        <h2 class="original font-jp">${original}</h2>
                        <span class="level">${level}</span>
                    </div>
                </div>
                <div class="card-body">
                    <p class="furigana font-jp">${furigana}</p>
                    <p class="english">${english}</p>
                </div>
            `;

      cardContainer.appendChild(card);
    });
  }

  /**
   * Fungsi untuk melakukan filter dan pencarian data.
   */
  function filterAndSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedLevel = jlptLevelFilter.value;

    const filteredData = vocabularyData.filter((word) => {
      const matchesSearch =
        word.Original.toLowerCase().includes(searchTerm) ||
        word.Furigana.toLowerCase().includes(searchTerm) ||
        word.English.toLowerCase().includes(searchTerm);

      const matchesLevel =
        selectedLevel === "all" || word["JLPT Level"] === selectedLevel;

      return matchesSearch && matchesLevel;
    });

    displayCards(filteredData);
  }

  /**
   * Fungsi untuk "membersihkan" teks agar terhindar dari HTML injection.
   * @param {string} str - String yang ingin dibersihkan.
   * @returns {string} String yang sudah bersih.
   */
  function escapeHTML(str) {
    if (!str) return "";
    const p = document.createElement("p");
    p.textContent = str;
    return p.innerHTML;
  }

  // Menambahkan event listener untuk input pencarian dan filter level
  searchInput.addEventListener("input", filterAndSearch);
  jlptLevelFilter.addEventListener("change", filterAndSearch);

  // Memulai proses pengambilan data
  fetchData();
});
