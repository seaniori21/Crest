//earth.engr.ccny.cuny.edu
//Username: tarendra3
//Password: ShockWave#8099

// JSON Data
// {"TIMESTAMP": Date,  
// "AirTF": Number | null (in Python None),
// "RH": Number | null (in Python None),
// "Rainfall_Tot": Number | null (in Python None)}


const nv = window.nv

// need to change base URL
// file needs to be in this baseURl
// We will change baseURL into the backend url proxy

//const baseUrl = "https://raw.githubusercontent.com/szhangCCNY/weatherProjectTest/main/"
 const baseUrl = "http://127.0.0.1:5000/"

const timeMapping = {
  "Daily": "1D",
  "Weekly": "1W",
  "Monthly": "1M",
  "Yearly": "1Y"
}


// add all the name of sites here and map it to corresponding site
const siteMapping = {
  "Site 1 - Queens Botanical Garden": "Site1_Queens_Botanical_Garden_Fifteen",
  "Site 2 - Queensborough Community College": "Site2_Queensborough_Community_College_Fifteen",
  "Site 3 - Ronald Edmonds Learning Center": "Site3_Ronald_Edmonds_Learning_Center_Fifteen",
  "Site 4 - Astoria": "site-4",
  "Site 5 - Middletown Houses": "Site5_Middletown_Houses_Fifteen",
  "Site 6 - Dyckman Houses": "Site6_Dyckman_Houses_Fifteen",
  "Site 7 - Williamsburg Houses": "Site7_Williamsburg_Houses_Fifteen",
  "Site 8 - Polo Ground": "Site8_Polo_Ground_Fifteen",
  "Site 9 - Far Rockaway": "Site9_Far_Rockaway_Fifteen",
  "Site 10 - Bay View": "Site10_BayView_Fifteen",
  "Site 11 - Baisley Park": "Site11_Baisley_Park_Fifteen",
  "Site 12 - East River": "Site12_East_River_Fifteen",
  "Site 13 - Astoria": "Site13_Astoria_Fifteen",
  "Site 14 - Haber Coney Island": "Site14_Haber_Coney_Island_Fifteen",
  "Site 15 - Walt Whitman MS": "Site15_Walt_Whitman_MS_Fifteen",
  "Site 16 - JHS High School": "Site16_JHS_High_School_Fifteen",
  "Site 17 - Haber Coney Island" : "site-18",
  "Site 18 - MDC School": "Site18_MDC_School_Fifteen",
  "Site 19 - Haber Coney Island" : "site-19",
  "Site 20 - Haber Coney Island" : "site-20",
  "Site 21 - Haber Coney Island": "site-21",
  "Site 22 - New York Harbor School": "Site22_New_York_Harbor_School_Fifteen",
}

// fetch data from this url 
// baseUrl + siteMapping[siteName] + "-" + timeMapping[time]
// base/site-10-1Y
// example fetch url : example.com/site-10-1Y


// currentSite is a global variable
// makes it easier to select time
let currentSite;
let jsonDataD;

// chartName gets name of HTML element for rendering
const chartId = 'chart1' // temperature
const chartId2 = 'chart2' // humility
const chartId3 = 'chart3' // rainfall

// Border size or look
const borderStyle = '2px solid #ccc'
const borderMargin = '5px'

async function fetchData(url) {
  try {
    const resp = await fetch(url);
    
    if (!resp.ok) {
      throw new Error('HTTP error! Status: ${resp.status}');
    }
    
    const json = await resp.json();
    jsonDataD = json;
    //console.log('Fetch Data Json:', json);
    
    return json;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function downloadJson() {
  try {
    const jsonData = jsonDataD;
    
    // Blob data
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });

    // Link element for download
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    console.log("blob",blob)
    downloadLink.download = 'data.json';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    console.log("Download complete");
  } catch (error) {
    console.error("Error fetching or downloading JSON:", error);
  }
}

