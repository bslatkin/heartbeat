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

function init() {
    // Provisioned via create.html
    var channelId = 6267;

    var clientId = 'rando' + Math.round(Math.random() * 1000000);

    // Initial join message
    sendMessage(channelId, {c: clientId, n: 1, kv: {join: 1}});

    // Periodic heartbeat for this client
    setInterval(function() {
        sendMessage(channelId, {c: clientId, n: 1, kv: {update: 1}});
    }, 5000);

    // Send a death rattle message synchronously or else the browser will
    // definitely kill the AJAX request.
    $(window).unload(function() {
        sendMessage(channelId, {c: clientId, n: 1, kv: {leave: 1}},
                    undefined, undefined, true);
    });
}

$(document).ready(init);
