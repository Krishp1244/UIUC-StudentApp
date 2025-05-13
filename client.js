
getWeatherData();
getQuoteData(); 
getCalendarData();
getCsLinguisticsData();

async function getWeatherData() {
  const response = await fetch("/weatherData");
  const data = await response.json();

  const temps = data.hourly.temperature_2m;
  const rain = data.hourly.precipitation;
  const times = data.hourly.time;

  let output = "";
  let currentDate = "";
  let dailyHigh = -Infinity;
  let dailyRain = 0;
  let daysShown = 0;

  const dayBlocks = [];

  for (let i = 0; i < times.length; i++) {
    const date = times[i].split("T")[0];

    if (currentDate === "") {
      currentDate = date;
    }

    if (date !== currentDate) {
      dayBlocks.push(formatWeather(currentDate, dailyHigh, dailyRain));
      daysShown++;
      if (daysShown === 3) break;

      currentDate = date;
      dailyHigh = temps[i];
      dailyRain = rain[i];
    } else {
      if (temps[i] > dailyHigh) dailyHigh = temps[i];
      dailyRain += rain[i];
    }
  }

  if (daysShown < 3) {
    dayBlocks.push(formatWeather(currentDate, dailyHigh, dailyRain));
  }

  document.getElementById("text2").innerHTML = `<div class="weather-grid">${dayBlocks.join("")}</div>`;
}

function formatWeather(dateStr, high, rain) {
  const date = new Date(dateStr);
  const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const icon = rain > 0.1 ? "🌧️" : "☀️";
  return `
    <div class="weather-day">
      <div><strong>${day}</strong></div>
      <div style="font-size: 30px">${icon}</div>
      <div>High: ${high.toFixed(1)}°F</div>
      <div>Rain: ${rain.toFixed(2)} in</div>
    </div>
  `;
}

setInterval(getQuoteData, 86400000);
getQuoteData();

async function getQuoteData() {
  try {
    const response = await fetch("https://api.api-ninjas.com/v1/quotes", {
      method: "GET",
      headers: {
        "X-Api-Key": "27xpR/Qi0Abn2SdIwIKzgg==RR7yUWnxftfiBJa7"
      }
    });

    const data = await response.json();
    if (data && data.length > 0) {
      const quote = data[0].quote;
      const author = data[0].author;
      document.getElementById("quoteText").innerHTML = `<p class="quoteTextStyle">"${quote}"<br><span class="quoteAuthorStyle">– ${author}</span></p>`;
    } else {
      document.getElementById("quoteText").innerHTML = "Quote could not be fetched at this time.";
    }
  } catch (error) {
    document.getElementById("quoteText").innerHTML = "Error fetching quote.";
  }
}

let showFullYear = false;

async function getCalendarData() {
  const response = await fetch("/calendarData");
  const data = await response.json();
  console.log(data);

  let output = "<h4>UIUC Academic Calendar</h4>";

  if (showFullYear) {
    for (let i = 0; i < data.events.length; i++) {
      output += data.events[i].date + " - " + data.events[i].event + "<br>";
    }
  } else {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    let found = false;
    for (let i = 0; i < data.events.length; i++) {
      const eventDate = new Date(data.events[i].date);
      if (eventDate >= today && eventDate < nextWeek) {
        output += data.events[i].date + " - " + data.events[i].event + "<br>";
        found = true;
      }
    }
    if (!found) output += "No events this week.";
  }

  document.getElementById("text5").innerHTML = output;
}

function toggleCalendarView() {
  showFullYear = !showFullYear;
  getCalendarData();
  document.getElementById("toggleButton").innerText = showFullYear ? "Show This Week" : "Show Full Year";
}

async function getCsLinguisticsData() {
  const response = await fetch("/cslinguistics");
  const data = await response.json();
  console.log(data);

  let output = "<h4>CS + Linguistics Program Info</h4>";
  data.sections.forEach(section => {
    output += "<strong>" + section.heading + ":</strong> " + section.description + "<br><br>";
  });

  document.getElementById("scheduleData").innerHTML = output;


}
document.addEventListener("DOMContentLoaded", function() {
  const btn = document.getElementById("toggleScheduleBtn");
  const scheduleDiv = document.getElementById("scheduleData");

  btn.addEventListener("click", function() {
    if (scheduleDiv.style.display === "none") {
      scheduleDiv.style.display = "block";
      btn.textContent = "Hide Schedule";
    } else {
      scheduleDiv.style.display = "none";
      btn.textContent = "Show Schedule";
    }
  });
});


async function getPostTestData() {
  const response = await fetch("/apiPost");
  const data = await response.json();
  console.log(data);
  document.getElementById("text4").innerHTML = data.success;
}
