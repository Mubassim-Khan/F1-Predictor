const yearSelect = document.getElementById("year");
const gpSelect = document.getElementById("gp");
const form = document.getElementById("predictForm");
const resultsContainer = document.getElementById("resultsTableContainer");
const tableBody = document.querySelector("#resultsTable tbody");
const errorBox = document.getElementById("errorBox");
const loading = document.getElementById("loading");
const resetBtn = document.getElementById("resetBtn");
const driverDetails = document.getElementById("driverDetails");

// Populate year and GP options
const currentYear = new Date().getFullYear();
for (let y = 2022; y <= currentYear; y++) {
  const opt = document.createElement("option");
  opt.value = y;
  opt.textContent = y;
  yearSelect.appendChild(opt);
}

// Sample GP names (or fetch dynamically)
const gps = [
  'Bahrain Grand Prix',
  'Saudi Arabian Grand Prix',
  'Australian Grand Prix',
  'Azerbaijan Grand Prix',
  'Miami Grand Prix',
  'Spanish Grand Prix',
  'Monaco Grand Prix',
  'Canadian Grand Prix',
  'British Grand Prix',
  'Hungarian Grand Prix',
  'Belgian Grand Prix',
  'Dutch Grand Prix',
  'Italian Grand Prix',
  'Singapore Grand Prix',
  'Japanese Grand Prix',
  'United States Grand Prix',
  'Mexico City Grand Prix',
  'São Paulo Grand Prix',
  'Las Vegas Grand Prix',
  'Abu Dhabi Grand Prix'
]

gps.forEach(gp => {
  const opt = document.createElement("option");
  opt.value = gp;
  opt.textContent = gp;
  gpSelect.appendChild(opt);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.classList.add("hidden");
  loading.classList.remove("hidden");
  resultsContainer.classList.add("hidden");
  driverDetails.classList.add("hidden");
  tableBody.innerHTML = "";

  const year = parseInt(yearSelect.value);
  const gp = gpSelect.value;

  try {
    const res = await fetch("https://ideal-space-dollop-5g95v9qv9v4vcp477-5000.app.github.dev/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, gp })
    });

    if (!res.ok) throw new Error(data.error || "Failed to fetch prediction");

    const data = await res.json();

    data.sort((a, b) => a.PredictedPosition - b.PredictedPosition);

    data.forEach((d, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${d.PredictedPosition}</td>
  <td class="driver-name" data-driver="${d.Driver}">${d.Driver}</td>
  <td>${d.Team}</td>
  <td>${d.PredictedLapTime}</td>
`;
      tableBody.appendChild(row);
    });

    resultsContainer.classList.remove("hidden");
  } catch (err) {
    errorBox.textContent = "❌ Inchident: " + err.message;
    errorBox.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
});

// Reset Button
resetBtn.addEventListener("click", () => {
  resultsContainer.classList.add("hidden");
  driverDetails.classList.add("hidden");
  errorBox.classList.add("hidden");
  tableBody.innerHTML = "";
});

// Format laptime in mm:ss.sss
function formatLapTime(seconds) {
  if (!seconds || isNaN(seconds)) return "--:--";
  const minutes = Math.floor(seconds / 60);
  const sec = (seconds % 60).toFixed(3);
  return `${minutes}:${sec.padStart(6, "0")}`;
}

// Driver Detail Panel (optional future implementation)
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("driver-name")) {
    const driver = e.target.dataset.driver;
    driverDetails.textContent = "🔍 Fetching stats for " + driver + "...";
    driverDetails.classList.remove("hidden");

    try {
      const res = await fetch(`https://ideal-space-dollop-5g95v9qv9v4vcp477-5000.app.github.dev/driver-stats?driver=${driver}`);
      const stats = await res.json();
      driverDetails.innerHTML = `
        <strong>${driver}</strong><br/>
        Team: ${stats.team}<br/>
        Avg Qualifying Position: ${stats.avg_q_pos}<br/>
        Q3 Lap Avg: ${formatLapTime(stats.avg_q3_lap)}
      `;
    } catch {
      driverDetails.textContent = "❌ Failed to fetch driver details.";
    }
  }
});
