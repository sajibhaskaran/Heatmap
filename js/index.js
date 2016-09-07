"use strict";

var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

var margin = { top: 100, right: 20, bottom: 100, left: 80 };
var w = window.innerWidth;
var h = window.innerHeight;
var height = h * 0.9 - margin.top - margin.bottom,
    width = w * 0.9 - margin.left - margin.right;
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "Septemper", "October", "November", "December"];

var chart = d3.select('#chart').append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).style('background', '#A00008').append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.json(url, function (data) {
  var baseTemp = data.baseTemperature;
  var heatMap = data.monthlyVariance;
  var years = heatMap.map(function (item) {
    return item.year;
  });
  years = years.filter(function (year, idx) {
    return years.indexOf(year) == idx;
  });

  var variance = heatMap.map(function (data) {
    return data.variance;
  });

  var xScale = d3.scale.linear().domain([d3.min(years), d3.max(years)]).range([0, width]);

  var xAxis = d3.svg.axis().scale(xScale).orient('bottom');

  var yScale = d3.scale.linear().domain([1, 13]).range([0, height]);
  //console.log(months)
  var yAxis = d3.svg.axis().scale(yScale).orient('left').tickSize(0, 0).tickFormat(function (d) {
    return months[d - 1];
  });

  var colors = d3.scale.linear().domain([d3.min(variance), d3.max(variance)]).range(['#000FFF', '#FFF000']);

  var tooltip = d3.select('body').append('div').style('position', 'absolute').style('text-align', 'center').style('padding', '5px 10px').style('width', '120px').style('background', 'green').style('color', '#FFF').style('border-radius', '5px').style('opacity', 0);

  var heatmap = chart.selectAll('rect').data(heatMap).enter().append('rect').attr('width', width / years.length).attr('height', height / 12).attr('x', function (d) {
    return xScale(d.year);
  }).attr('y', function (d) {
    return yScale(d.month);
  }).style('fill', function (d) {
    return colors(d.variance);
  }).on('mouseover', function (d, i) {
    tooltip.transition().style('opacity', .9);
    tooltip.html(months[d.month - 1] + ', ' + d.year + '</br>' + 'Temp: ' + (baseTemp + d.variance).toFixed(2) + '°C' + '</br>' + 'Variance: ' + d.variance).style('left', d3.event.pageX - 100 + 'px').style('top', d3.event.pageY - 70 + 'px');
  }).on('mouseout', function (d) {
    tooltip.transition().delay(400).style('opacity', 0);
  });

  var xGuide = chart.append('g').attr('transform', 'translate(0,' + height + ')').call(xAxis);
  xGuide.selectAll('line').style({ stroke: '#000' });
  xGuide.selectAll('path').style({ fill: 'none', stroke: '#000' });

  var yGuide = chart.append('g').attr('transform', 'translate(-5,15)').call(yAxis);

  var title = chart.append('text').attr('x', width / 2).attr('y', -50).attr("text-anchor", "middle").style('font-size', '1.6em').style('fill', 'white').text('Monthly Global Land-Surface Temperature');

  var year = chart.append('text').attr('x', width / 2).attr('y', -30).attr("text-anchor", "middle").style('font-size', '1.1em').style('fill', 'white').text('1753 - 2015');

  var colorVariance = chart.append("g").attr("class", "legendLinear").attr("transform", "translate(0," + (height + 40) + ")");

  var legendLinear = d3.legend.color().shapeWidth(40).cells(8).orient('horizontal').scale(colors);

  chart.select(".legendLinear").call(legendLinear);
});