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

Problem.prototype.delTestcase = function(index) {
    for (var i = index+1; i < this._testcase.length; ++i) {
        this._testcase[i-1] = this._testcase[i];
    }
    --this._testcase.length;
}

Problem.prototype.testcaseCount = function() {
    return this._testcase.length;
};

Problem.prototype.toDict = function() {
    var obj = {};
    for (key in this) {
        if (isArray(this[key])) {
            obj[key] = [];
            for (item in this[key]) {
                obj[key].push(item.toDict());
            }
        } else {
            obj[key] = this[key];
        }
    }
}

Problem.prototype.loadDict = function(obj) {
    for (key in this) {
        if (isArray(this[key])) {
            this[key] = [];
            for (item in obj[key]) {
                var t = new Testcase;
                t.loadDict(item);
                this[key].push(t);
            }
        } else {
            this[key] = obj[key];
        }
    }
}

module.exports = Problem;
