var CONST = require('../const');
var Testcase = require('./Testcase');

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
    for (var key in this) {
        if (Array.isArray(this[key])) {
            obj[key] = [];
            this[key].forEach(function(item) {obj[key].push(item.toDict());});
        } else {
            obj[key] = this[key];
        }
    }
    return obj;
}

Problem.prototype.loadDict = function(obj) {
    for (var key in obj) {
        if (Array.isArray(this[key])) {
            this[key] = [];
            obj[key].forEach(function(item) {this[key].push((new Testcase).loadDict(item));}, this);
        } else {
            this[key] = obj[key];
        }
    }
    return this;
}

module.exports = Problem;
