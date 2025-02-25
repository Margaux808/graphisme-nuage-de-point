d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then(function(data) {
  const svg = d3.select("#graph");
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  const width = svg.attr("width") - margin.left - margin.right;
  const height = svg.attr("height") - margin.top - margin.bottom;

  // Scales
  const x = d3.scaleLinear().domain([d3.min(data, d => d["Year"]), d3.max(data, d => d["Year"])]).range([0, width]);
  const y = d3.scaleTime().domain([d3.min(data, d => new Date(d["Time"])), d3.max(data, d => new Date(d["Time"]))]).range([height, 0]);

  // Axes
  const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S"));

  svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .append("g")
    .attr("id", "y-axis")
    .call(yAxis);

  // Title
  svg.append("text")
    .attr("id", "title")
    .attr("x", width / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .text("Graphique des Performances Cyclistes");

  // Circles for data points
  const dots = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => x(d["Year"]))
    .attr("cy", d => y(new Date(d["Time"])))
    .attr("r", 5)
    .attr("data-xvalue", d => d["Year"])
    .attr("data-yvalue", d => new Date(d["Time"]))
    .style("fill", "#ff6600");

  // Tooltip
  const tooltip = d3.select("#tooltip");

  dots.on("mouseover", function(event, d) {
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip.html(d["Name"] + ": " + d["Nationality"] + "<br>" + d["Year"] + " - " + d["Time"])
      .attr("data-year", d["Year"])
      .style("left", event.pageX + 5 + "px")
      .style("top", event.pageY - 28 + "px");
  })
  .on("mouseout", function() {
    tooltip.transition().duration(200).style("opacity", 0);
  });

  // Add data to the table
  const tableBody = d3.select("#data-table tbody");
  data.forEach(d => {
    const row = tableBody.append("tr");
    row.append("td").text(d["Name"]);
    row.append("td").text(d["Nationality"]);
    row.append("td").text(d["Year"]);
    row.append("td").text(d["Time"]);
  });

  // Legend
  const legend = d3.select("#legend");
  legend.text("Légende: Points représentant les performances des cyclistes.");

});
