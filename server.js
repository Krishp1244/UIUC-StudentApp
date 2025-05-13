// initialize the application packages
const express = require("express");
const app = express();
const https = require("https");
const cheerio = require("cheerio");
const axios = require("axios");

// allow static url requests to the public folder and subfolders (for images, etc.)
app.use(express.static("public"));
// listen for requests - the main job of this code
// when a request comes in, process it using one of the app.get functions below
const listener = app.listen(process.env.PORT, function() {
  console.log("Express app is listening on port " + listener.address().port);
});

/* 
 * INDEX PAGE REQUEST
 * This is the basic default request for "/" 
 * This function sends back the index.html file
 */
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

/*
 * API GET REQUEST
 * This is a request for some simple API data. 
 * This function makes an API GET request and wait for an apiResponse
 * If successful, it sends back a response with the data to client.js
 * Any errors are logged to the _server_ console and a response 500 with error message is sent to client.js
 */

app.get("/diningData", async function(request, response) {
  const url = "http://uiuc-api.herokuapp.com/dining/information";
  try {
    const apiResponse = await axios.get(url);
    response.send(apiResponse.data);
  } catch (error) {
    console.log(error.message);
    response.status(500).send(error.message);
  }
});

app.get("/weatherData", async function(request, response) {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=40.1106&longitude=-88.2073&hourly=temperature_2m,wind_speed_80m,precipitation&timezone=America%2FChicago&forecast_days=3&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch";
  try{
    const apiResponse = await axios.get(url);
    response.send(apiResponse.data);
  } catch (error){
    console.log(error.message);
    response.status(500).send(error.message);
  }
});


app.get("/calendarData", async function (request, response) {
  const urlFall = "https://registrar.illinois.edu/fall-2025-academic-calendar/";
  const urlSpring = "https://registrar.illinois.edu/academic-calendars/academic-calendars-archive/spring-academic-calendar-26/";

  try {
    const [fallRes, springRes] = await Promise.all([axios.get(urlFall), axios.get(urlSpring)]);
    const htmlText = fallRes.data + springRes.data;

    const regex = /class="wp-block-heading">([\S\s]*?)(<\/h[\S\s]*?<li>)([\S\s]*?)<\/li>/g;
    const matchArray = [...htmlText.matchAll(regex)];

    let events = [];
    for (const match of matchArray) {
      let event = { date: match[1].trim(), event: match[3].trim() };
      events.push(event);
    }

    response.send({ events: events });
  } catch (error) {
    console.log(error.message);
    response.status(500).send(error.message);
  }
});

app.get("/cslinguistics", async function (request, response) {
  const url = "https://siebelschool.illinois.edu/academics/undergraduate/degree-program-options/cs-x-degree-programs/computer-science-linguistics";
  try {
    const apiResponse = await axios.get(url);
    const htmlText = apiResponse.data;
    const $ = cheerio.load(htmlText);
    
    let result = [];
    
    // Scrape all h2 and h3 headings with their following paragraphs
    $('h2, h3').each((index, element) => {
      const heading = $(element).text().trim();
      const nextPara = $(element).next('p').text().trim();
      result.push({
        heading: heading,
        description: nextPara
      });
    });
    
    // Send the structured data as a JSON response
    response.send({ sections: result });
  } catch (error) {
    console.log(error.message);
    response.status(500).send(error.message);
  }
});






/*
 * API POST REQUEST
 * This is a request for some more complex API data
 * that uses an API key stored in .env
 * This function makes an API POST request with (optional) data, headers, and parameters.
 * If successful, it sends back a response with the data to client.js
 * Any errors are logged to the _server_ console and a response 500 with error message is sent to client.js
 */
app.get("/apiPost", async function(request, response) { 
  const url = "https://reqbin.com/echo/post/json";
  const data = {
    "Id": 101,
    "Name": "Some Person",
  };
  const options = {
    headers: {
      "Accept": 'application/json',
      "Content-Type": 'application/json'
    }  }
  try{
    const apiResponse = await axios.post(url, data, options);
    response.send(apiResponse.data);
  } catch (error){
    console.log(error.message);
    response.status(500).send(error.message);
  }
});



