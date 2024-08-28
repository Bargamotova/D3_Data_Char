/**
 * created by Anna Bargamotova Samoilenko
 */
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const space = { top: 20, right: 20, bottom: 70, left: 70 };
let w = 800 - space.left - space.right,
  h = 400 - space.top - space.bottom;

d3.json(url)
  .then(data => {
    const dataset = data.data;
    const tooltip = d3.select('#tooltip');

    // create svg
    d3.select('#chart')
      .append('svg')
      .attr('width', w + space.left + space.right)
      .attr('height', h + space.top + space.bottom)
      .append('g')
      .attr("transform", `translate(0, ${space.top})`);

    const svg = d3.select('svg');
    // add texts
    svg.append('text')
      .text(`${data.source_name}: http://www.bea.gov/national/pdf/nipaguid.pdf`)
      .attr('x', 0)
      .attr('y', h + 80)
      .style("transform", "translateX(27%)")
      .style("font-weight", 100)
      .style("font-size", 16)
      .style("font-style", 'italic');;

    svg.append('text')
      .text("Gross Domestic Product")
      .attr('x', -200)
      .attr('y', 90)
      .style("transform", "rotate(-90deg)")
      .style("font-weight", 100)
      .style("font-size", 12)
      .style("font-style", 'italic');

    // format data for x-axios and y-axios
    const xScale =
      d3.scaleTime()
        .domain([new Date(d3.min(dataset, d => d[0])), new Date(d3.max(dataset, d => d[0]))])
        .range([0, w]);

    const yScale =
      d3.scaleLinear()
        .domain([0, new Date(d3.max(dataset, d => d[1]))])
        .range([h, 0]);

    // create x and y line with according to the formatted data
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append('g')
      .attr("id", 'x-axis')
      .attr("transform", `translate(${space.left}, ${h + 10})`)
      .call(xAxis)
    svg
      .append('g')
      .attr("id", 'y-axis')
      .attr("transform", `translate(${space.bottom}, 10)`)
      .call(yAxis)

    // create rect with dynamic fill and dynamic height
    svg
      .selectAll('.bar')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d, i) => d[1])
      .attr("x", (d) => xScale(new Date(d[0])))
      .attr("y", (d) => yScale(d[1]) + 10)
      .attr("width", w / dataset.length)
      .attr("height", (d) => h - yScale(d[1]))
      .attr("transform", `translate(${space.left}, 0)`)
      .on("mouseover", showTooltip)
      .on('mouseout', hideTooltip)
      .style("fill", (_, i) => `hsl(${i}, 67%, 59%)`);

    // for event functions 
    function showTooltip(d) {
      tooltip.style('opacity', 0.9)
        .style("display", "block")
        .style("left", (event.pageX + 10) + 'px')
        .style("top", event.pageY + 'px')
        .style("transition", "all 0.3")
        .attr('data-date', d[0])
        .html(`${formatDate(d[0])}<br>$${formatCurrency(d[1])} Billion`)
    }
    function hideTooltip() {
      tooltip.style("display", "none")
    }
  }).catch(e => console.log(e));

// helpers functions 
function formatDate(d) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(d);
  return date.toLocaleString("en", options);

}
function formatCurrency(val) {
  return val.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

