var Point = require('./Point');
var CONST = require('../const');

function Result() {
    this.uuid     = '';
    this.title    = '';
    this.status   = '';
    this.detail   = '';
    this.filename = '';
    this._point   = [];
}

Object.defineProperty(Result.prototype, 'time', {
    enumerable: false,
    get: function() {
        var sum = 0;
        this._point.forEach(function(item) { 
            if (item.status === CONST.POINT.AC || item.status === CONST.POINT.PART_CORRECT) {
                sum += item.time; 
            }
        });
        return sum;
    }
})

Object.defineProperty(Result.prototype, 'score', {
    enumerable: false,
    get: function() {
        var sum = 0;
        this._point.forEach(function(item) { sum += item.score; });
        return sum;
    }
})

Result.prototype.clear = function() {
    this._point.length = 0;
}

Result.prototype.addPoint = function(point) {
    this._point.push(point);
}

Result.prototype.getPoint = function(index) {
    return this._point[index];
}

Result.prototype.pointCount = function() {
    return this._point.length;
}

Result.prototype.toDict = function() {
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

Result.prototype.loadDict = function(obj) {
    for (var key in obj) {
        if (Array.isArray(this[key])) {
            this[key] = [];
            obj[key].forEach(function(item) {this[key].push((new Point).loadDict(item));}, this);
        } else {
            this[key] = obj[key];
        }
    }
    return this;
}

module.exports = Result;
