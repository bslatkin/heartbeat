/* Copyright 2013 Brett Slatkin
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var Bucket = function(windowMs) {
    this.windowMs = windowMs;
    this.points = [];
};

Bucket.prototype.add = function(point) {
    if (!point['kv']) {
        point['kv'] = {};
    }
    point.kv['_data'] = point;
    point.kv['_created'] = (new Date()).getTime();
    this.points.push(point.kv);
    delete point.kv;  // Remove circular reference
};

Bucket.prototype.expire_ = function(now) {
    var now = (new Date()).getTime();
    var newPoints = [];
    for (var i = 0, n = this.points.length; i < n; i++) {
        var point = this.points[i];
        var nextTime = point._created;
        if (now - nextTime < this.windowMs) {
            newPoints.push(point);
        }
    }
    this.points = newPoints;
};

Bucket.prototype.query = function() {
    this.expire_();
    var result = [];
    for (var i = 0, n = this.points.length; i < n; i++) {
        var point = this.points[i];
        result.push(point);
    }
    return result;
};
