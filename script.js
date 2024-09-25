// Constants
const CRYPTO_LIST = [
  { name: "Bitcoin", symbol: "btc", color: "#FF6384" },
  { name: "Ethereum", symbol: "eth", color: "#36A2EB" },
  { name: "Solana", symbol: "sol", color: "#FFCE56" },
];
const UPDATE_INTERVAL = 12000;
const HISTORY_POINTS = 120;

// Variables
let cryptos = [];
let combinedChart;
let individualCharts = {};

// Initialize the visualizer
async function init() {
  try {
    // Load custom coins from local storage
    const customCoins = JSON.parse(localStorage.getItem("customCoins")) || [];

    // Add default cryptos
    for (const crypto of CRYPTO_LIST) {
      await addCrypto(crypto.name, crypto.symbol, crypto.color);
    }

    // Add custom coins
    for (const crypto of customCoins) {
      await addCrypto(crypto.name, crypto.symbol, crypto.color);
    }

    document
      .getElementById("addCustomCoin")
      .addEventListener("click", addCustomCoin);

    createCombinedChart();
    createIndividualCharts();

    // Start updating crypto data
    updateAllCryptoData();
    setInterval(updateAllCryptoData, UPDATE_INTERVAL);
  } catch (error) {
    console.error("Initialization error:", error);
    alert(
      "Failed to initialize the visualizer. Please check the console for details."
    );
  }
}

// Add a new crypto
async function addCrypto(name, symbol, color) {
  if (!cryptos.some((c) => c.symbol === symbol)) {
    const newCrypto = { name, symbol, color, data: [] };
    cryptos.push(newCrypto);
    await updateCryptoData(newCrypto);
    renderCryptoBox(newCrypto);
    updateCharts();
  }
}

// Add custom coin
async function addCustomCoin() {
  const name = document.getElementById("customCoinName").value.trim();
  const symbol = document
    .getElementById("customCoinSymbol")
    .value.trim()
    .toLowerCase();
  if (name && symbol) {
    if (cryptos.some((c) => c.symbol === symbol)) {
      alert("This cryptocurrency is already in the list.");
      return;
    }
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    try {
      await addCrypto(name, symbol, color);
      // Save custom coin to local storage
      const customCoins = JSON.parse(localStorage.getItem("customCoins")) || [];
      customCoins.push({ name, symbol, color });
      localStorage.setItem("customCoins", JSON.stringify(customCoins));
      // Clear input fields after adding
      document.getElementById("customCoinName").value = "";
      document.getElementById("customCoinSymbol").value = "";
    } catch (error) {
      console.error("Error adding custom coin:", error);
      alert(
        "Failed to add custom coin. Please check if the symbol is correct."
      );
    }
  } else {
    alert("Please enter both name and symbol for the custom coin.");
  }
}

// Delete crypto
function deleteCrypto(symbol) {
  cryptos = cryptos.filter((c) => c.symbol !== symbol);
  document.getElementById(`box-${symbol}`).remove();
  if (individualCharts[symbol]) {
    individualCharts[symbol].destroy();
    delete individualCharts[symbol];
    document.getElementById(`chart-${symbol}`).remove();
  }
  updateCharts();

  // Remove from local storage if it's a custom coin
  const customCoins = JSON.parse(localStorage.getItem("customCoins")) || [];
  const updatedCustomCoins = customCoins.filter((c) => c.symbol !== symbol);
  localStorage.setItem("customCoins", JSON.stringify(updatedCustomCoins));
}

// Update crypto data
async function updateCryptoData(crypto) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${crypto.name.toLowerCase()}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const price = data.market_data.current_price.inr;
    const time = new Date();
    crypto.data.push({ x: time, y: price });
    if (crypto.data.length > HISTORY_POINTS) {
      crypto.data.shift();
    }
    updateCryptoBox(crypto);
    updateCharts();
  } catch (error) {
    console.error(`Error fetching data for ${crypto.name}:`, error);
  }
}

// Update all crypto data
async function updateAllCryptoData() {
  const updatePromises = cryptos.map(updateCryptoData);
  await Promise.all(updatePromises);
}

// Render crypto box
function renderCryptoBox(crypto) {
  const box = document.createElement("div");
  box.className = "crypto-box";
  box.id = `box-${crypto.symbol}`;
  box.innerHTML = `
        <h2>${crypto.name} (${crypto.symbol.toUpperCase()})</h2>
        <p>Price: $<span id="price-${crypto.symbol}"></span></p>
        <p>24h Change: <span id="change-${crypto.symbol}"></span></p>
        ${
          !CRYPTO_LIST.some((c) => c.symbol === crypto.symbol)
            ? '<span class="delete-btn" onclick="deleteCrypto(\'' +
              crypto.symbol +
              "')\">Delete</span>"
            : ""
        }
    `;
  document.getElementById("cryptoBoxes").appendChild(box);
}

// Update crypto box
function updateCryptoBox(crypto) {
  const priceElement = document.getElementById(`price-${crypto.symbol}`);
  const changeElement = document.getElementById(`change-${crypto.symbol}`);
  if (priceElement && changeElement && crypto.data.length > 1) {
    const currentPrice = crypto.data[crypto.data.length - 1].y;
    const previousPrice = crypto.data[crypto.data.length - 2].y;
    const change = ((currentPrice - previousPrice) / previousPrice) * 100;

    priceElement.textContent = currentPrice.toFixed(2);
    changeElement.textContent = `${change.toFixed(2)}%`;
    changeElement.style.color = change >= 0 ? "green" : "red";
  }
}

// Create combined chart
function createCombinedChart() {
  const ctx = document.getElementById("combinedChartCanvas").getContext("2d");
  combinedChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: cryptos.map((crypto) => ({
        label: crypto.name,
        data: crypto.data,
        borderColor: crypto.color,
        tension: 0.1,
      })),
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "minute",
          },
        },
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

// Create individual charts
function createIndividualCharts() {
  const chartsContainer = document.getElementById("individualCharts");
  chartsContainer.innerHTML = "";
  cryptos.forEach((crypto) => {
    const chartContainer = document.createElement("div");
    chartContainer.id = `chart-${crypto.symbol}`;
    chartContainer.className = "individual-chart";
    const canvas = document.createElement("canvas");
    chartContainer.appendChild(canvas);
    chartsContainer.appendChild(chartContainer);

    const ctx = canvas.getContext("2d");
    individualCharts[crypto.symbol] = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: crypto.name,
            data: crypto.data,
            borderColor: crypto.color,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: "time",
            time: {
              unit: "minute",
            },
          },
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  });
}

// Update charts
function updateCharts() {
  if (combinedChart) {
    combinedChart.data.datasets = cryptos.map((crypto) => ({
      label: crypto.name,
      data: crypto.data,
      borderColor: crypto.color,
      tension: 0.1,
    }));
    combinedChart.update();
  }

  cryptos.forEach((crypto) => {
    if (individualCharts[crypto.symbol]) {
      individualCharts[crypto.symbol].data.datasets[0].data = crypto.data;
      individualCharts[crypto.symbol].update();
    } else {
      createIndividualCharts();
    }
  });
}

// Initialize the visualizer
init();
