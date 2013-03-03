/* Copyright 2013 Randall Leeds
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var API_ROOT = 'https://alpha-api.app.net/stream/0'


function pollChannel(channelId, callback, since) {
  since = since || 0

  $.ajax({
    type: 'GET',
    url: API_ROOT + '/channels/' + channelId + '/messages',
    headers: {
      'Authorization': 'Bearer ' + AUTH_TOKEN
    },
    data: {
      include_machine: 1,
      include_annotations: 1,
      since_id: since
    }
  }).done(function (envelope) {
    var done = false

    for (var i = 0 ; !done && i < envelope.data.length ; i++) {
      var done = (false === callback(envelope.data[i]))
    }

    if (!done) {
      setTimeout(function () {
        pollChannel(channelId, callback, envelope.meta.max_id || since)
      }, 1000)
    }
  })
}


// XXX: app.net doesn't currently support CORS for the streaming API
function consumeStream(endpoint, callback) {
  console.log('Opening stream: ' + endpoint)
  var xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    console.log("State change " + xhr.readyState)
    if (xhr.readyState == 3) {
      console.log(xhr.responseText)
    }
  }
  xhr.open("GET", endpoint)
  xhr.send(null)
}


function getStream(channelId, callback) {
  console.log('Checking for stream existence')
  $.ajax({
    type: 'GET',
    url: API_ROOT + '/streams',
    headers: {
      'Authorization': 'Bearer ' + AUTH_TOKEN,
      'Content-Type': 'application/json'
    },
    data: {
      key: 'consumer-channel-' + channelId
    }
  }).done(function (envelope) {
    var endpoint = null
    if (envelope.data.length == 0) {
      endpoint = createStream(channelId, callback)
    } else {
      endpoint = envelope.data[0].endpoint
    }
    callback(endpoint)
  })
}


function createStream(channelId) {
  var xhr = $.ajax({
    type: 'POST',
    async: false,
    url: API_ROOT + '/streams/',
    headers: {
      'Authorization': 'Bearer ' + AUTH_TOKEN,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      filter: {
        clauses: [
          {
            field: '/data/channel/*',
            object_type: 'message',
            operator: 'matches',
            value: channelId
          }
        ],
        match_policy: 'include_any',
        name: 'Messages on channel ' + channelId
      },
      object_types: ['message'],
      type: 'long_poll',
      key: 'consumer-channel-' + channelId
    })
  })
  return JSON.parse(xhr.responseText).data.endpoint
}


function handleChunk(err, data) {
  if (err) {
    throw err
  }
  console.log('data: ' + data)
}


function handleSubmit(e) {
  e.preventDefault()
  //AUTH_TOKEN = $(e.target).find('input[name=appToken]')[0].value
  channelId = $(e.target).find('input[name=channelId]')[0].value
  pollChannel(channelId, function (message) {
    console.log(message)
  })
}


function init() {
  if (!authorized()) {
    return
  }
  $('#send-form').submit(handleSubmit)
}


$(document).ready(init)
