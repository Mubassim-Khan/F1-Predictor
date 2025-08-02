document.getElementById("predictForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const year = document.getElementById("year").value;
  const gp = document.getElementById("gp").value;
  const resultsBox = document.getElementById("results");
  resultsBox.textContent = "Fetching predictions...";

  try {
    const response = await fetch("https://ideal-space-dollop-5g95v9qv9v4vcp477-5000.app.github.dev/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year: parseInt(year), gp })
    });

    const data = await response.json();
    if (data.error) {
      resultsBox.textContent = "❌ Error: " + data.error;
    } else {
      resultsBox.textContent = JSON.stringify(data, null, 2);
    }
  } catch (err) {
    resultsBox.textContent = "❌ Network error: " + err.message;
  }
});
