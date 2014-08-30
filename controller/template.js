var fs = require('fs');
var ejs = require('ejs');
var path = require('path');

function load(filename) {
    var str = fs.readFileSync(path.join(__dirname, '..', 'view', filename + '.ejs'), 'utf8');
    return ejs.compile(str);
}

exports.person               = load('person');
exports.mainNav              = load('main-nav');
exports.mainTabContest       = load('main-tab-contest');
exports.mainTabProblems      = load('main-tab-problems');
exports.mainTabSettings      = load('main-tab-settings');
exports.problemListBox       = load('problem-list-box');
exports.problemModification  = load('problem-modification');
exports.compilerSettingsRow  = load('compiler-settings-row');
exports.testcaseModification = load('testcase-modification');
