
d3.csv("driving.csv", d3.autoType).then(data => {
    console.log(data)

    // Create SVG
    let outerWidth = 650
    let outerHeight = 500
    let margin = {top: 40, bottom: 40, left: 40, right: 40}
    let width = outerWidth - margin.left - margin.right
    let height = outerHeight - margin.top - margin.bottom

    const svg = d3.select(".container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.right})`)

    // Scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.miles))
        .nice()
        .range([0, width])

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.gas))
        .nice()
        .range([height, 0])

    // Axes
     var dollarFormat = function(d) {
        return '$' + d3.format('.2f')(d)
    }

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(7)

    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(12)
        .tickFormat(dollarFormat)

    let x = svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`)
        .call(g => {
            g.append("text")
                .text("Miles per person per year")
                .attr("text-anchor", "end")
                .attr("x", width - 10)
                .attr("y", -5)
                .attr("font-size", 12)
                .attr("font-weight", "bold")
                .attr("fill", "black")
                .call(halo)
        })

    let y = svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)
        .call(g => {
            g.append("text")
                .text("Cost per gallon")
                .attr("text-anchor", "start")
                .attr("x", 10)
                .attr("y", 5)
                .attr("font-size", 12)
                .attr("font-weight", "bold")
                .attr("fill", "black")
                .call(halo)
        })

    // Grid lines
    x.select(".domain").remove()

    x.selectAll(".tick line")
        .clone()
        .attr("y2", -height)
        .attr("stroke-opacity", 0.1)

    y.select(".domain").remove()

    y.selectAll(".tick line")
        .clone()
        .attr("x2", width)
        .attr("stroke-opacity", 0.1)

    // Line to connect the circles
    const line = d3.line()
        .x(d => xScale(d.miles))
        .y(d => yScale(d.gas))
  
    svg.append("path")
        .datum(data)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("d", line)

    // Circles
    const circles = svg.selectAll(".circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.miles))
        .attr("cy", d => yScale(d.gas))
        .attr("r", 4)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", "1.5")

    
    // Circle Labels
    svg.selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .text(d => d.year)
        .attr("x", d => xScale(d.miles))
        .attr("y", d => yScale(d.gas))
        .attr("font-size", "11")
        .attr("font-weight", "bolder")
        .each(position)
        .call(halo)

    function position(d) {
        const t = d3.select(this);
        switch (d.side) {
        case "top":
            t.attr("text-anchor", "middle").attr("dy", "-0.7em");
            break;
        case "right":
            t.attr("dx", "0.5em")
            .attr("dy", "0.32em")
            .attr("text-anchor", "start");
            break;
        case "bottom":
            t.attr("text-anchor", "middle").attr("dy", "1.4em");
            break;
        case "left":
            t.attr("dx", "-0.5em")
            .attr("dy", "0.32em")
            .attr("text-anchor", "end");
            break;
        }
    }

    function halo(text) {
        text
          .select(function() {
            return this.parentNode.insertBefore(this.cloneNode(true), this);
          })
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 4)
          .attr("stroke-linejoin", "round");
      }
})