var fs = require('fs');
var path = require('path');
var Promise = require('promise');
var utils = require('../utils');
var CONST = require('../CONST');
var template = require('./template');
var person = require('./person');
var Person = require('../model/Person');

var selector = {
    last: 0,
    selected: {},
}

function select(node, index) {
    node.addClass('selected');
    selector.selected[index] = true;
}

function onSelect(e) {
    e.preventDefault();
    e.stopPropagation();

    var jthis = $(this);
    var trs = $("#contestants-table-body tr");
    var index = trs.index(jthis);

    if (keys.mod && !keys.shift) {
        select(jthis, index);
    } else if (!keys.mod && keys.shift) {
        var st = Math.min(selector.last, index);
        var ed = Math.max(selector.last, index);
        for (var i = st; i <= ed; ++i) {
            select(trs.eq(i), i);
        }
    } else {
        selector.selected = {};
        $("#contestants-table-body tr.selected").removeClass('selected');
        select(jthis, index);
    }

    selector.last = index;
    $("#btn-judge").removeClass('disabled');
}

function onDblclick(e) {
    e.preventDefault();
    e.stopPropagation();

    person.show(this.dataset.name);
}

function updateTable() {
    updateRank();

    var tbody = $("#contestants-table-body");
    tbody.empty();
    var totalScore = contest.score;
    for (var name in contestants) {
        var p = contestants[name];
        var node = $(template.contestantsBox({
            person: p,
            statusToString: utils.statusToString,
            totalScore: totalScore
        }));
        node.on('click', onSelect);
        node.on('dblclick', onDblclick);

        tbody.append(node);
    }
}

function updateRank() {
    var cmp = function(lhs, rhs) {
        if (lhs.score > rhs.score || (lhs.score === rhs.score && lhs.time < rhs.time)) return -1;
        if (lhs.score === rhs.score && lhs.time === rhs.time) return 0;
        return 1;
    }
    var arr = [];
    for (var name in contestants) {
        var p = contestants[name];
        arr.push({
            name: name,
            score: p.score,
            time: p.time
        });
    }
    arr.sort(cmp);
    if (!arr.length) return;
    var rank = 1;
    contestants[arr[0].name]._rank = rank;
    for (var i = 1; i < arr.length; ++i) {
        if (cmp(arr[i-1], arr[i]) !== 0) rank = i+1;
        contestants[arr[i].name]._rank = rank;
    }
}

exports.refresh = function() {
    var stat = Promise.denodeify(fs.stat);
    var readdir = Promise.denodeify(fs.readdir);
    var srcpath = path.join(contest._path, 'src');
    var load = function(name) {
        return new Promise(function(fulfill, reject) {
            var dir = path.join(srcpath, name);
            stat(dir).then(function(stats) {
                if (!stats.isDirectory()) { 
                    fulfill(null);
                } else {
                    var p = new Person;
                    p.version = CONST.VERSION;
                    p._name = name;
                    p._status = CONST.PERSON.JUDGED
                    p.open(dir).then(fulfill);
                }
            })
        })
    };

    readdir(srcpath).then(function(files) {
        var promises = files.map(load);
        return Promise.all(promises);
    }).then(function(people) {
        contestants = {};
        for (var i = 0; i < people.length; ++i) {
            if (!people[i]) continue;
            var p = people[i];
            contestants[p._name] = p;
        }

        updateTable();
    }).then(null, function(e) {console.error(e);})
}

exports.setup = function() {
}