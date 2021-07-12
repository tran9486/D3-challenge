// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };
  
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("../d3_data_journalism/assets/data/data.csv").then(function(stateData) {
    stateData.forEach(function(data) {
        data.poverty = +data.poverty
        data.obesity = +data.obesity
    })

    var xLinearScale = d3.scaleLinear()
      .domain([9, d3.max(stateData, d => d.poverty)])
      .range([0, width])
    
    var yLinearScale = d3.scaleLinear()
      .domain([18, d3.max(stateData, d => d.obesity)])
      .range([height, 0])

    var xAxis = d3.axisBottom(xLinearScale).ticks(10);
    var yAxis = d3.axisLeft(yLinearScale).ticks(10);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

      chartGroup.append("g")
        .call(yAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "10")
        .attr("class", "stateCircle")

    var statesGroup = chartGroup.selectAll("text.stateText")
        .data(stateData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("class", "stateText")
        .attr("dx", d => xLinearScale(d.poverty))
        .attr("dy", d => yLinearScale(d.obesity) + 2)
        .attr("font-size", 8)
        .attr("stroke-width", .5)

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
        });

    chartGroup.call(toolTip)

    circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })
        .on("mouseout", function(d) {
          toolTip.hide(d);
        });
    
    statesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })  
        .on("mouseout", function(d) {
            toolTip.hide(d);
        });
    
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2) - 40)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obestiy (%)");
  
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2 - 40}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty (%)");
}).catch(function(error) {
    console.log(error);
  });