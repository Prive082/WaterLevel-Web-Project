// index.js
// This is our main server file
// include express
const express = require("express");
// create object to interface with express
const fetch = require("cross-fetch");
const app = express();
app.use(express.json());

// Code in this section sets up an express pipeline

const reservoirs = ["Shasta", "Oroville", "Trinity Lake", "New Melones", "San Luis", "Don Pedro", "Berryesa"]

const id = "SHA,ORO,CLE,NML,SNL,DNP,BER"

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})

app.post("/query/getCDECData", async function(req, res) {
  console.log("getting data", req.body);
  const date = req.body;
  let water = await lookupWaterData(date);
  res.json(water);
})

// No static server or /public because this server
// is only for AJAX requests

// respond to all AJAX querires with this message
app.use(function(req, res, next) {
  res.json({ msg: "No such AJAX request" })
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function() {
  console.log("The static server is listening on port " + listener.address().port);
});

async function lookupWaterData(data) {
  const api_url = "https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=" + id + "&SensorNums=15&dur_code=M&Start=" + data.year + "-"+ data.month + "&End=" + data.year + "-"+ data.month;
  console.log(api_url)
  // send it off

  let fetchResponse = await fetch(api_url);
  let response = await fetchResponse.json()
  return response;
}