import React, { Component, useState, useEffect } from 'react';
import MonthYearPicker from 'react-month-year-picker';
import "./App.css";
import useAsyncFetch from './useAsyncFetch'; // a custom hook
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';

const months = [
  "January",
  "Feburary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

function App() {
  const [showMore, setShowMore] = useState(false);
  const show = showMore ? 'See Less' : 'See More'

  const [showPicker, setShowPicker] = useState(false);
  const [monthYear, setMonthYear] = useState({ 'year': 2020, 'month': 4 })
  let [reservoirs, setReservoirs] = useState([])
  
  useAsyncFetch('/query/getCDECData', {}, thenFun, catchFun, monthYear);

  function thenFun(result) {
    setReservoirs(result);
    // render the list once we have it
  }

  function catchFun(error) {
    console.log(error);
  }

  if (monthYear)
    console.log(monthYear.year, monthYear.month)

  const picker = <div id='MonthYearPicker'>
    <MonthYearPicker
    caption=""
    selectedMonth={monthYear.month}
    selectedYear={monthYear.year}
    minYear={1800}
    maxYear={3000}
    onChangeYear={year => handlePickerChange(year, monthYear.month)}
    onChangeMonth={month => handlePickerChange(monthYear.year, month)}
  />
  </div>

  function thenFun2(result) {
    let reservoirs2 = []
    reservoirs2 = result;
    console.log(reservoirs2);
  }
  const handlePickerChange = (...args) => {
    setMonthYear({ year: args[0], month: args[1] });
    setShowPicker(false);
  };


  const header = <div id="header">
    <h2>Water storage in California reservoirs</h2>
  </div>

  const extraContent = <div id="row2">

    <DisplayWater reservoirs={reservoirs} />
    <div id="changeMonth">
      <p>
        Here's a quick look at some of the data on reservoirs from the{" "}
        <a href="https://cdec.water.ca.gov/index.html">
          California Data Exchange Center
        </a>
        , which consolidates climate and water data from multiple federal and
        state government agencies, and electric utilities. Select a month and
        year to see storage levels in the eleven largest in-state reservoirs.
      </p>
      <p id='changeMonthLabel'>
        Change Month:
      </p>
      <button className="monthYearPicker" onClick={() => setShowPicker(!showPicker)}>{months[monthYear.month - 1]} {monthYear.year}</button>
      {showPicker && picker}

    </div>
  </div>

  const content = <div id="row1">
    <div id="text1">

      <p>
        California's reservoirs are part of a{" "}

        <a href="https://www.ppic.org/wp-content/uploads/californias-  water-storing-water-november-2018.pdf">
          complex water storage system
        </a>
        . The State has very variable weather, both seasonally and from
        year-to-year, so storage and water management is essential. Natural
        features - the Sierra snowpack and vast underground aquifers - provide
        more storage capacity, but reservoirs are the part of the system that
        people control on a day-to-day basis. Managing the flow of surface water
        through rivers and aqueducts, mostly from North to South, reduces
        flooding and attempts to provide a steady flow of water to cities and
        farms, and to maintain natural riparian habitats. Ideally, it also
        transfers some water from the seasonal snowpack into long-term
        underground storage. Finally, hydro-power from the many dams provides
        carbon-free electricity.
      </p>

      <p>
        California's water managers monitor the reservoirs carefully, and the
        state publishes daily data on reservoir storage.
      </p>
      <button className="btn" onClick={() => setShowMore(!showMore)}>{show}</button>
    </div>

    <figure id="image">
      <img
        src="https://cdn.theatlantic.com/thumbor/HYdYHLTb9lHl5ds-IB0URvpSut0=/900x583/media/img/photo/2014/09/dramatic-photos-of-californias-historic-drought/c01_53834006/original.jpg" />
      <figcaption>Lake Oroville in the 2012-2014 drought. Image credit Justin Sullivan, from
      The Atlatic article Dramatic Photos of California's Historic Drought.</figcaption>
    </figure>
  </div>

  return (
    <main>
      {header}
      {content}
      {showMore && extraContent}
    </main>
  );
}

function DisplayWater(reservoirs) {

  console.log(reservoirs.reservoirs)

  if (reservoirs.reservoirs && reservoirs.reservoirs.length != 0) {
    return (
      <ReservoirChart reservoirs={reservoirs.reservoirs}></ReservoirChart>
    )
  } else {
    return (
      <p>
        loading...
    </p>);
  }
}


function ReservoirChart(reservoirs) {
  const names = ["Shasta", "Oroville", "Trinity Lake", "New Melones", "San Luis", "Don Pedro", "Berryesa"]
  const capacities = [4552000, 3537577, 2447650, 2400000, 2041000, 2030000, 1602000]
  console.log(reservoirs.reservoirs[0])

  let totalCapacity = { label: "Total Capacity", data: [], backgroundColor: ["rgb(120,199,227)"], categoryPercentage: 0.7, barPercentage: 0.7};

  let storageLevel = { label: "Current Storage Level", data: [], backgroundColor: ["rgb(66,145,152)"], categoryPercentage: 0.7, barPercentage: 0.7};

  let labels = []
  for (let i = 0; i < reservoirs.reservoirs.length; i++) {
    storageLevel.data.push(reservoirs.reservoirs[i].value);
    totalCapacity.data.push(capacities[i]);
    labels.push(names[i]);
  }

  let userData = {};
  userData.labels = labels;
  userData.datasets = [storageLevel, totalCapacity];
  let options = {
    plugins: {
      legend: {
        display: false
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
                    maxRotation: 60,
                    minRotation: 60
                }
      },

      y: {
        stacked: false,
        grid: {
          display: false
        },
        ticks: {
          callback: function(value) {
            return value / 100000;
          },
          stepSize: 1000000
        }
      }
    }
  };

  return (
    <div id="chart-container">
      <Bar options={options} data={userData} />
    </div>
  )

}

export default App;