function json2csv(json){
  // Extract column headers from the first object in the JSON array
  const headers = Object.keys(json[0]);

  // Convert the data to CSV format
  const csv = [
    headers.join(','),
    ...json.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');

  return csv;
}

async function downloadCSV() {
  try {
    const csvData = json2csv(jsonDataD)
    
    // Blob data
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Link element for download
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = 'datac.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    console.log("Download complete");
  } catch (error) {
    console.error("Error fetching or downloading CSV:", error);
  }
}




// JSON Data
// {"TIMESTAMP": Date,  
// "AirTF": Number | null (in Python None),
// "RH": Number | null (in Python None),
// "Rainfall_Tot": Number | null (in Python None)}


function processJsonData(json_data, category) {
  const proc_data = json_data.map((entry) => { return { "x": new Date(entry["TIMESTAMP"]), "y": entry[category] } });
  // console.log(proc_data);
  return proc_data
}



function createChart(chartId, xLabel, yLabel) {
  const chart = nv.models.lineChart();

  chart.xAxis.axisLabel(xLabel)
    .tickFormat(function(d) {
      date = new Date(d);
      hour = date.getHours();
      minutes = date.getMinutes();
      if (hour == 0 && minutes == 0){
        return d3.time.format("%m-%d-%y")(date);
      }
      else{
        return d3.time.format('%m-%d-%y : %H:%M')(new Date(d));        
      }
    })

  // Select the x-axis text element and apply styles
  d3.selectAll('.nv-x text')
    .style("font-weight", "bold")
    .style("font-size", "30px");

  chart.xAxis.showMaxMin(false);
  chart.xAxis
    .tickValues(function(d) {
      var tickCount = 6; // Number of desired tick values
      var values = [];
      var dataLength = d[0].values.length;

      wholeDates = [];
      for (var i = 0; i < dataLength; i++){
        date = d[0].values[i].x;
        hour = date.getHours();
        minute = date.getMinutes();
        if (hour == 0 && minute == 0){
          // console.log("dates",date);
          wholeDates.push(date);
        }
      }

      // now we have x num of dates split the dates in tickCounts
      // for one day case
      if (wholeDates.length == 1){
        var step = Math.floor(dataLength / (tickCount - 1));
        for (var i = step - 1; i < dataLength - step; i += step) {
          values.push(d[0].values[i].x);
        }        
      }
      else {
        var dataLength = wholeDates.length;

        var step = Math.floor(dataLength / (tickCount - 1));
        if (step<1){
          step +=1;
        }
        for (var i = 0; i < wholeDates.length; i += step) {
          values.push(wholeDates[i]);
        }
      }
      return values;
    });


  chart.yAxis.axisLabel(yLabel);
  
  // Add borders to the chart lines
  d3.select(`#${chartId} svg`)
    .style('border', borderStyle)
    .style('margin', borderMargin )
    .style('background-color', '#f7f7f7')
    .datum([])
    .call(chart);

  chart.showLegend(false);
  nv.utils.windowResize(chart.update);
  return chart;
}

function createBarChart(chartId, xLabel, yLabel) {
  const chart = nv.models.discreteBarChart();

  chart.xAxis.axisLabel(xLabel)
    .tickFormat(function(d) {
      date = new Date(d);
      hour = date.getHours();
      minutes = date.getMinutes();
      if (hour == 0 && minutes == 0){
        return d3.time.format("%m-%d-%y")(date);
      }
      else{
        return d3.time.format('%m-%d-%y : %H:%M')(new Date(d));        
      }
    })

  chart.xAxis
    .tickValues(function(d) {
      var tickCount = 6; // Number of desired tick values
      var values = [];
      var dataLength = d[0].values.length;

      wholeDates = [];
      // get whole dates
      for (var i = 0; i < dataLength; i++){
        date = d[0].values[i].x;
        hour = date.getHours();
        minute = date.getMinutes();
        if (hour == 0 && minute == 0){
          wholeDates.push(date);
        }
      }
      // console.log(wholeDates);
      // now we have x num of dates split the dates in tickCounts
      // for one day case
      if (wholeDates.length == 1){
        var step = Math.floor(dataLength / (tickCount - 1));
        for (var i = step - 1; i < dataLength - step; i += step) {
          values.push(d[0].values[i].x);
        }        
      }
      else {
        var dataLength = wholeDates.length;
        var step = Math.floor(dataLength / (tickCount - 1));

        if (step < 1) {
          step = 1
        }
        for (var i = step - 1; i < dataLength - step; i += step) {
          values.push(wholeDates[i]);
        }
      }
      return values;
    });

  chart.color(['#1f77b4']);


  chart.yAxis.axisLabel(yLabel);

  chart.yAxis
    .tickFormat(d3.format('.2f')); // Specify the desired decimal precision


  d3.select(`#${chartId} svg`)
    .style('border', borderStyle)
    .style('margin', borderMargin )
    .style('background-color', '#f7f7f7')
    .datum([])
    .call(chart);

  chart.showLegend(false);
  nv.utils.windowResize(chart.update);
  return chart;
}

const chart1 = createChart("chart1", "Time", "AirTF")
const chart2 = createChart("chart2", "Time", "RH")
const chart3 = createBarChart("chart3", "Time", "RainFall")

// chartMap maps chartId to chart variable in javascript
const chartMap = {
  "chart1": chart1,
  "chart2": chart2,
  "chart3": chart3
}

// this function finds max and min of Y axis
// the purpose of this is to set the bounds of Y 
function findMinMax(data){
  if (data.length > 0) {
    const minMax = data.reduce((accumulator, currVal) => {
      const min = Math.min(accumulator[0], currVal.y);
      const max = Math.max(accumulator[1], currVal.y);
      return [min, max];
    }, [data[0].y, data[0].y]);
  
    //console.log("Findminmax", minMax);
    return minMax;
  }
  console.log("data is < 0")
  return [-Infinity, Infinity];  
}


function updateChart(chartId, data) {
  const chart = chartMap[chartId]

   // Replace y-values with 0 to null to create gaps in the chart
  const modifiedData = data.map(entry => {
    if (entry && entry.y != null) {
      return {
        x: entry.x != null ? entry.x : null,
        y: typeof entry.y === 'number' && entry.y !== 0 ? parseFloat(entry.y.toFixed(2)) : null
      };
    } else {
      return null; // or handle the case when entry or entry.y is null
    }
  });

  // calculate custom Y domain
  const minMaxY = findMinMax(modifiedData);
  //console.log("minMax: ",chartId , minMaxY);
 

  let minY = minMaxY[0];
  let maxY = minMaxY[1];
  // let minY = 0;
  // let maxY = 100;

  let new_minY;
  let new_maxY;

  if (Math.abs(maxY) < 1 && Math.abs(maxY) > 0) {
    new_maxY = Math.round(maxY * 100) / 100
  }
  else{
    new_maxY = Math.ceil(maxY / 10) * 10;
  }
  
  if (Math.abs(minY) < 1 && Math.abs(minY) > 0) {
    new_maxY = Math.round(minY * 100) / 100
  }
  else{
    new_minY = Math.floor(minY / 10) * 10;
  }


  // chart.yDomain([new_minY, new_maxY]);
  // chart.yDomain([0, 100]);

  //
  // var yValues = data.map(function(d) {
  //   return d.y; 
  // })
  // // Calculate the tick values based on the number of ticks
  // var tickValues = d3.scale.linear()
  // .domain([
  //   d3.round(d3.min(yValues),1),
  //   d3.round(d3.max(yValues),1)
  // ])
  // .ticks(5);//NUMBER OF TICKS YOU WANT

  // Set the y-axis tick values
  chart.yAxis.ticks(5);
  chart.yAxis.showMaxMin(true);

  d3.select(`#${chartId} svg`)
    .datum([{ values: modifiedData }])
    .call(chart);

  
  nv.utils.windowResize(chart.update);

}


function updateCharts(json_data) {
  console.log("UpdateCharts: ",json_data);
  const airTf = processJsonData(json_data, "AirTF");
  const rh = processJsonData(json_data, "RH");
  const rainFall = processJsonData(json_data, "Rainfall_Tot");

  updateChart("chart1", airTf);
  updateChart("chart2", rh);
  updateChart("chart3", rainFall);

}

function highlightTime(e){
  // un-highlight current highlighted element
  // console.log(e);
  const currHighlight = document.querySelector('.time-controller.highlight');
  if (currHighlight){
    currHighlight.classList.toggle("highlight");
  }
  // highlight e by toggling highlight
  e.classList.toggle('highlight');
}

function highlightSite(e){
  // un-highlight current highlighted element
  // console.log(e);
  const currHighlight = document.querySelector('.site-controller.highlight');
  // console.log(currHighlight);
  if (currHighlight){
    currHighlight.classList.toggle("highlight");
  }
  // highlight e by toggling highlight
  e.classList.toggle('highlight');
}

// get the 1d, 1w, 1m, 1y, from timeMap - depends on which time text selected
// get the site from the current site selected 
// build fetchUrl with site and time
// by following : fetchUrl = baseUrl + siteMap + "-" + timeMap + ".json"
async function onTimeClick(e) {
  timeSelected = e.target.innerText;
  // maybe highlight current time
  siteMap = siteMapping[currentSite]
  timeMap = timeMapping[timeSelected];

  highlightTime(e.target);
  try{
    const fetchUrl = baseUrl + siteMap + "-" + timeMap + ".json";
    const json_data = await fetchData(fetchUrl);

    console.log("FETCH Success TimeClick",fetchUrl);

    // data is fetched, update all charts with the corresponding json data
    console.log("Timezone",json_data);
    updateCharts(json_data); 
  }
  catch{
    // fetch failed, so update chart with no data
    const fetchUrl = baseUrl + siteMap + "-" + timeMap + ".json";
    console.log("Fetch Failed?",fetchUrl);
    updateCharts([]);
  }
}

async function onSiteClick(e) {
  console.log('onSiteClick called', e.target.innerText);

  const siteSelected = e.target.innerText;
  currentSite = siteSelected;

  // update Title
  const siteTitle = document.querySelector('#current-site-title');
  siteTitle.innerHTML = currentSite;

  // highlight current site
  highlightSite(e.target);

  // highlight daily time
  const defaultTime = document.querySelector('.default-time');
  highlightTime(defaultTime);
  
  // fetch site data json
  const siteMap = siteMapping[currentSite];
  try{
    const fetchUrl = baseUrl + siteMap + "-" + timeMapping[defaultTime.innerHTML] + ".json";
    const json_data = await fetchData(fetchUrl);
    console.log("FETCH Success Site Click",fetchUrl);
    // data is fetched, update all charts with the corresponding json data
    updateCharts(json_data); 
  }
  catch (error){
    // fetch failed, so update chart with no data
    console.error("FETCH Failed site click", error);
    updateCharts([]);
  }
}

async function initDefaultCharts(){
  
  const defaultTime = document.querySelector(".time-controller.default-time");
  const defaultSite = document.querySelector(".site-controller.default-site");
  currentSite = defaultSite.innerHTML; 
  const siteTitle = document.querySelector('#current-site-title');
  siteTitle.innerHTML = currentSite;
  highlightTime(defaultTime);
  highlightSite(defaultSite);
  const siteMap = siteMapping[currentSite];
  try{
    const fetchUrl = baseUrl + siteMap + "-" + timeMapping[defaultTime.innerHTML] + ".json";
    const json_data = await fetchData(fetchUrl);
    // data is fetched, update all charts with the corresponding json data
    updateCharts(json_data); 
  }
  catch{
    // fetch failed, so update chart with no data
    updateCharts([]);
  }
}



function main() {
  // // get the graph controller element
  const timeController = [...document.querySelectorAll('.time-controller')];
  // // get the site controller
  const siteController = [...document.querySelectorAll('.site-controller')];

  timeController.map((element) => {
    element.addEventListener("click", onTimeClick)
  })

  siteController.map((element) => {
    element.addEventListener("click", onSiteClick) 
  })

  // initialize default graph
  initDefaultCharts()
}

main();

