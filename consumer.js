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
var AUTH_TOKEN = ''


function consumeStream(endpoint, callback) {
  console.log('Opening stream: ' + endpoint)
  var xhr = $.ajax({
    type: 'GET',
    url: endpoint,
    data: {
      include_machine: 1,
      include_annotations: 1,
    },
    beforeSend: function (xhr, settings) {
      var oldrsc = xhr.onreadystatechange
      xhr.onreadystatechange = function () {

        oldrsc.apply(this, arguments)
      }
    }
  })
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
    },
    statusCode: {
      404: function () {
        createStream(channelId, callback)
      }
    }
  }).done(function (envelope) {
    if (envelope.data.length == 0) {
      createStream(channelId, callback)
    } else {
      callback(envelope.data[0].endpoint)
    }
  })
}


function createStream(channelId) {
  $.ajax({
    type: 'POST',
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
}


function handleChunk(err, data) {
  if (err) throw err
  console.log('data: ' + data)
}


function handleSubmit(e) {
  e.preventDefault()
  AUTH_TOKEN = $(e.target).find('input[name=appToken]')[0].value
  channelId = $(e.target).find('input[name=channelId]')[0].value
  getStream(channelId, function (endpoint) {
    consumeStream(endpoint, handleChunk)
  })
}


function init() {
  $('#send-form').submit(handleSubmit)
}


$(document).ready(init)
