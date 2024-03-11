//earth.engr.ccny.cuny.edu
//Username: tarendra3
//Password: ShockWave#8099

// JSON Data
// {"TIMESTAMP": Date,  
// "AirTF": Number | null (in Python None),
// "RH": Number | null (in Python None),
// "Rainfall_Tot": Number | null (in Python None)}


const nv = window.nv

// BaseURL for backend link
const baseUrl = "http://127.0.0.1:5000/"
// const baseUrl = "https://earth.noaacrest.org/uhmt/data/plot_data_Folder/"

const timeMapping = {
  "Daily": "daily_plot_data/",
  "Weekly": "weekly_plot_data/",
  "Monthly": "monthly_plot_data/",
  "Yearly": "yearly_plot_data/"
}



// add all the name of sites here and map it to corresponding site
const siteMapping = {
  "Queens Botanical Garden": "Site1_Queens_Botanical_Garden_Fifteen",
  "Queensborough Community College": "Site2_Queensborough_Community_College_Fifteen",
  "Ronald Edmonds Learning Center": "Site3_Ronald_Edmonds_Learning_Center_Fifteen",
  "James Madison High School": "site-4",//Change this
  "Middletown Plaza (NYCHA)": "Site5_Middletown_Houses_Fifteen",
  "Dyckman Houses (NYCHA)": "Site6_Dyckman_Houses_Fifteen",
  "Williamsburg Houses (NYCHA)": "Site7_Williamsburg_Houses_Fifteen",
  "Eagle Academy High School": "Site8_Polo_Ground_Fifteen",
  "Far Rockway (NYCHA)": "Site9_Far_Rockaway_Fifteen",
  "BayView (NYCHA)": "Site10_BayView_Fifteen",
  "Baisley Park (NYCHA/School)": "Site11_Baisley_Park_Fifteen",
  "East River (NYCHA)": "Site12_East_River_Fifteen",
  "Astoria Houses (NYCHA)": "Site13_Astoria_Fifteen",
  "Haber Houses (NYCHA)": "Site14_Haber_Coney_Island_Fifteen",
  "Walt Whitman Middle School": "Site15_Walt_Whitman_MS_Fifteen",
  "JHS 14 High School": "Site16_JHS_High_School_Fifteen",
  "BASE High School" : "site-18",//Change this
  "Mary D. Carter School (PS151Q)": "Site18_MDC_School_Fifteen",
  "Montauk IS and High School" : "site-19",//Change this
  "Susan Wagner High School" : "site-20",//Change this
  "New York Harbor School": "Site22_New_York_Harbor_School_Fifteen",
}

