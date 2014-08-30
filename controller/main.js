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
var uuid = require('node-uuid');
var Point = require('./model/Point');
var Result = require('./model/Result');
var Person = require('./model/Person');

var person = new Person;
person._name = 'abcdabcd987';
for (var j = 0; j < 4; ++j) {
    var r = new Result;
    r.uuid     = uuid.v4();
    r.title    = 'Fibonacci' + j;
    r.status   = CONST.RESULT.NORMAL;
    r.detail   = 'g++ version 4.8.0\nResult: ' + j;
    r.filename = 'fibonacci' + j + '.cpp';
    for (var i = 0; i < 10; ++i) {
        var p = new Point;
        p.detail   = 'Well Done!\nResult: ' + j + '\nPoint: ' + i;
        p.status   = CONST.POINT.AC;
        p.score    = i;
        p.time     = 300;
        p.memory   = 23354;
        p.exitcode = 0;
        p.stderr   = "DEBUG INFOMATION\n\nI'm just a test\nResult: " + j + '\nPoint: ' + i;

        r.addPoint(p);
    }
    person.addResult(r);
}
global.contestants['abcdabcd987'] = person;
require('./controller/person').show('abcdabcd987');
