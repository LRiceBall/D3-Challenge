// @TODO: YOUR CODE HERE!
// Refer to the pdf diagram to see the visual relationship of the code




// function used for updating x-scale var upon click on axis label
// scaling function: https://www.d3indepth.com/scales/
function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);  //width define at beginning of main code
  
    return xLinearScale;
  
  }
  // function used to update y-scale
  function yScale(stateData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenYAxis] * 0.9),
        d3.max(stateData, d => d[chosenYAxis] * 1.1)
      ])
      .range([height, 0]);  //width define at beginning of main code
  
    return yLinearScale;
  
  }

  // function used for updating xAxis var upon click on axis label
  function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
  // function used for updating yAxis var upon click on axis label
  function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

  // function used for updating circles group with a transition to
  // new circles upon click on axis label
  function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
  
    // function used for updating circles group with a transition to
  // new circles upon click on axis label
  function rendertextCircles(textcirclesGroup, newXScale, chosenXAxis) {
  
      textcirclesGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));
    
      return textcirclesGroup;
    }

    function rendertextCirclesY(textcirclesGroup, newYScale, chosenYAxis) {
  
        textcirclesGroup.transition()
          .duration(1000)
          .attr("y", d => newYScale(d[chosenYAxis]) + 3);
      
        return textcirclesGroup;
      }
    
  
  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, circlesGroup) {
  
    var label;
  
    if (chosenXAxis === "poverty") {
      label = "In Poverty (%):";
    }
  
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
      });

    // append tool tip
    circlesGroup.call(toolTip);
   
    circlesGroup.on("mouseover", function(data, index, element) {
      toolTip.show(data, index, element); //<--- removed 'this'
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }





//SVG Setup

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// xScale uses width so xScale() can only be called below this point
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



// Upload data

// Initial Params - includes any axis selection that has multiple options
var chosenXAxis = "poverty";


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(healthData, err) {
  if (err) throw err;
   
  // parse data - set values to numerical data types
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
    data.abbr = data.abbr;
    data.state = data.state;
  });

  // Data Exploration (Section 1)
  console.log(healthData)



// Append Title


  // append y title to left side of chartGroup
  var yTitle = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obesity(%)");



// Append x-axis

  // xLinearScale function above csv import; Note:  xLinearScale is a function contains scaled data specific to the defined axis
  // Important note:  xScale uses width that is defined above; xScale can only be called below width in the code
  // scaling function: https://www.d3indepth.com/scales/
  var xLinearScale = xScale(healthData, chosenXAxis);
  // Create initial axis functions; generates the scaled axis
  var bottomAxis = d3.axisBottom(xLinearScale);
  // append x axis; adds x axis chart data tick marks to chartgroup
  // for future axis value changes then the renderAxes() function needs called
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);


// Append y-axis

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.healthcareLow)*2.6])
    .range([height, 0]);
  // Create initial axis functions; sets pixel location for data scale
  var leftAxis = d3.axisLeft(yLinearScale);
  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);





// Append circles

  // New by Erin - provide data first to object 
  // case is important - selectAll() works but SelectAll() would produce a type error - the capitalizaton makes a difference
  var circlesGroupAll = chartGroup
      .selectAll("circlesGroup")
      .data(healthData)
      .enter()
    
  

        // append circle groups
        var circlesGroup = circlesGroupAll
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d.healthcareLow))
            .attr("r", 20)
            .attr("fill", "teal")
            .attr("class", "stateCircle");

        // append circle title
        var textcirclesGroup = circlesGroupAll
            .append("text")
            .text((d) => d.abbr)
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d.healthcareLow))
            .attr("class", "statetext");


// append labels
  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);




        var healthcareLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", false)
            .text("In Poverty (%)");





  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  var textcirclesGroup = updateToolTip(chosenXAxis, textcirclesGroup);





// add all updates via x-axis

  // x axis labels event listener
  // if you comment out the entire labelsGroup section then you can see that the plot populates but does not update when selecting the axis
  // note that above this section, only the updateToolTip and xScale functions are called of all the user created functions at the top of the script
  // the other functions at the top of the page are used to re-define the data applied to the xLinearScale function, xAxis object, circlesGroup object, textcirclesGroup object, circlesGroup object
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
        // New - updates text labels within circles
        textcirclesGroup = rendertextCircles(textcirclesGroup, xLinearScale, chosenXAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
        textcirclesGroup = updateToolTip(chosenXAxis, textcirclesGroup)

        // changes classes to change bold text
        if (chosenXAxis === "age") {
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "poverty") {
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
}).catch(function(error) {
  console.log(error);
});