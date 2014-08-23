var CONST = require('../const');
var utils = require('../utils');
var template = require('./template');
var Problem = require('../model/Problem');
var Testcase = require('../model/Testcase');

function problemFormChange(e) {
    var m = $("#modification");
    var id = m.find("#problem-id").val();
    var p = contest.getProblem(id);

    p.title      = m.find("#title").val();
    p.source     = m.find("#source").val();
    p.input      = m.find("#input").val();
    p.output     = m.find("#output").val();
    p.comparison = m.find("#comparison").val();
    p.spj        = m.find("#spj").val();

    m.find("#spj").prop('disabled', p.comparison !== CONST.COMPARISON.SPJ);
    m.find("#problem-header-title").html(p.title);
    $("#problem-list .list-group a.problem-title[data-problem="+id+"]").html(p.title);

    console.debug('should save now!');
}

function testcaseFormChange(e) {
    var m = $("#modification");
    var pid = m.find("#pid").val();
    var tid = m.find("#tid").val();
    var p = contest.getProblem(pid);
    var t = p.getTestcase(tid);

    t.input  = m.find("#input").val();
    t.answer = m.find("#answer").val();
    t.score  = m.find("#score").val();
    t.time   = m.find("#time").val();
    t.memory = m.find("#memory").val();

    console.debug('should save now!');
}

function onProblemTitleClicked(e) {
    e.preventDefault();
    e.stopPropagation();

    var id = $(this).data('problem');
    $("#problem-list .active").removeClass('active');

    if (id === 'add') {
        var p = new Problem;
        p.title = 'The New Problem';
        contest.addProblem(p);
        id = contest.problemCount()-1;

        var node = $(template.problemListBox({
            problem: p, 
            id     : id
        }));
        node.find('.problem-title').on('click', onProblemTitleClicked);
        node.find('.problem-title').on('contextmenu', contextMenu);
        $("#problem-list #new-problem-box").before(node);
    } else {
        //$(this).addClass('active');
    }

    var html = template.problemModification({
        problem   : contest.getProblem(id),
        problemID : id,
        CONST     : CONST
    });
    var node = $(html);

    node.find('input').on('keyup', problemFormChange);
    node.find('input').on('change', problemFormChange);
    node.find('select').on('change', problemFormChange);

    $("#problem-list #modification").empty().append(node);
}

function onTestcaseTitleClicked(e) {
    e.preventDefault();
    e.stopPropagation();

    var pid = $(this).data('problem');
    var tid = $(this).data('testcase');
    $("#problem-list .active").removeClass('active');
    $(this).addClass('active');

    var p = contest.getProblem(pid);
    var t = p.getTestcase(tid);
    var html = template.testcaseModification({
        problem : p,
        pid     : pid,
        tid     : tid,
        testcase: t
    });
    var node = $(html);

    node.find('input').on('keyup', testcaseFormChange);
    node.find('input').on('change', testcaseFormChange);
    node.find('.typeahead').on('focus', onFileInputFocused);

    $("#problem-list #modification").empty().append(node);
}

function contextMenu(e) {
    e.preventDefault();

    var addTestcase = new gui.MenuItem({
        label: 'Add a testcase',
        click: onAddTestcase.bind(this)
    });
    var autoAddTestcases = new gui.MenuItem({
        label: 'Auto add other testcases',
        click: onAutoAddTestcases.bind(this)
    });
    var del = new gui.MenuItem({
        label: 'Delete',
        click: onDelete.bind(this)
    });

    var menu = new gui.Menu();
    menu.append(addTestcase);
    menu.append(autoAddTestcases);
    menu.append(new gui.MenuItem({type: 'separator'}));
    menu.append(del);
    menu.popup(e.clientX, e.clientY);
    return false;
}

function onFileInputFocused(e) {
    contest.refreshDataFileList();
    var obj = contest.getDataFileList($(this).val()).map(function(item){return {name: item}});
    $(this).typeahead({
        source: obj,
        items: 24,
    });
}

function _setupProblemListBox(pid, problem) {
    var node = $(template.problemListBox({
        id     : pid,
        problem: problem
    }));
    node.find('.problem-title').on('click', onProblemTitleClicked);
    node.find('.problem-title').on('contextmenu', contextMenu);
    node.find('.testcase-title').on('click', onTestcaseTitleClicked);
    node.find('.testcase-title').on('contextmenu', contextMenu);

    var o_active = $(this).parent().parent().parent().find('.testcase-title.active');
    node.find('a.testcase-title[data-testcase='+o_active.data('testcase')+']').addClass('active');
    $(this).parent().parent().parent().replaceWith(node);
}

function onAddTestcase() {
    var pid = $(this).data('problem');
    if (pid === 'add') return;
    var p = contest.getProblem(pid);
    var tid = p.testcaseCount();
    var t = new Testcase;
    if (tid === 0) {
        t.input  = '';
        t.answer = '';
        t.score  = nconf.get('defaults:fullScore');
        t.time   = nconf.get('defaults:timeLimit');
        t.memory = nconf.get('defaults:memoryLimit');
    } else {
        var o = p.getTestcase(tid-1);
        t.input  = utils.getNextFilename(o.input);
        t.answer = utils.getNextFilename(o.answer);
        t.score  = o.score;
        t.time   = o.time;
        t.memory = o.memory;
    }
    p.addTestcase(t);

    _setupProblemListBox.call(this, pid, p);
}

function onAutoAddTestcases() {
    var pid = $(this).data('problem');
    if (pid === 'add') return;
    var p = contest.getProblem(pid);
    var tid = p.testcaseCount();
    if (tid === 0) return;
    var o = p.getTestcase(tid-1);
    var inputs = contest.getNextTestcases(o.input);
    var answers = contest.getNextTestcases(o.answer);
    var count = inputs.length < answers.length ? inputs.length : answers.length;

    for (var i = 0; i < count; ++i) {
        var t = new Testcase;
        o = p.getTestcase(tid-1+i);
        t.input  = utils.getNextFilename(o.input);
        t.answer = utils.getNextFilename(o.answer);
        t.score  = o.score;
        t.time   = o.time;
        t.memory = o.memory;
        p.addTestcase(t);
    }

    _setupProblemListBox.call(this, pid, p);
}

function onDelete() {
    var pid = $(this).data('problem');
    var tid = $(this).data('testcase');
    if (pid === 'add') return;

    if (typeof tid === 'undefined') {
        contest.delProblem(pid);
        $(this).parent().parent().parent().remove();
    } else {
        var p = contest.getProblem(pid);
        p.delTestcase(tid);
        _setupProblemListBox.call(this, pid, p);
    }

    exports.setup();
}

exports.setup = function() {
    var box = $("#problem-list #new-problem-box");
    box.prevAll().remove();
    for (var pid = 0; pid < contest.problemCount(); ++pid) {
        var node = $(template.problemListBox({
            id     : pid,
            problem: contest.getProblem(pid)
        }));
        box.before(node);
    }

    $("#problem-list .problem-title").on('click', onProblemTitleClicked);
    $("#problem-list .problem-title").on('contextmenu', contextMenu);
    $("#problem-list .testcase-title").on('click', onTestcaseTitleClicked);
    $("#problem-list .testcase-title").on('contextmenu', contextMenu);
}
