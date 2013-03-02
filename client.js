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


function handleSendSuccess(result) {
    console.log(result);
}


function handleSend(e) {
    e.preventDefault();
    var params = flattenForm(e.target);
    $.ajax({
        type: 'POST',
        url: 'https://alpha-api.app.net/stream/0/channels/' +
             params.channelId + '/messages',
        data: JSON.stringify({
            channel_id: params.channelId,
            created_at: (new Date()).toISOString(),  // requires ecma5
            id: '', // xxx is this for idempotent messages?
            machine_only: true,
            annotations: [
                {
                    type: 'net.app.contrib.timeseries',
                    value: {
                        n: 123
                    }
                }
            ]
        }),
        contentType: 'application/json'
    })
    .done(handleSendSuccess);
    // TODO: Handle errors
}


function init() {
    $('#send-form').submit(handleSend);
}


$(document).ready(init);
