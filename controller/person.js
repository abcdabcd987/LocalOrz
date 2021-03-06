var utils = require('../utils');
var CONST = require('../CONST');
var template = require('./template');
var Executor = require('../judge/Executor');

exports.show = function(name) {
    if (!(name in contestants)) return;
    if (name in showingPerson) {
        showingPerson[name].focus();
        return;
    }

    var person = contestants[name];
    var win = gui.Window.open('person.html', {
        position: "mouse",
        width: 729,
        height: 465,
        resizable: false,
        toolbar: false,
    });
    showingPerson[name] = win;

    win.on('loaded', function() {
        var w = win.window;
    
        var node = $(template.person({
            person: person,
            CONST : CONST,
            statusToString: utils.statusToString,
        }));
    
        node.find('a[href="#rejudge"]').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var problem = $(this).data('problem');
            var task = new Executor(person, contest.getProblemByUUID(problem), JudgeQueue);
            JudgeQueue.enqueue(task);
        });
    
        node.find('a[href="#detail"]').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var problem = $(this).data('problem');
            w.alert(person.getResultByUUID(problem).detail);
        });
    
        node.find('a[href="#stderr"]').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var problem = $(this).data('problem');
            var point = $(this).data('index');
            w.alert(person.getResultByUUID(problem).getPoint(point).stderr);
        });
    
        node.find('a[href="#point"]').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var problem = $(this).data('problem');
            var point = $(this).data('index');
            w.alert(person.getResultByUUID(problem).getPoint(point).detail);
        });
    
        $(w.document.head).find('title').text(person._name);
        $(w.document.body).html(node);
        win.focus();

        //win.showDevTools();
    });

    win.on('close', function() {
        delete showingPerson[name];
        this.close(true);
    });
}