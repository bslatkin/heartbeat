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


function handleCreateSuccess(result) {
    console.log(result);
    $('#snippet').text('Created channel ID: ' + result.data.id);
}


function handleCreate(e) {
    e.preventDefault();

    if (!authorized()) {
        return;
    }

    $.ajax({
        type: 'POST',
        url: 'https://alpha-api.app.net/stream/0/channels',
        headers: {
            'Authorization': 'Bearer ' + AUTH_TOKEN
        },
        data: JSON.stringify({
            type: 'net.app.contrib.timeseries',
            writers: {
                any_user: true
            },
            readers: {
                you: true
            }
        }),
        contentType: 'application/json'
    })
    .done(handleCreateSuccess);
    // TODO: Handle errors
}


function init() {
    $('#create-form').submit(handleCreate);
}


$(document).ready(init);
