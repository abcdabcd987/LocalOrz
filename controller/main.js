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
global.keys = { shift: 0, mod: 0 };
global.showingPerson = {};

window.addEventListener('keydown', function(e) {
    global.keys.shift |= e.shiftKey;
    global.keys.mod |= e.keyCode === 91 || e.keyCode === 93 || e.ctrlKey;
});

window.addEventListener('keyup', function(e) {
    global.keys.shift &= e.shiftKey;
    global.keys.mod &= e.keyCode !== 91 && e.keyCode !== 93 && !e.ctrlKey;
});

global.contest.on('open succeeded', function() {
    nav.setup('Problems');
})

nav.setup('Contest');

//Test Code:
global.contest.open('/Users/abcdabcd987/Developer/tmp/test_contest').then(function() {
    $("#wrap").html(template.mainTabContestants());
    require('./controller/main-tab-contestants').setup();
    require('./controller/main-tab-contestants').refresh();
})