var CONST = require('../const');

function Problem() {
    this.title      = '';
    this.source     = '';
    this.input      = '';
    this.output     = '';
    this.comparison = '';
    this.spj        = '';
    this._testcase  = [];
}

Problem.prototype.addTestcase = function(t) {
    this._testcase.push(t);
};

Problem.prototype.getTestcase = function(i) {
    return this._testcase[i];
}

Problem.prototype.testcaseCount = function() {
    return this._testcase.length;
};

module.exports = Problem;
