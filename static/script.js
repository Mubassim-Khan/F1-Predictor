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
  "Bahrain Grand Prix",
  "Saudi Arabian Grand Prix",
  "Australian Grand Prix",
  "Azerbaijan Grand Prix",
  "Miami Grand Prix",
  "Spanish Grand Prix",
  "Monaco Grand Prix",
  "Canadian Grand Prix",
  "British Grand Prix",
  "Hungarian Grand Prix",
  "Belgian Grand Prix",
  "Dutch Grand Prix",
  "Italian Grand Prix",
  "Singapore Grand Prix",
  "Japanese Grand Prix",
  "United States Grand Prix",
  "Mexico City Grand Prix",
  "São Paulo Grand Prix",
  "Las Vegas Grand Prix",
  "Abu Dhabi Grand Prix",
];

gps.forEach((gp) => {
  const opt = document.createElement("option");
  opt.value = gp;
  opt.textContent = gp;
  gpSelect.appendChild(opt);
});

// Qualifying results cache
const predictCache = {};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.classList.add("hidden");
  loading.classList.remove("hidden");
  resultsContainer.classList.add("hidden");
  driverDetails.classList.add("hidden");
  tableBody.innerHTML = "";

  const year = parseInt(yearSelect.value);
  const gp = gpSelect.value;
  const cacheKey = `${year}_${gp}`;

  let data;
  if (predictCache[cacheKey]) {
    data = predictCache[cacheKey];
  } else {
    try {
      const res = await fetch(
        "https://ideal-space-dollop-5g95v9qv9v4vcp477-5000.app.github.dev/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ year, gp }),
        }
      );

      if (!res.ok) throw new Error("Failed to fetch prediction");
      data = await res.json();
      predictCache[cacheKey] = data;
    } catch (err) {
      errorBox.textContent = "❌ Inchident: " + err.message;
      errorBox.classList.remove("hidden");
      loading.classList.add("hidden");
      return;
    }
  }

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
  loading.classList.add("hidden");
});

// Reset Button
resetBtn.addEventListener("click", () => {
  resultsContainer.classList.add("hidden");
  driverDetails.classList.add("hidden");
  errorBox.classList.add("hidden");
  tableBody.innerHTML = "";
});

// Helper for lap time formatting
function formatLapTime(seconds) {
  if (seconds == null || isNaN(seconds)) return "-";
  const min = Math.floor(seconds / 60);
  const sec = (seconds % 60).toFixed(3);
  return `${min}:${sec.padStart(6, "0")}`;
}

// Modal logic
const modal = document.getElementById("driverModal");
const closeButton = document.querySelector(".close-button");
function openModal() {
  modal.classList.add("show");
}
function closeModal() {
  modal.classList.remove("show");
  driverDetails.innerHTML = "";
}
closeButton.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Driver stats cache
const driverStatsCache = {};

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("driver-name")) {
    const driverAbbr = e.target.dataset.driver;
    driverDetails.textContent = "🔍 Fetching stats for " + driverAbbr + "...";
    driverDetails.classList.remove("hidden");
    openModal();

    let stats;
    if (driverStatsCache[driverAbbr]) {
      stats = driverStatsCache[driverAbbr];
    } else {
      try {
        const statsRes = await fetch(
          `https://ideal-space-dollop-5g95v9qv9v4vcp477-5000.app.github.dev/driver-stats?driver=${driverAbbr}`
        );
        stats = await statsRes.json();
        driverStatsCache[driverAbbr] = stats;
      } catch {
        driverDetails.textContent = "❌ Failed to fetch driver details.";
        return;
      }
    }

    // Fallback images
    const driverImage = `https://media.formula1.com/content/dam/fom-website/drivers/2024/${driverAbbr.toLowerCase()}.jpg`;
    const fallbackDriverImage =
      "https://media.formula1.com/content/dam/fom-website/drivers/NoImageAvailable.jpg";
    const teamSlug = stats.team
      ? stats.team.replace(/[\s.]/g, "-").toLowerCase()
      : "";
    const teamLogo = teamSlug
      ? `https://media.formula1.com/content/dam/fom-website/teams/2024/${teamSlug}/logo.png`
      : "";
    const fallbackTeamLogo =
      "https://media.formula1.com/content/dam/fom-website/teams/NoLogoAvailable.png";

    driverDetails.innerHTML = `
      <img src="${driverImage}" alt="${driverAbbr}" onerror="this.onerror=null;this.src='${fallbackDriverImage}';" />
      <div class="driver-info">
        <h2>${stats.full_name || driverAbbr}</h2>
        <p><strong>Team:</strong> ${stats.team}</p>
        <p><strong>Avg Q Position:</strong> ${
          stats.avg_q_pos ? Math.ceil(stats.avg_q_pos) : "-"
        }</p>
        <p><strong>Avg Q3 Lap:</strong> ${formatLapTime(stats.avg_q3_lap)}</p>
        <img src="${teamLogo}" alt="${
      stats.team
    }" style="margin-top: 10px;" onerror="this.onerror=null;this.src='${fallbackTeamLogo}';" />
      </div>
    `;
  }
});
