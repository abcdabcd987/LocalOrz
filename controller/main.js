console.log(new Date(), '====== Reloaded ======');

var path = require('path');
var CONST = require('./const');
var Contest = require('./model/Contest');
var Problem = require('./model/Problem');
var template = require('./controller/template');

global.$ = $;
global.gui = require('nw.gui');
global.nconf = require('nconf');
global.contest = new Contest;

global.nconf.file({file: path.join(global.gui.App.dataPath, 'settings.json')});
global.nconf.set('defaults:fullScore', 10);
global.nconf.set('defaults:timeLimit', 1000);
global.nconf.set('defaults:memoryLimit', 131072);

$("#nav").html(template.mainNav({active:['Contest']}));
$("#wrap").html(template.mainTabContest({isOpened: false}));
require('./controller/main-tab-contest').setup();

global.contest.on('open succeeded', function() {
    $("#nav").html(template.mainNav({active:['Problems']}));
    $("#wrap").html(template.mainTabProblems({}));
    require('./controller/main-tab-problem').setup();
})