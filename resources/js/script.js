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
          data: [country.Confirmed, country.Deaths, country.Recovered],
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

fetch("https://api.covid19api.com/countries")
  .then((response) => response.json())
  .then((data) => {
    let countries = "";
    data.forEach((country) => {
      countries += `${country.Slug}!`;
    });
    countries = countries.split("!").slice(0, -1).sort();
    document.getElementById(
      "country"
    ).innerHTML = `<option value="">pick country</option`;
    for (let i = 0; i < countries.length; i++) {
      document.getElementById(
        "country"
      ).innerHTML += `<option value="${countries[i]}">${countries[i]}</option>`;
    }
  });

document.getElementById("country").addEventListener("change", function () {
  let dateInput = document.getElementById("date").value;
  let countryInput = document.getElementById("country").value;
  fetchData(dateInput, countryInput);
});
document.getElementById("date").addEventListener("change", function () {
  let dateInput = document.getElementById("date").value;
  let countryInput = document.getElementById("country").value;
  fetchData(dateInput, countryInput);
});

function fetchData(dateInput, countryInput) {
  let today = new Date();
  let todayString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let dateInputDate = new Date(dateInput);
  let dateString = `${dateInputDate.getFullYear()}-${dateInputDate.getMonth()}-${dateInputDate.getDate()}`;
  tableBody = document.getElementById("tableBody");
  if (
    dateInputDate < today &&
    dateInput != "" &&
    countryInput != "" &&
    dateString != todayString
  ) {
    fetch(
      `https://api.covid19api.com/country/${countryInput}?from=${dateInput}T00:00:00Z&to=${dateInput}T23:00:00Z`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(todayString)
        let outputTable = `<tr>
       <th>Date</th>
       <th>Country</th>
       <th>Confirmed</th>
       <th>Deaths</th>
       <th>Recovered</th>
       </tr>`;
        if (data != "") {
          data.forEach((country) => {
            // when there is data => make table and chart
            if (data != "") {
              outputTable += `
         <tr>
           <td>${country.Date}</td>
           <td>${country.Country}</td>
           <td>${country.Confirmed}</td>
           <td>${country.Deaths}</td>
           <td>${country.Recovered}</td>
         </tr>
         `;

              tableBody.innerHTML = outputTable;
              chart(country);
            } else {
              console.log("no data");
            }
          });
        } else {
          tableBody.innerHTML = "";
          document.getElementById("country").value = "";
          document.getElementById("date").value = "";
          chart(" ");
          alert("no data for this date");
        }
      });
  }
  if (dateInputDate > today || dateString == todayString) {
    tableBody.innerHTML = "";
    document.getElementById("date").value = "";
    chart(" ");
    alert("No data available for this date");
  }
}
