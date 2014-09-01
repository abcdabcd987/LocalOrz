var CONST = require('./const');

exports.getNextFilename = function(str) {
    if (typeof str !== 'string') return '';
    var num_st = -1;
    var num_ed = -1;
    for (var i = str.length-1; i >= 0; --i) {
        if ('0' <= str[i] && str[i] <= '9') {
            if (num_ed === -1) num_ed = i;
            num_st = i;
        } else {
            if (num_ed !== -1) break;
        }
    }
    if (num_ed === -1) return '';
    var num = Number(str.substr(num_st, num_ed-num_st+1));
    return str.substr(0, num_st) + (num+1).toString() + str.substring(num_ed+1, str.length);
}

var statusToString = {};
statusToString[CONST.RESULT.UNKNOWN          ] = 'Unknown';
statusToString[CONST.RESULT.NORMAL           ] = 'Normal';
statusToString[CONST.RESULT.COMPILATION_ERROR] = 'Compilation Error';
statusToString[CONST.RESULT.NO_SOURCE_FILE   ] = 'No Source File';
statusToString[CONST.POINT.AC                ] = 'Accepted';
statusToString[CONST.POINT.WA                ] = 'Wrong Answer';
statusToString[CONST.POINT.RE                ] = 'Runtime Error';
statusToString[CONST.POINT.CE                ] = 'Compilation Error';
statusToString[CONST.POINT.MLE               ] = 'Memory Limit Exceeded';
statusToString[CONST.POINT.TLE               ] = 'Time Limit Exceeded',
statusToString[CONST.POINT.PART_CORRECT      ] = 'Partly Correct';
statusToString[CONST.POINT.CANNOT_EXECUTE    ] = 'Cannot Execute';
statusToString[CONST.POINT.SPJ_ERROR         ] = 'Special Judge Error';
statusToString[CONST.POINT.NO_OUTPUT         ] = 'No Output File';
statusToString[CONST.POINT.NO_STD_INPUT      ] = 'No Standard Input File';
statusToString[CONST.POINT.NO_STD_OUTPUT     ] = 'No Standard Output File';
statusToString[CONST.PERSON.UNJUDGED         ] = 'Unjudged';
statusToString[CONST.PERSON.JUDGED           ] = 'Judged';
exports.statusToString = statusToString;
