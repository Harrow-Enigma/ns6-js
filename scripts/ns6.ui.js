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

const GROUPSTOREKEY = "ns6-groups";
const PICKORDER = {
    OG: {1: 0, 2: 4},
    OO: {1: 1, 2: 5},
    CO: {1: 2, 2: 6},
    CG: {1: 3, 2: 7},
};

function executeDraw(drawId, speakersId, roomsId, adjudicatorsId, teamSize=8) {
    document.getElementById(drawId).innerHTML = '';

    var speakersText = document.getElementById(speakersId).value;
    var roomsText = document.getElementById(roomsId).value;
    var adjudicatorsText = document.getElementById(adjudicatorsId).value;

    var groups = draw(speakersText, roomsText, adjudicatorsText, teamSize);
    localStorage.setItem(GROUPSTOREKEY, JSON.stringify(groups));
    injectGroups(drawId, groups);
}

function eraseDraw(drawId) {
    document.getElementById(drawId).innerHTML = "";
    localStorage.removeItem(GROUPSTOREKEY);
}

function copyMagic() {
    var groups = localStorage.getItem(GROUPSTOREKEY);
    if (groups !== null)
        navigator.clipboard.writeText(groups);
}

function pasteMagic(drawId) {
    navigator.clipboard.readText().then(function(text) {
        var groups = JSON.parse(text);
        injectGroups(drawId, groups);
    });
}

function injectGroups(parentId, groups) {

    document.getElementById(parentId).innerHTML = '';

    var container = document.createElement('div');
    container.className = "container text-center";

    var row = document.createElement('div');
    row.className = "row";

    for (var k in groups) {
        injectRoom(row, k, groups[k]['adjudicators'].join(', '), groups[k]['speakers']);
    }

    container.appendChild(row);
    document.getElementById(parentId).appendChild(container);
}

function injectRoom(parent, name, adjudicator, speakers) {
    
    var maindiv = document.createElement('div');
    maindiv.className = "col";

        var heading = document.createElement('h1');
        heading.innerHTML = name;
        maindiv.appendChild(heading);

        var inputdiv = document.createElement('div');
        inputdiv.className = "input-group mb-3";

            var span = document.createElement('span');
            span.className = "input-group-text";
            span.innerHTML = "Adjudicator:";
            inputdiv.appendChild(span);

            var input = document.createElement('input');
            input.type = "text";
            input.className = "form-control";
            input.placeholder = "Adjudicator";
            input.style = "text-align: center;";
            input.value = adjudicator;
            inputdiv.appendChild(input);
        
        maindiv.appendChild(inputdiv);

        var table = document.createElement('table');
        table.classList.add('table');
        table.classList.add('table-striped');

            var tbody = document.createElement('tbody');

            for (k in PICKORDER) {
                var tr = document.createElement('tr');
                var role = document.createElement('th');
                role.innerHTML = k;
                role.className = "text-success";

                var speaker1 = document.createElement('th');
                speaker1.innerHTML = speakers[PICKORDER[k][1]];
                var speaker2 = document.createElement('th');
                speaker2.innerHTML = speakers[PICKORDER[k][2]];

                tr.appendChild(role);
                tr.appendChild(speaker1);
                tr.appendChild(speaker2);
                tbody.appendChild(tr);
            }

        table.appendChild(tbody);
    
    maindiv.appendChild(table);
    parent.appendChild(maindiv);
}

function preventTabs(textareaId) {
    document.getElementById(textareaId).addEventListener('keydown', function(e) {
        // https://stackoverflow.com/questions/6637341/use-tab-to-indent-in-textarea
        if (e.key == 'Tab') {
            e.preventDefault();
            var start = this.selectionStart;
            var end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = this.value.substring(0, start) +
            "\t" + this.value.substring(end);

            // put caret at right position again
            this.selectionStart =
            this.selectionEnd = start + 1;
        }
    });
}

function initTextareas(speakersId, roomsId, adjudicatorsId) {
    preventTabs(speakersId);
    preventTabs(roomsId);
    preventTabs(adjudicatorsId);
}

function id2key(id) {
    return 'ns6-' + id;
}

function makePersist(textareaId) {
    var storageKey = id2key(textareaId);

    var value = localStorage.getItem(storageKey);
    if (value !== null) document.getElementById(textareaId).value = value;

    document.getElementById(textareaId).addEventListener('change', function() {
        localStorage.setItem(id2key(this.id), this.value);
    });
}

function initPersistence(drawId, speakersId, roomsId, adjudicatorsId) {
    makePersist(speakersId);
    makePersist(roomsId);
    makePersist(adjudicatorsId)

    var groups = localStorage.getItem(GROUPSTOREKEY);
    if (groups !== null)
        injectGroups(drawId, JSON.parse(groups));
}
