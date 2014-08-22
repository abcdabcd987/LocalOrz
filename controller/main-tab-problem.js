var CONST = require('../const');
var template = require('./template');
var Problem = require('../model/Problem');

function problemFormChange(e) {
    e.preventDefault();
    e.stopPropagation();

    var m = $("#modification");
    var id = m.find("#problem-id").val();
    var p = contest.getProblem(id);

    p.title      = m.find("#title").val();
    p.source     = m.find("#source").val();
    p.input      = m.find("#input").val();
    p.output     = m.find("#output").val();
    p.comparison = m.find("#comparison").val();
    p.spj        = m.find("#spj").val();

    m.find("#problem-header-title").html(p.title);
    m.find("#spj").prop('disabled', p.comparison !== CONST.COMPARISON.SPJ);

    console.debug('should save now!');
}

function testcaseFormChange(e) {
    e.preventDefault();
    e.stopPropagation();

    var m = $("#modification");
    var pid = m.find("#pid").val();
    var tid = m.find("#tid").val();
    var p = contest.getProblem(id);
    var t = p.getTestcase(id);

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
        node.on('click', onProblemTitleClicked);
        node.find('.problem-title').addClass('active');
        $("#problem-list #new-problem-box").before(node);
    } else {
        $(this).addClass('active');
    }

    var html = template.problemModification({
        problem   : contest.getProblem(id),
        problemID : id,
        CONST     : CONST
    });
    var node = $(html);

    node.find('input').on('keyup', problemFormChange);
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

    var html = template.testcaseModification({
        problem : contest.getProblem(pid),
        pid     : pid,
        tid     : tid
    });
    var node = $(html);

    node.find('input').on('keyup', testcaseFormChange);

    $("#problem-list #modification").empty().append(node);
}

function contextMenu(e) {
    e.preventDefault();
    console.log(e);

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

function onAddTestcase() {

}

function onAutoAddTestcases() {

}

function onDelete() {

}

exports.setup = function() {
    $("#problem-list .problem-title").on('click', onProblemTitleClicked);
    $("#problem-list .problem-title").on('contextmenu', contextMenu);
    $("#problem-list .testcase-title").on('click', onTestcaseTitleClicked);
    $("#problem-list .testcase-title").on('contextmenu', contextMenu);
}
