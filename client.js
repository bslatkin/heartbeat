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

// Token of the shim user, created with shim_writer.html
var SHIM_TOKEN = 'AQAAAAAAAwFkk0rZQDtoHq82UEpOAk0tCWCgE02-GovtrS_KSx2AN_86oMtWYAK5sGIuIsKG1jrehToqEuuz7UX7jNQh8ZtqvA';


function sendMessage(channelId, point, opt_token, opt_success, opt_sync) {
    opt_token = opt_token || SHIM_TOKEN;
    console.log('Sending: ' + JSON.stringify(point));
    var xhr = $.ajax({
        type: 'POST',
        async: !opt_sync,
        url: 'https://alpha-api.app.net/stream/0/channels/' +
             channelId + '/messages',
        headers: {
            'Authorization': 'Bearer ' + opt_token
        },
        data: JSON.stringify({
            channel_id: channelId,
            created_at: (new Date()).toISOString(),  // requires ecma5
            machine_only: true,
            annotations: [
                {
                    type: 'net.app.contrib.timeseries',
                    value: point
                }
            ]
        }),
        contentType: 'application/json'
    });
    if (opt_success) {
        xhr.done(opt_success);
        // TODO: Handle errors
    }
}
