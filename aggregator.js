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
    console.log('Add - New state: ' + JSON.stringify(this.points));
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
    console.log('Expire - New state: ' + JSON.stringify(this.points));
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


function init() {
    var data = [
        {'kv':{'c':'rando464780','update':1},'n': 1},
        {'kv':{'c':'rando464781','update':1},'n': 1},
        {'kv':{'c':'rando464782','update':1},'n': 1},
        {'kv':{'c':'rando464783','update':1},'n': 1},
        {'kv':{'c':'rando464784','update':1},'n': 1},
        {'kv':{'c':'rando464785','update':1},'n': 1},
        {'kv':{'c':'rando464786','update':1},'n': 1},
    ];
    var bucket = new Bucket(1000);
    $.each(data, function(i, x) {
        bucket.add(JSON.parse(JSON.stringify(x)));
    });
    setTimeout(function() {
        var result = bucket.query();
        console.log('After 500ms! ' + result.length);
        console.log(JSON.stringify(result));
        $.each(data, function(i, x) {
            bucket.add(JSON.parse(JSON.stringify(x)));
        });
        var result = bucket.query();
        console.log('After 500ms! second ' + result.length);

        setTimeout(function() {
            var result = bucket.query();
            console.log('After 1200ms! ' + result.length);
            console.log(JSON.stringify(result));

            setTimeout(function() {
                var result = bucket.query();
                console.log('After 1600ms! ' + result.length);
                console.log(JSON.stringify(result));
            }, 400);
        }, 700);
    }, 500);
}


$(document).ready(init);
