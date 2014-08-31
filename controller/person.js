var utils = require('../utils');
var CONST = require('../CONST');
var template = require('./template');

exports.show = function(name) {
    if (!(name in contestants)) return;
    var person = contestants[name];
    var win = gui.Window.open('person.html');
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

            //TODO here
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
    })
}