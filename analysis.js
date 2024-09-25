document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cryptoCompareForm");
  const resultDiv = document.getElementById("analysisResult");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const crypto1 = document
      .getElementById("crypto1")
      .value.trim()
      .toLowerCase();
    const crypto2 = document
      .getElementById("crypto2")
      .value.trim()
      .toLowerCase();

    resultDiv.innerHTML = "Analyzing...";

    try {
      const data1 = await fetchCryptoData(crypto1);
      const data2 = await fetchCryptoData(crypto2);

      const analysis = compareCryptos(data1, data2);
      resultDiv.innerHTML = `<h2>Analysis Result:</h2>${analysis}`;
    } catch (error) {
      console.error("Error:", error);
      resultDiv.innerHTML =
        "An error occurred while analyzing. Please check if the cryptocurrency names are correct and try again.";
    }
  });

  async function fetchCryptoData(cryptoId) {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${cryptoId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  function compareCryptos(data1, data2) {
    let comparisonHTML =
      "<table><tr><th>Metric</th><th>" +
      data1.name +
      "</th><th>" +
      data2.name +
      "</th></tr>";

    comparisonHTML += compareMetric(
      "Current Price (USD)",
      data1.market_data.current_price.usd,
      data2.market_data.current_price.usd,
      "$"
    );
    comparisonHTML += compareMetric(
      "Market Cap (USD)",
      data1.market_data.market_cap.usd,
      data2.market_data.market_cap.usd,
      "$"
    );
    comparisonHTML += compareMetric(
      "24h Trading Volume",
      data1.market_data.total_volume.usd,
      data2.market_data.total_volume.usd,
      "$"
    );
    comparisonHTML += compareMetric(
      "24h High",
      data1.market_data.high_24h.usd,
      data2.market_data.high_24h.usd,
      "$"
    );
    comparisonHTML += compareMetric(
      "24h Low",
      data1.market_data.low_24h.usd,
      data2.market_data.low_24h.usd,
      "$"
    );
    comparisonHTML += compareMetric(
      "24h Price Change",
      data1.market_data.price_change_percentage_24h,
      data2.market_data.price_change_percentage_24h,
      "%"
    );
    comparisonHTML += compareMetric(
      "7d Price Change",
      data1.market_data.price_change_percentage_7d,
      data2.market_data.price_change_percentage_7d,
      "%"
    );
    comparisonHTML += compareMetric(
      "30d Price Change",
      data1.market_data.price_change_percentage_30d,
      data2.market_data.price_change_percentage_30d,
      "%"
    );

    comparisonHTML += "</table>";

    comparisonHTML += `<h3>Summary:</h3>
        <p>${data1.name} and ${
      data2.name
    } are both cryptocurrencies with different market performances and characteristics.</p>
        <p>${data1.name} has a ${
      data1.market_data.market_cap.usd > data2.market_data.market_cap.usd
        ? "larger"
        : "smaller"
    } market cap compared to ${data2.name}.</p>
        <p>In terms of recent performance, ${data1.name} has shown a ${
      data1.market_data.price_change_percentage_24h >
      data2.market_data.price_change_percentage_24h
        ? "better"
        : "worse"
    } 24-hour price change compared to ${data2.name}.</p>
        <p>Investors should consider their investment goals, risk tolerance, and conduct further research before making any investment decisions.</p>`;

    return comparisonHTML;
  }

  function compareMetric(metricName, value1, value2, unit = "") {
    const formattedValue1 =
      typeof value1 === "number"
        ? value1.toLocaleString(undefined, { maximumFractionDigits: 2 })
        : "N/A";
    const formattedValue2 =
      typeof value2 === "number"
        ? value2.toLocaleString(undefined, { maximumFractionDigits: 2 })
        : "N/A";
    return `<tr>
            <td>${metricName}</td>
            <td>${unit}${formattedValue1}</td>
            <td>${unit}${formattedValue2}</td>
        </tr>`;
  }
});
