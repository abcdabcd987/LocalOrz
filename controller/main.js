console.log((new Date()).toString(), '====== Reloaded ======');

var path = require('path');
var CONST = require('./const');
var events = require('events');
var Contest = require('./model/Contest');
var Problem = require('./model/Problem');
var template = require('./controller/template');
var nav = require('./controller/nav');

global.gui = require('nw.gui');
require('./model/Settings').setup();

global.$ = $;
global.contest = new Contest;
global.contestants = {};
global.navEvent = new events.EventEmitter;

global.contest.on('open succeeded', function() {
    nav.setup('Problems');
})

nav.setup('Contest');




//Test code:

//Generate Contestants:
var fs = require('fs');
var uuid = require('node-uuid');
var Point = require('./model/Point');
var Result = require('./model/Result');
var Person = require('./model/Person');

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

var problems = [
    {uuid: uuid.v4(), title: 'Sum', filename: 'sum.cpp'},
    {uuid: uuid.v4(), title: 'Fibonacci', filename:'fibonacci.cpp'},
    {uuid: uuid.v4(), title: "What's In A Name?", filename: 'name.cpp'},
    {uuid: uuid.v4(), title: 'The Bermuda Triangle', filename: 'triangle.pas'},
];

function gen_name(i) {
    if (i < 10) return 'FJ-00' + i;
    return 'FJ-0' + i;
}

for (var k = 0; k < 100; ++k) {
    var person = new Person;
    person._name = gen_name(k);
    person.version = CONST.VERSION;
    person._path = path.join('/Users/abcdabcd987/Developer/tmp/test_contest/src/', person._name);
    fs.mkdirSync(person._path);
    for (var j = 0; j < 4; ++j) {
        var r = new Result;
        r.uuid     = problems[j].uuid;
        r.title    = problems[j].title;
        r.status   = CONST.RESULT.NORMAL;
        if (Math.random() > 0.9) {
            r.detail   = 'g++ version 4.8.0\nResult: ' + j + '\nPerson: ' + gen_name(k);
        } else {
            r.detail = '';
        }
        r.filename = problems[j].filename;
        for (var i = 0; i < 10; ++i) {
            var p = new Point;
            if (Math.random() > 0.8) {
                p.detail   = 'Well Done!\nResult: ' + j + '\nPoint: ' + i + '\nPerson: ' + gen_name(k);
            } else {
                p.detail = '';
            }
            p.status   = CONST.POINT[Object.keys(CONST.POINT)[randomInt(0, Object.keys(CONST.POINT).length)]];
            p.score    = randomInt(0, 11);
            p.time     = randomInt(1, 1000);
            p.memory   = randomInt(256, 128000);
            p.exitcode = 0;
            if (Math.random() > 0.7) {
                p.stderr   = "DEBUG INFOMATION\n\nI'm just a test\nResult: " + j + '\nPoint: ' + i + '\nPerson: ' + gen_name(k);
            } else {
                p.stderr = '';
            }

            r.addPoint(p);
        }
        person.addResult(r);
    }
    person.save();
}