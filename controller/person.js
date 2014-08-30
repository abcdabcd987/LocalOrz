var CONST = require('../CONST');
var template = require('./template');

var statusToString = {};
statusToString[CONST.RESULT.UNKNOWN          ] = 'Unknown',
statusToString[CONST.RESULT.NORMAL           ] = 'Normal',
statusToString[CONST.RESULT.COMPILATION_ERROR] = 'Compilation Error',
statusToString[CONST.RESULT.NO_SOURCE_FILE   ] = 'No Source File',

statusToString[CONST.POINT.AC                ] = 'Accepted',
statusToString[CONST.POINT.WA                ] = 'Wrong Answer',
statusToString[CONST.POINT.RE                ] = 'Runtime Error',
statusToString[CONST.POINT.CE                ] = 'Compilation Error',
statusToString[CONST.POINT.MLE               ] = 'Memory Limit Exceeded',
statusToString[CONST.POINT.TLE               ] = 'Time Limit Exceeded',
statusToString[CONST.POINT.PART_CORRECT      ] = 'Partly Correct',
statusToString[CONST.POINT.CANNOT_EXECUTE    ] = 'Cannot Execute',
statusToString[CONST.POINT.SPJ_ERROR         ] = 'Special Judge Error',
statusToString[CONST.POINT.NO_OUTPUT         ] = 'No Output File',
statusToString[CONST.POINT.NO_STD_INPUT      ] = 'No Standard Input File',
statusToString[CONST.POINT.NO_STD_OUTPUT     ] = 'No Standard Output File',

exports.show = function(name) {
    if (!(name in contestants)) return;
    var person = contestants[name];
    var win = gui.Window.open('person.html');
    win.on('loaded', function() {
        var w = win.window;
    
        var node = $(template.person({
            person: person,
            CONST : CONST,
            statusToString: statusToString,
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