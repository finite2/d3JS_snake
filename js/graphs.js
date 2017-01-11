

function updateGraphSizevalues(){
  fullWidth = d3.select('#graph').node().getBoundingClientRect().width - 10;
  fullHeight = fullWidth * 4 / 6;
}


updateGraphSizevalues();
// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = fullWidth - margin.left - margin.right,
    height = fullHeight - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%d-%b-%y").parse;

// Set the ranges
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });
    
// Adds the svg canvas
var svg = d3.select("#graph")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data




// Scale the range of the data
x.domain([-1, 5]);
y.domain([0, 1]);

var cols = ['white', 'red'];

data = getLine(curve, {a: a, b: b},-1,5,100)

// Add the valueline path.
svg.append("path")
  .attr("class", "line")
  .attr("d", valueline(data));

// Add the X Axis
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .style('fill', 'white')
  .call(xAxis);

// Add the Y Axis
svg.append("g")
  .attr("class", "y axis")
  .style('fill', 'white')
  .call(yAxis);


patients = -1
patientData = []

var summaryData = [
  {e: 0, n: 0},
  {e: 0, n: 0},
  {e: 0, n: 0},
  {e: 0, n: 0},
  {e: 0, n: 0}
]

newPatient = function() {
  patients ++
  dose = rinteger(0,4);
  event = rbern(0.5)
  dta = {
    x: dose,
    y: event,
    ecount: event === 1 ? summaryData[dose].e + 1: summaryData[dose].n + 1
  }
  patientData.push(dta)
  
  if(event){
    summaryData[dose].e += 1;
  } else {
    summaryData[dose].n += 1;
  }
    
}




svg.append('g')
  .attr('id', 'patients');

var patientUI = d3.select('#patients');
param = {}
param.speed = 1000

function addPatient() {
  newPatient();
  patientUI.append('circle')
  .attr('id','p' + patients)
  .attr('cx', x(-1))
  .attr('cy', y(0.5))
  .attr('r', 10)
  .attr('fill', 'purple')
  .transition()
    .duration(param.speed)
    .attr('cx',x(patientData[patients].x))
    .transition()
      .duration(param.speed)
      .attr('cy',y(1-patientData[patients].y + (patientData[patients].y === 1 ? 0.05*patientData[patients].ecount: -0.05*patientData[patients].ecount)))
      .attr('fill', cols[patientData[patients].y])
}

function addPatients(n) {
  for(var i=0; i<n; i++){
    setTimeout(function() {addPatient()}, i * 2*param.speed)
  }
}


// ** Update data section (Called from the onclick)
function updateData(data) {

  // Scale the range of the data again 
  // x.domain(d3.extent(data, function(d) { return d.x; }));
  // y.domain([0, d3.max(data, function(d) { return d.y; })]);

  // Select the section we want to apply our changes to
  var svg = d3.select("body").transition();

  // Make the changes
  svg.select(".line")   // change the line
    .duration(1500)
    .attr("d", valueline(data));
  svg.select(".x.axis") // change the x axis
    .duration(1500)
    .call(xAxis);
  svg.select(".y.axis") // change the y axis
    .duration(1500)
    .call(yAxis);

}

a = -3
b = 1
data = getLine(curve, {a: a, b: b},-1,5,100)
updateData(data)