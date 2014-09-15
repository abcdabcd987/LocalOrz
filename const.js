var path = require('path');

module.exports = {
    VERSION: '0.0.1',

    COMPARISON: {
        IGNORE: 'ignore',
        BYTE  : 'byte by byte',
        SPJ   : 'special judge'
    },

    RESULT: {
        UNKNOWN           : 'unknown',
        NORMAL            : 'normal',
        COMPILATION_ERROR : 'compilation error',
        NO_SOURCE_FILE    : 'no source file',
    },

    POINT: {
        AC             : 'accepted',
        WA             : 'wrong answer',
        RE             : 'runtime error',
        MLE            : 'memory limit exceeded',
        TLE            : 'time limit exceeded',
        PART_CORRECT   : 'partly correct',
        CANNOT_EXECUTE : 'cannot execute',
        SPJ_ERROR      : 'special judge error',
        NO_OUTPUT      : 'no output file',
        NO_STD_INPUT   : 'no standard input file',
        NO_STD_OUTPUT  : 'no standard output file',
        UNKNOWN        : 'unknown',
    },

    PERSON: {
        UNJUDGED : 'unjudged',
        JUDGED   : 'judged',
    },

    BIN: {
        TRACKER      : path.join(__dirname, 'bin', 'tracker'),
        NORMAL_JUDGE : path.join(__dirname, 'bin', 'normal_judge'),
    }
};
