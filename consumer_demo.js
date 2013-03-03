function handleSubmit(e) {
  e.preventDefault()


  var bucket = new Bucket(5000)
  , channelId = $(e.target).find('input[name=channelId]')[0].value

  pollChannel(channelId, function (message) {
    for (var annotation in message.annotations) {
      if (annotation.type == 'net.app.contrib.timeseries') {
        bucket.addPoint(annotation.value)
      }
    }
  })
}


function init() {
  if (!authorized()) { return }
  $('#send-form').submit(handleSubmit)
}


$(document).ready(init)
