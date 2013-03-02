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


function authorized() {
    var prefix = '#access_token=';
    if (window.location.hash.indexOf(prefix) != 0) {
        var href = 'https://account.app.net/oauth/authenticate' +
             '?client_id=' + CLIENT_ID +
             '&response_type=token' +
             '&redirect_uri=' + encodeURIComponent(window.location.href) +
             '&scope=messages';
        window.location.href = href;
        return false;
    }
    var token = window.location.hash.substr(prefix.length);
    AUTH_TOKEN = token;
    return true;
}
