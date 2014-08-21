console.log(new Date(), '====== Reloaded ======');

global.$ = $;
var Contest = require('./model/Contest');
var template = require('./controller/template');

global.contest = new Contest;

$("#nav").html(template.mainNav({active:['Contest']}));
$("#wrap").html(template.mainTabContest({isOpened: false}))
          .addClass('display-block');

require('./controller/main-tab-contest').setup();
