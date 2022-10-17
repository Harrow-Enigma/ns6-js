/*
Copyright 2022 SONG YIDING

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

function shuffle(list) {
    return list.sort(() => Math.random() - 0.5);
}

function insertRandom(list, val="Iron Man") {
    list.splice(Math.floor(Math.random() * list.length), 0, val);
}

function padSpeakers(list, length, val="Iron Man") {
    while (list.length < length) list.push(val);
}

function randPadSpeakers(list, length, val="Iron Man") {
    while (list.length < length) insertRandom(list, val);
}

function nearestMultiple(n, m) {
    return Math.ceil(n/m) * m;
}

function parseEntities(text, direction=1) {
    var lines = text.trim().split('\n');
    var entities = [];
    var temp = [];
    
    if (lines[0].includes('\t')) {          // Has priority data
        for (i=0; i<lines.length; i++) {
            var vals = lines[i].split("\t");
            var prefix = vals[0];
            var priority = parseInt(prefix.match(/[0-9]+/g));
            var suffix = vals.slice(1, vals.length).join(' ');
            temp.push([priority, suffix]);
        }
    } 
    else {                                  // No priority data
        for (i=0; i<lines.length; i++) {
            var suffix = lines[i];
            var priority = i;
            temp.push([priority, suffix]);
        }
    }

    if (direction>=0) var sortfunc = (x, y) => x[0] - y[0];
    else var sortfunc = (x, y) => y[0] - x[0];

    temp = temp.sort(sortfunc);

    for (i=0; i<temp.length; i++) {
        entities.push(temp[i][1]);
    }

    return entities;
}

function draw(speakersText, roomsText, adjudicatorsText, teamSize=8) {
    var rooms = parseEntities(roomsText);
    var adjudicators = parseEntities(adjudicatorsText);

    var speakers = parseEntities(speakersText);
    var numAvailable = speakers.length;
    var numTotal = nearestMultiple(numAvailable, teamSize);
    randPadSpeakers(speakers, numTotal);

    var numGroups = numTotal / teamSize;
    var groups = {};
    for (var i=0; i<numGroups; i++) {
        var roomSpeakers = speakers.slice(i*teamSize, (i+1)*teamSize);
        roomSpeakers = shuffle(roomSpeakers);
        groups[rooms[i]] = {
            adjudicators: [],
            speakers: roomSpeakers
        };
    }

    for (var i=0; i<adjudicators.length; i++) {
        var adjudicatorRoom = rooms[i%numGroups];
        groups[adjudicatorRoom]['adjudicators'].push(adjudicators[i]);
    }

    return groups;
}
