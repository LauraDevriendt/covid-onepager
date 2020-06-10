// collapse button
$(document).ready(function () {
  $(".hamburger-btn").on("click", function () {
    $(".hamburger").toggleClass("open");
  });
});

// dropdown menu's
var dropdownButtons = document.querySelectorAll(".dropdownButton");

dropdownButtons.forEach((button) => {
  button.addEventListener("click", function () {
    if (button.nextElementSibling.classList.contains("hide") == true) {
      console.log("yes");
      button.firstElementChild.innerHTML = `<i class="fas fa-chevron-down"></i>`;
      let sibling = button.nextElementSibling;
      sibling.classList.remove("hide");
    } else {
      button.firstElementChild.innerHTML = `<i class="fas fa-chevron-right"></i>`;
      let sibling = button.nextElementSibling;
      sibling.classList.add("hide");
    }
  });
});

/* Creating Chart */
function chart(country) {
  let myChart = document.getElementById("myChart").getContext("2d");

  // global chart options
  Chart.defaults.global.defaultFontFamily = "roboto";
  Chart.defaults.global.defaultFontSize = 18;
  Chart.defaults.global.defaultFontColor = "#777";

  // the chart
  let statChart = new Chart(myChart, {
    type: "doughnut", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
      labels: ["Confirmed", "Deaths", "Recovered"],
      datasets: [
        {
          label: "statistics",
          data: [country.NewConfirmed, country.NewDeaths, country.NewRecovered],
          backgroundColor: ["#FF415B", "#E13588", "#A533D7"],
          borderWidth: 1,
          borderColor: "#eee",
          hoverBorderWidth: 3,
          hoverBorderColor: "#fff",
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Statistics " + country.Country,
        fontSize: 25,
      },
      legend: {
        display: "top",
        labels: {
          fontColor: "#000",
        },
      },
      layout: {
        //padding{}
      },
      //tooltips{}
    },
  });
}

/* fetching api for countries  */

fetch("https://api.covid19api.com/summary")
  .then((response) => response.json())
  .then((data) => {
    // defining variables
    let output = "";
    let outputTable = `<tr>
    <th>Date</th>
    <th>Country</th>
    <th>Confirmed</th>
    <th>Deaths</th>
    <th>Recovered</th>
    </tr>`;

    // function starts when country is typed in
    document.getElementById("country").addEventListener("keyup", function () {
      outputTable = `<tr>
      <th>Date</th>
      <th>Country</th>
      <th>Confirmed</th>
      <th>Deaths</th>
      <th>Recovered</th>
      </tr>`;

      data.Countries.forEach((country) => {
        countryData = country.Country;
        lowercaseCountry = countryData.toLowerCase();
        dateInput = document.getElementById("date").value;
        countryInput = document.getElementById("country").value;
        lowercaseCountryInput = countryInput.toLowerCase();

        // when there is data => make table and chart
        if (
          country.Date.includes(dateInput) == true &&
          lowercaseCountry.includes(lowercaseCountryInput) == true &&
          countryInput !== ""
        ) {
          output += `{country:"${country.Country}", confirmed: "${country.NewConfirmed}", deaths: "${country.NewDeaths}", recovered: "${country.NewRecovered}", date: "${country.Date}"}`;
          outputTable += `
      <tr>
        <td>${country.Date}</td>
        <td>${country.Country}</td>
        <td>${country.NewConfirmed}</td>
        <td>${country.NewDeaths}</td>
        <td>${country.NewRecovered}</td>
      </tr>
      `;

          tableBody = document.getElementById("tableBody");
          tableBody.innerHTML = outputTable;
          chart(country);
        }
      });

      // when there is no data => clear table/chart and warning message
      if (
        outputTable ==
          `<tr>
      <th>Date</th>
      <th>Country</th>
      <th>Confirmed</th>
      <th>Deaths</th>
      <th>Recovered</th>
      </tr>` &&
        document.getElementById("date").value !== "" &&
        document.getElementById("country").value !== ""
      ) {
        let div = document.createElement("div");
        div.classList.add("bg-danger");
        div.classList.add("text-center");
        div.classList.add("mb-2");
        div.style.cssText = "color: #fff; font-weight:900";
        let step1 = document.getElementById("step1");
        div.innerHTML = "No data for this country";
        document.getElementById("lookUp").insertBefore(div, step1);
        document.getElementById("tableBody").innerHTML = "";
        chart("");
      }

      // when people try to fill in country before date
      if (document.getElementById("date").value == "") {
        alert("fill date in first");
        document.getElementById("tableBody").innerHTML = "";
        chart("");
      }

      // clear chart when input is empty
      if (document.getElementById("country").value == "") {
        document.getElementById("tableBody").innerHTML = "";
        chart("");
      }
    });
  });

/* using jquery to fetch data global (USED OTHER WAY TO INTERACT WITH API) */
$(document).ready(function () {
  init();
});

function init() {
  var url = "https://api.covid19api.com/summary";

  $.get(url, function (data) {
    let global = data.Global;
    let countries = data.Countries;
    document.getElementById("countryStat").innerHTML = `${countries.length}`;
    document.getElementById("recoveryStat").innerHTML = formatNumber(
      global.TotalRecovered
    );
    document.getElementById("deathStat").innerHTML = formatNumber(
      global.TotalDeaths
    );
    document.getElementById("confirmedStat").innerHTML = formatNumber(
      global.TotalConfirmed
    );
  });
}

// Number formatting
function formatNumber(value) {
  // Nine Zeroes for Billions
  return Math.abs(Number(value)) >= 1.0e9
    ? Math.abs(Number(value)) / 1.0e9 + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(value)) >= 1.0e6
    ? Math.abs(Number(value)) / 1.0e6 + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(value)) >= 1.0e3
    ? Math.abs(Number(value)) / 1.0e3 + "K"
    : Math.abs(Number(value));
}
