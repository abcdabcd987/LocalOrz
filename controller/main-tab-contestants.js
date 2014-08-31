var fs = require('fs');
var path = require('path');
var Promise = require('promise');
var utils = require('../utils');
var CONST = require('../CONST');
var template = require('./template');
var Person = require('../model/Person');

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
                    var person = new Person;
                    person.version = CONST.VERSION;
                    person._name = name;
                    person._status = CONST.PERSON.JUDGED
                    person.open(dir).then(fulfill);
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
            var person = people[i];
            contestants[person._name] = person;
        }

        updateTable();
    }).then(null, function(e) {console.error(e);})
}