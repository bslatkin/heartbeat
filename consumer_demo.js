var BUCKET_WINDOW = 10000
var UPDATE_INTERVAL = 1000

var w = 20, h = 400
var x = d3.scale.linear()
  .domain([0, 1])
  .range([0, w]);
var y = d3.scale.linear()
  .domain([0, 20])
  .rangeRound([0, h]);


function updateGraph(data) {
  var rect = d3.select('#graph').selectAll('rect')
  .data(data, function (d) { return d.k })

  rect.enter().insert("rect", "line")
    .attr("x", function(d, i) { return x(i + 1) - .5; })
    .attr("y", function(d) { return h - y(d.v) - .5; })
    .attr("width", w)
    .attr("height", function(d) { return y(d.v); })
    .transition()
    .duration(1000)
    .attr("x", function(d, i) { return x(i) - .5; })

  rect.transition()
    .duration(1000)
    .attr("x", function(d, i) { return x(i) - .5; })

  rect.exit().transition()
    .duration(1000)
    .attr("x", function(d, i) { return x(i - 1) - .5; })
    .remove()
}


function handleSubmit(e) {
  e.preventDefault()

  var bucket = new Bucket(BUCKET_WINDOW)
  , channelId = $(e.target).find('input[name=channelId]')[0].value
  , updated = new Date()
  , dataPoints = []

  pollChannel(channelId, function (message) {
    console.log('Processing ' + message.annotations.length + ' annotations')
    //console.log(message)
    _.each(message.annotations, function (annotation) {
      //console.log(annotation.type)
      if (annotation.type == 'net.app.contrib.timeseries') {
        var now = new Date()

        bucket.add(annotation.value)

        if (now - updated > UPDATE_INTERVAL) {
          updated = now

          var count = _.chain(bucket.query())
            .where({update: 1})
            .filter(function (d) { return d.c !== undefined })
            .groupBy('c')
            .keys()
            .value()
            .length

          dataPoints.push({
            k: now.getTime(),
            v: count
          })

          if (dataPoints.length > 30) {
            dataPoints.shift()
          }

          updateGraph(dataPoints)
        }
      }
    })
  })
}


function init() {
  if (!authorized()) { return }
  $('#send-form').submit(handleSubmit)
}


$(document).ready(init)
