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
global.navEvent = new events.EventEmitter;

global.contest.on('open succeeded', function() {
    nav.setup('Problems');
})

nav.setup('Contest');