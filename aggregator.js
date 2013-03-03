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


var BucketView = function() {

};

BucketView.prototype.filter = function(keyValues) {

};

BucketView.prototype.groupBy = function(key) {

};

BucketView.prototype.count = function() {

};


var Bucket = function(periodSeconds, tickCallback) {
    this.points = [];
};

Bucket.prototype.addPoint = function(point) {

};

Bucket.prototype.query = function() {
    // Returns a BucketView
};

Bucket.prototype.start = function() {
    // Begin polling for data expiration, etc
};



// Something like:
//
// var updateCount = bucket.filter({update: 1}).group_by('c').count();
// var leaveCount = bucket.filter({join: 1}).group_by('c').count();

// var usersOnSite = updateCount - leaveCount;


// TEST_DATA = [
//   {"c":"rando464780","leave":1,"_data":{"n": 1}}
//   {"c":"rando464780","update":1,"_data":{"n": 1}}
// ];


{"c":"rando464780","leave":1,"__point":{"n": 1}}


function init() {

    // $('#data-points')
}


$(document).ready(init);