// Corresponding site to address 
const siteAddress_map = {
  "Queens Botanical Garden": "43-50 Main St, Flushing, NY 11355",
  "Queensborough Community College": "222-05 56th Ave, Bayside, NY 11364",
  "Ronald Edmonds Learning Center": "300 Adelphi St, Brooklyn, NY 11205",
  "James Madison High School": "3787 Bedford Ave, Brooklyn, NY 11229-4",
  "Middletown Plaza (NYCHA)": "3033 Middletown Rd, Bronx, NY 10461",
  "Dyckman Houses (NYCHA)": "3754 10th Ave, New York, NY 10034",
  "Williamsburg Houses (NYCHA)": "176 Maujer St, Brooklyn, NY 11206",
  "Eagle Academy High School": "6 Edgecombe Ave, New York, NY 10030",
  "Far Rockway (NYCHA)": "38-20 Beach Channel Dr, Far Rockaway, NY 11691",
  "BayView (NYCHA)": "61 Pike St, New York, NY 10002",
  "Baisley Park (NYCHA/School)": "116-45 Guy R Brewer Blvd, Jamaica, NY 11434",
  "East River (NYCHA)": "418 East 105TH Street, NY, NY 10029",
  "Astoria Houses (NYCHA)": "4-25 Astoria Blvd, Astoria, NY 11102",
  "Haber Houses (NYCHA)": "2410 Surf Ave Brooklyn, NY 11224",
  "Walt Whitman Middle School": "72 Veronica Place Brooklyn, NY  11226",
  "JHS 14 High School": "2424 Batchelder St, Brooklyn, NY 11235",
  "BASE High School" : "883 Classon Ave, Brooklyn, NY 11225",
  "Mary D. Carter School (PS151Q)": "50-05 31st Ave, Woodside, NY 11377",
  "Montauk IS and High School" : "4200 16th Ave, Brooklyn, NY 11204",
  "Susan Wagner High School" : "1200 Manor Road, Staten Island, NY 10314",
  "New York Harbor School": "550 Short Ave, New York, NY 10004",
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
    // console.log("blob",blob)
    const siteTitle = document.querySelector('#current-site-title');
    // console.log('siteTitle',siteTitle.innerText)
    downloadLink.download = siteTitle.innerText + '.json';
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
    const siteTitle = document.querySelector('#current-site-title');
    // console.log('siteTitle',siteTitle.innerText)
    downloadLink.download = siteTitle.innerText + '.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    console.log("Download complete");
  } catch (error) {
    console.error("Error fetching or downloading CSV:", error);
  }
}


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
      var tickCount = 5; // Number of desired tick values
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

  // Select the x-axis text element and apply styles
  d3.selectAll('.nv-x text')
    .style("font-weight", "bold")
    .style("font-size", "30px");

  chart.xAxis.showMaxMin(false);
  chart.xAxis
    .tickValues(function(d) {
      var tickCount = 5; // Number of desired tick values
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



  chart.color(['#1f77b4']);
  chart.xAxis.showMaxMin(false)


  chart.yAxis.axisLabel(yLabel);
  chart.yAxis
    .tickFormat(d3.format('.3f')); // Specify the desired decimal precision


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


  if(chartId == 'chart3'){
    // FOR Y-SCALE TO ADJUST BASED ON DATA INPUTTED
    var yValues = data.map(function(d) {
      return d.y; 
    })

    // // Calculate the tick values based on the number of ticks
    // var tickValues = d3.scale.linear()
    // .domain([
    //   d3.min(yValues),
    //   d3.max(yValues)+(d3.max(yValues)/2)
    // ])
    // .ticks(5);//NUMBER OF TICKS YOU WANT
    // // Set the y-axis tick values
    // console.log(tickValues)
    // chart.yAxis.tickValues(tickValues);
    chart.yDomain([
        d3.min(yValues),
        d3.max(yValues)+(d3.max(yValues)/4)
    ]); 
    var step = 6,
    min = d3.min(yValues),
    max = d3.max(yValues)+(d3.max(yValues)/4  ),
    stepValue = (max - min) / (step - 1),
    tickValues = d3.range(min, max + stepValue, stepValue);
    chart.yAxis.tickValues(tickValues);


    chart.yAxis.showMaxMin(false);
  }
  else{ 
    chart.yDomain([0, 100]); 
    var step = 6,
    min = 0,
    max = 100,
    stepValue = (max - min) / (step - 1),
    tickValues = d3.range(min, max + stepValue, stepValue);
    chart.yAxis.tickValues(tickValues);
  }


  d3.select(`#${chartId} svg`)
    .datum([{ values: modifiedData }])
    .call(chart);

  
  nv.utils.windowResize(chart.update);

}


function updateCharts(json_data) {
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
    //const fetchUrl = baseUrl + siteMap + "-" + timeMap + ".json";
    const fetchUrl = baseUrl  + timeMap + siteMap + ".json" 
    const json_data = await fetchData(fetchUrl);

    console.log("FETCH Success TimeClick",fetchUrl);

    // data is fetched, update all charts with the corresponding json data
    console.log("Timezone",json_data);
    updateCharts(json_data); 
  }
  catch{
    // fetch failed, so update chart with no data
    //const fetchUrl = baseUrl + siteMap + "-" + timeMap + ".json";
    const fetchUrl = baseUrl  + timeMap + siteMap + ".json" 
    console.log("Fetch Failed?",fetchUrl);
    updateCharts([]);
  }
}

async function onSiteClick(e) {

  const siteSelected = e.target.innerText;
  currentSite = siteSelected;

  // update Title
  const siteTitle = document.querySelector('#current-site-title');
  siteTitle.innerHTML = currentSite;

  // update Address
  const siteAddress = document.querySelector('#current-site-address');
  siteAddress.innerHTML = siteAddress_map[e.target.innerText];

  // highlight current site
  highlightSite(e.target);

  // highlight daily time
  const defaultTime = document.querySelector('.default-time');
  highlightTime(defaultTime);
  
  // fetch site data json
  const siteMap = siteMapping[currentSite];
  try{
    //const fetchUrl = baseUrl + siteMap + "-" + timeMapping[defaultTime.innerHTML] + ".json";
    const fetchUrl = baseUrl + timeMapping[defaultTime.innerHTML] + siteMap + ".json";
    const json_data = await fetchData(fetchUrl);
    // data is fetched, update all charts with the corresponding json data
    updateCharts(json_data); 
  }
  catch (error){
    // fetch failed, so update chart with no data
    console.error("FETCH Failed", error);
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
    //const fetchUrl = baseUrl + siteMap + "-" + timeMapping[defaultTime.innerHTML] + ".json";
    const fetchUrl = baseUrl + timeMapping[defaultTime.innerHTML] + siteMap + ".json";
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

