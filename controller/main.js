console.log(new Date(), '====== Reloaded ======');

var path = require('path');
var CONST = require('./const');
var Contest = require('./model/Contest');
var Problem = require('./model/Problem');
var template = require('./controller/template');

global.gui = require('nw.gui');
require('./model/Settings').setup();

global.$ = $;
global.contest = new Contest;

/*$("#nav").html(template.mainNav({active:['Contest']}));
$("#wrap").html(template.mainTabContest({isOpened: false}));
require('./controller/main-tab-contest').setup();

global.contest.on('open succeeded', function() {
    $("#nav").html(template.mainNav({active:['Problems']}));
    $("#wrap").html(template.mainTabProblems({}));
    require('./controller/main-tab-problem').setup();
})*/

$("#nav").html(template.mainNav({active:['Settings']}));
$("#wrap").html(template.mainTabSettings({
    data: global.nconf.get('data')
}));
require('./controller/main-tab-settings').setup();