// Fungsi untuk baca CSV
async function loadCSV() {
  const response = await fetch("kotoba.csv");
  const text = await response.text();
  const rows = text.trim().split("\n").slice(1); // lewati header

  const tbody = document.querySelector("#kotobaTable tbody");
  tbody.innerHTML = "";

  rows.forEach((row) => {
    const cols = row.split(",");
    const tr = document.createElement("tr");
    cols.forEach((col) => {
      const td = document.createElement("td");
      td.textContent = col.trim();
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

// Fitur pencarian
document.getElementById("search").addEventListener("input", function () {
  const filter = this.value.toLowerCase();
  const rows = document.querySelectorAll("#kotobaTable tbody tr");
  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(filter) ? "" : "none";
  });
});

// Jalankan fungsi
loadCSV();
