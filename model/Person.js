var fs = require('fs');
var path = require('path');
var CONST = require('../CONST');
var Promise = require('promise');
var Result = require('./Result');

function Person() {
    this._name   = '';
    this._path   = '';
    this._rank   = 0;
    this._status = '';
    this.version = '';
    this._result = [];
}

Object.defineProperty(Person.prototype, 'time', {
    enumerable: false,
    get: function() {
        var sum = 0;
        this._result.forEach(function(item) { sum += item.time; });
        return sum;
    }
})

Object.defineProperty(Person.prototype, 'score', {
    enumerable: false,
    get: function() {
        var sum = 0;
        this._result.forEach(function(item) { sum += item.score; });
        return sum;
    }
})

Person.prototype.addResult = function(result) {
    this._result.push(result);
}

Person.prototype.delResult = function(index) {
    for (var i = index+1; i < this._result.length; ++i) {
        this._result[i-1] = this._result[i];
    }
    --this._result.length;
}

Person.prototype.getResult = function(index) {
    return this._result[index];
}

Person.prototype.resultCount = function() {
    return this._result.length;
}

Person.prototype.delResultByUUID = function(uuid) {
    for (var i = 0; i < this._result.length; ++i) {
        if (this._result[i].uuid === uuid) {
            this.delResult(i);
            return true;
        }
    }
    return false;
}

Person.prototype.getResultByUUID = function(uuid) {
    for (var i = 0; i < this._result.length; ++i) {
        if (this._result[i].uuid === uuid) {
            return this._result[i];
        }
    }
    return null;
}

Person.prototype.toDict = function() {
    var obj = {};
    for (var key in this) {
        if (Array.isArray(this[key])) {
            obj[key] = [];
            this[key].forEach(function(item) {obj[key].push(item.toDict());});
        } else if (key[0] !== '_') {
            obj[key] = this[key];
        }
    }
    return obj;
}

Person.prototype.loadDict = function(obj) {
    for (var key in obj) {
        if (Array.isArray(this[key])) {
            this[key] = [];
            obj[key].forEach(function(item) {this[key].push((new Result).loadDict(item));}, this);
        } else {
            this[key] = obj[key];
        }
    }
    return this;
}

Person.prototype.open = function(dir) {
    this._path = path.normalize(dir);
    var read = Promise.denodeify(fs.readFile);
    var filepath = path.join(this._path, 'result.json');
    var that = this;

    return read(filepath).then(JSON.parse).then(that.loadDict.bind(that))
          .then(function(person) {
               person._isOpened = true;
               person.version = CONST.VERSION;
               return person;
           }, function(err) {
               console.error(err);
               return err;
           });
};

Person.prototype.save = function() {
    var obj = this.toDict();
    var json = JSON.stringify(obj, null, 2);
    var filepath = path.join(this._path, 'result.json');
    var write = Promise.denodeify(fs.writeFile);
    var that = this;

    return write(filepath, json)
          .then(function() {

           }, function(err) {
               console.error(err);
               return err;
           });
};

module.exports = Person;
