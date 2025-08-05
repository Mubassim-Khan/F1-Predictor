// Accordion logic for About section
document.addEventListener("DOMContentLoaded", function() {
  const accordionToggle = document.querySelector(".accordion-toggle");
  const accordionContent = document.querySelector(".accordion-content");
  accordionToggle.addEventListener("click", function() {
    const isOpen = accordionContent.style.display === "block";
    accordionContent.style.display = isOpen ? "none" : "block";
    accordionToggle.querySelector("span:last-child").innerHTML = isOpen ? "&#9660;" : "&#9650;";
  });
});
const yearSelect = document.getElementById("year");
const gpSelect = document.getElementById("gp");
const form = document.getElementById("predictForm");
const resultsContainer = document.getElementById("resultsTableContainer");
const tableBody = document.querySelector("#resultsTable tbody");
const errorBox = document.getElementById("errorBox");
const loading = document.getElementById("loading");
let loadingMsgTimeouts = [];
const resetBtn = document.getElementById("resetBtn");
const driverDetails = document.getElementById("driverDetails");

const BackendURL =
  "https://ideal-space-dollop-5g95v9qv9v4vcp477-5000.app.github.dev" ||
  "http:localhost:5000";

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
  resultsContainer.classList.add("hidden");
  driverDetails.classList.add("hidden");
  tableBody.innerHTML = "";
  loading.classList.remove("hidden");
  showLoadingMessages();

  const year = parseInt(yearSelect.value);
  const gp = gpSelect.value;
  const cacheKey = `${year}_${gp}`;

  let data;
  if (predictCache[cacheKey]) {
    data = predictCache[cacheKey];
  } else {
    try {
      const res = await fetch(`${BackendURL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, gp }),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        // Custom error message for unavailable qualifying results
        if (
          result.error &&
          result.error
            .toLowerCase()
            .includes("data you are trying to access has not been loaded yet")
        ) {
          errorBox.textContent =
            "Qualifying results for this Grand Prix are not available yet. Please check back after the session.";
        } else {
          errorBox.textContent =
            "❌ Inchident: " + (result.error || "Failed to fetch prediction");
        }
        errorBox.classList.remove("hidden");
        loading.classList.add("hidden");
        clearLoadingMessages();
        return;
      }
      data = result;
      predictCache[cacheKey] = data;
    } catch (err) {
      errorBox.textContent = "❌ Inchident: " + err.message;
      errorBox.classList.remove("hidden");
      loading.classList.add("hidden");
      clearLoadingMessages();
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
  clearLoadingMessages();

  // Fetch and display circuit map
  const circuitMapContainer = document.getElementById("circuitMapContainer");
  const circuitMapHeading = document.getElementById("circuitMapHeading");
  const circuitMapImg = document.getElementById("circuitMapImg");
  circuitMapContainer.classList.add("hidden");
  circuitMapImg.src = "";
  circuitMapHeading.textContent = "";
  fetch(`${BackendURL}/circuit-map`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ year, gp }),
  })
    .then((res) => res.json())
    .then((data) => {
      circuitMapHeading.textContent = `Circuit Map with Numbered Corners: ${gp}`;
      circuitMapImg.src = data.img_url;
      circuitMapContainer.classList.remove("hidden");
    });

  // Fetch and display gear shift graph
  const gearShiftContainer = document.getElementById("gearShiftContainer");
  const gearShiftHeading = document.getElementById("gearShiftHeading");
  const gearShiftImg = document.getElementById("gearShiftImg");
  gearShiftContainer.classList.add("hidden");
  gearShiftImg.src = "";
  gearShiftHeading.textContent = "";
  fetch(`${BackendURL}/gear-shifts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ year, gp }),
  })
    .then((res) => res.json())
    .then((data) => {
      gearShiftHeading.textContent = `Gear Shifts Used Around the Circuit (Fastest Lap)`;
      gearShiftImg.src = data.img_url;
      gearShiftContainer.classList.remove("hidden");
    });
});

// Reset Button
resetBtn.addEventListener("click", () => {
  resultsContainer.classList.add("hidden");
  driverDetails.classList.add("hidden");
  errorBox.classList.add("hidden");
  tableBody.innerHTML = "";
  loading.classList.add("hidden");
  clearLoadingMessages();
  // Reset graph images and headings
  const circuitMapContainer = document.getElementById("circuitMapContainer");
  const circuitMapHeading = document.getElementById("circuitMapHeading");
  const circuitMapImg = document.getElementById("circuitMapImg");
  circuitMapContainer.classList.add("hidden");
  circuitMapImg.src = "";
  circuitMapHeading.textContent = "";
  const gearShiftContainer = document.getElementById("gearShiftContainer");
  const gearShiftHeading = document.getElementById("gearShiftHeading");
  const gearShiftImg = document.getElementById("gearShiftImg");
  gearShiftContainer.classList.add("hidden");
  gearShiftImg.src = "";
  gearShiftHeading.textContent = "";
});

// Loading spinner messages
function showLoadingMessages() {
  clearLoadingMessages();
  let msg = document.createElement("div");
  msg.className = "loading-message";
  msg.textContent = "Fetching qualifying results...";
  loading.parentNode.insertBefore(msg, loading.nextSibling);
  loadingMsgTimeouts.push(
    setTimeout(() => {
      msg.textContent = "Crunching the numbers...";
    }, 2500)
  );
  loadingMsgTimeouts.push(
    setTimeout(() => {
      msg.textContent = "Almost there...";
    }, 4500)
  );
}

function clearLoadingMessages() {
  loadingMsgTimeouts.forEach((t) => clearTimeout(t));
  loadingMsgTimeouts = [];
  let msg = document.querySelector(".loading-message");
  if (msg) msg.remove();
}

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
          `${BackendURL}/driver-stats?driver=${driverAbbr}`
        );
        stats = await statsRes.json();
        driverStatsCache[driverAbbr] = stats;
      } catch {
        driverDetails.textContent = "❌ Failed to fetch driver details.";
        return;
      }
    }

    // Fallback images
    const driverImage = `/static/images/drivers/${driverAbbr.toLowerCase()}.png`;
    const fallbackDriverImage =
      "/static/images/drivers/driver-placeholder-image.png";

    const teamSlug = stats.team
      ? stats.team.replace(/[\s.]/g, "-").toLowerCase()
      : "";
    const teamLogo = `/static/images/teams/${teamSlug}.png`;
    const fallbackTeamLogo = "/static/images/teams/team-placeholder-image.png";

    driverDetails.innerHTML = `
      <img src="${driverImage}" alt="${driverAbbr}" onerror="this.onerror=null;this.src='${fallbackDriverImage}';" />
      <div class="driver-info">
        <h2>${driverFullNames[driverAbbr] || driverAbbr}</h2>
        <p><strong>Avg Qualifying Position:</strong> ${
          stats.avg_q_pos ? Math.ceil(stats.avg_q_pos) : "-"
        }</p>
        <p><strong>Avg Q3 Lap Time:</strong> ${formatLapTime(
          stats.avg_q3_lap
        )}</p>
        <p><strong>Team:</strong> ${stats.team}</p>
        <img src="${teamLogo}" alt="${
      stats.team
    }" style="margin-top: 10px;" onerror="this.onerror=null;this.src='${fallbackTeamLogo}';" />
      </div>
    `;
  }
});
