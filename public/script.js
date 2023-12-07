// default exchange rates
let exchangeRates = {
  base_code: "USD",
  date: "2022-09-24",
  conversion_rates: {
    USD: 1,
    AUD: 1.531863,
    CAD: 1.36029,
    CLP: 950.662057,
    CNY: 7.128404,
    EUR: 1.03203,
    GBP: 0.920938,
    INR: 81.255504,
    JPY: 143.376504,
    RUB: 57.875038,
    ZAR: 17.92624,
  },
};

async function loadExchangeRates() {
  try {
    const response = await fetch("/api/exchange-rates");
    if (!response.ok) throw new Error("Failed to load exchange rates");
    const data = await response.json();
    exchangeRates = data;
  } catch (error) {
    console.error(error);
  }
}

const commonDenominations = [1, 5, 10, 20, 50, 100];

// const currencies = {
//   AUD: "Australian Dollar",
//   CAD: "Canadian Dollar",
//   CLP: "Chilean Peso",
//   CNY: "Chinese Yuan",
//   EUR: "Euro",
//   GBP: "British Pound Sterling",
//   INR: "Indian Rupee",
//   JPY: "Japanese Yen",
//   RUB: "Russian Ruble",
//   USD: "United States Dollar",
//   ZAR: "South African Rand",
// };

// When the DOM is loaded, load the exchange rates and add event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Load the exchange rates
  loadExchangeRates().then(() => {
    if (document.getElementById("rate-table")) {
      updateRateTable();
    }
  });

  // Event listener for the amount input field
  const amountInput = document.getElementById("amount");
  // Conditional event listeners so script.js doesn't break on other pages
  if (amountInput) {
    amountInput.addEventListener("input", function (event) {
      // Remove all non-numeric characters from the input value
      event.target.value = event.target.value.replace(/[^0-9.]/g, "");
      // Check for more than one decimal point
      if ((event.target.value.match(/\./g) || []).length > 1) {
        event.target.value = event.target.value.slice(0, -1);
      }
      // Check for more than two digits after the decimal point
      if (
        event.target.value.split(".")[1] &&
        event.target.value.split(".")[1].length > 2
      ) {
        event.target.value = event.target.value.slice(0, -1);
      }
      // Add a dollar sign in front of the input value if it doesn't already have one
      if (!event.target.value.startsWith("$")) {
        event.target.value = "$" + event.target.value;
      }
    });
  }

  // Event listener for the convert button
  const convertButton = document.getElementById("convert-button");
  if (convertButton) {
    convertButton.addEventListener("click", function () {
      let amount = document.getElementById("amount").value.substring(1);
      let fromCurrency = document.getElementById("base-currency").value;
      let toCurrency = document.getElementById("target-currency").value;
      convertCurrency(amount, fromCurrency, toCurrency);
    });
  }
});

function convertCurrency(amount, fromCurrency, toCurrency) {
  // Check if the fromCurrency and toCurrency are in the exchangeRates.conversion_rates
  if (!exchangeRates.conversion_rates[fromCurrency]) {
    document.getElementById("conversion-results").innerHTML =
      "Invalid source currency code provided.";
    return;
  }

  if (!exchangeRates.conversion_rates[toCurrency]) {
    document.getElementById("conversion-results").innerHTML =
      "Invalid target currency code provided.";
    return;
  }

  // Convert the amount string to a number
  amount = parseFloat(amount);

  // Handle the case where amount is not a number
  if (isNaN(amount)) {
    document.getElementById("conversion-results").innerHTML =
      "Invalid amount provided.";
    return;
  }

  const conversionRate = getConversionRate(fromCurrency, toCurrency);
  const convertedAmount = amount * conversionRate;

  // Display the conversion result
  document.getElementById(
    "conversion-results"
  ).innerHTML = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(
    2
  )} ${toCurrency} (as of ${exchangeRates.date})`;
  updateConversionTables(fromCurrency, toCurrency);
}

// Create conversion tables
function updateConversionTables(fromCurrency, toCurrency) {
  const fromTable = document.getElementById("from-table");
  const toTable = document.getElementById("to-table");

  let fromTableContent = `<p>(${fromCurrency}) / (${toCurrency})</p>`;
  let toTableContent = `<p>(${toCurrency}) / (${fromCurrency})</p>`;

  commonDenominations.forEach((denomination) => {
    const conversionRate = getConversionRate(fromCurrency, toCurrency);
    const convertedFrom = (denomination * conversionRate).toFixed(2);
    const convertedTo = (denomination / conversionRate).toFixed(2);

    fromTableContent += `<p>${denomination} / ${convertedFrom}</p>`;
    toTableContent += `<p>${denomination} / ${convertedTo}</p>`;
  });

  fromTable.innerHTML = fromTableContent;
  toTable.innerHTML = toTableContent;

  // Make the tables visible
  fromTable.style.display = "block";
  toTable.style.display = "block";
}

// Create the rate table for charts.ejs
function updateRateTable() {
  const rateTable = document.getElementById("rate-table");
  let tableContent =
    "<table><thead><tr><th>Currency</th><th>Rate</th></tr></thead><tbody>";

  for (const [currency, rate] of Object.entries(
    exchangeRates.conversion_rates
  )) {
    tableContent += `<tr><td>${currency}</td><td>${rate.toFixed(4)}</td></tr>`;
  }

  tableContent += "</tbody></table>";
  rateTable.innerHTML = tableContent;
}

// Calculate the conversion rate given the default or API exchange rates
function getConversionRate(fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  // Calculate the conversion rate from the base currency to the fromCurrency
  const rateFromBase =
    fromCurrency === exchangeRates.base_code
      ? 1
      : 1 / exchangeRates.conversion_rates[fromCurrency];

  // Calculate the conversion rate from the base currency to the toCurrency
  const rateToBase =
    toCurrency === exchangeRates.base_code
      ? 1
      : exchangeRates.conversion_rates[toCurrency];

  return rateFromBase * rateToBase;
}
