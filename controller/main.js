console.log(new Date(), '====== Reloaded ======');

global.$ = $;
global.gui = require('nw.gui');
var CONST = require('./const');
var Contest = require('./model/Contest');
var Problem = require('./model/Problem');
var template = require('./controller/template');

global.contest = new Contest;

$("#nav").html(template.mainNav({active:['Contest']}));
/*$("#wrap").html(template.mainTabContest({isOpened: false}))
          .addClass('display-block');

require('./controller/main-tab-contest').setup();*/

problemList = [];
for (var i = 0; i < 3; ++i) {
    var problem = new Problem;
    for (var j = 0; j < 10; ++j) {
        var testcase = {};
        problem.addTestcase(testcase);
    }
    problem.title = "Problem " + i;
    problemList.push(problem);
}
/*$("#wrap").html(template.mainTabProblems({problemList:problemList}));*/
var problem = {};
problem.title = "Fibonacci Problem";
problem.source = "fibonacci";
problem.input = "fibonacci.in";
problem.output = "fibonacci.out";
problem.comparison = CONST.COMPARISON.BYTE;
problem.spj = "";
/*$("#problem-list #modification").html(template.problemModification({problem:problem, CONST:CONST}));*/

$("#wrap").html(template.mainTabProblems({problemList:[]}));
for (var i = 0; i < problemList.length; ++i){
    $("#problem-list #new-problem-box").before(template.problemListBox({
        problem: problemList[i],
        id: i,
    }))
}
require('./controller/main-tab-problem').setup();

var testcase = {};
testcase.input = 'fibonacci/fibonacci.in';
testcase.answer = 'fibonacci/fibonacci1.out';
testcase.score = 10;
testcase.time = 1000;
testcase.memory = 131072;

$("#modification").html(template.testcaseModification({
    problem: problem,
    testcase: testcase,
    pid: 0,
    tid: 0
}));
