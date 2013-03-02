/* Copyright 2013 Brett Slatkin
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


function flattenForm(formEl) {
    var result = {};
    $.each($(formEl).serializeArray(), function(i, v) {
        result[v['name']] = v['value'];
    });
    return result;
}


function handleGetMessagesSuccess(result) {
    console.log(result);
    var dataPoints = $('#data-points');
    dataPoints.empty();
    $.each(result.data, function(i, d) {
        for (var i = 0, n = d.annotations.length; i < n; i++) {
            var point = d.annotations[i];
            if (point.type == 'net.app.contrib.timeseries') {
                $('<div class="point">')
                    .append(
                        $('<span class="stamp">')
                            .text(d.created_at))
                    .append(' ')
                    .append(
                        $('<span class="payload">')
                            .text(JSON.stringify(point.value)))
                    .appendTo(dataPoints);
                return;
            }
        }
    });
}


function getMessages(channelId) {
    console.log('Fetching channel: ' + channelId);
    $.ajax({
        type: 'GET',
        url: 'https://alpha-api.app.net/stream/0/channels/' +
             channelId + '/messages',
        data: {
            include_machine: 1,
            include_annotations: 1,
        },
        headers: {
            'Authorization': 'Bearer ' + AUTH_TOKEN
        }
    })
    .done(handleGetMessagesSuccess);
    // TODO: Handle errors
}


function handleSendSuccess(result) {
    console.log(result);
    getMessages(result.data.channel_id);
}


function handleSend(e) {
    e.preventDefault();
    if (!authorized()) {
        return;
    }
    var params = flattenForm($('#send-form'));
    var radians = 2 * Math.PI * ((new Date()).getTime() % 60000) / 60000.0;
    sendMessage(
        params.channelId,
        {
            n: 10 * (1 + Math.sin(radians)) / 2
        },
        AUTH_TOKEN,
        handleSendSuccess);
}


function handleView(e) {
    e.preventDefault();
    if (!authorized()) {
        return;
    }
    var params = flattenForm($('#send-form'));
    getMessages(params.channelId);
}


function init() {
    var prefix = '?channelId=';
    if (window.location.search.indexOf(prefix) != -1) {
        $('#channel-id').val(window.location.search.substr(prefix.length));
    }

    $('#send-button').click(handleSend);
    $('#view-button').click(handleView);
}


$(document).ready(init);
