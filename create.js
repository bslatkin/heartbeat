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

var CLIENT_ID = 'Afwhh8J6d35WzUnVvSLPrc5KgY2aMhpy';
var AUTH_TOKEN = '';


function authorize() {
    var prefix = '#access_token=';
    if (window.location.hash.indexOf(prefix) != 0) {
        var href = 'https://account.app.net/oauth/authenticate' +
             '?client_id=' + CLIENT_ID +
             '&response_type=token' +
             '&redirect_uri=' + encodeURIComponent(window.location.href) +
             '&scope=messages';
        window.location.href = href;
        return;
    }
    var token = window.location.hash.substr(prefix.length);
    console.log('Client authorized: ' + token);
    return token;
}


function flattenForm(formEl) {
    var result = {};
    $.each($(formEl).serializeArray(), function(i, v) {
        result[v['name']] = v['value'];
    });
    return result;
}


function handleCreate(e) {
    e.preventDefault();
    var params = flattenForm(e.target);
    console.log(params);
    // TODO: Query to see if the channel is already alive.

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
    }).done(function(result) {
        console.log(result);
    });
}


function init() {
    AUTH_TOKEN = authorize();
    $('#create-form').submit(handleCreate);
}


$(document).ready(init);
