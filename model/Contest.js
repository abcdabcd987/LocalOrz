var path = require('path');
var fs = require('fs');
var walkdir = require('walkdir');
var Promise = require('promise');
var utils = require('../utils');
var CONST = require('../const');
var Problem = require('./Problem');

function Contest() {
    this.title = null;
    this.version = CONST.VERSION;
    this._path = null;
    this._isOpened = false;
    this._problem = [];
    this._dataFileList = [];
}

Contest.prototype.toDict = function() {
    var dict = {};
    for (key in this) {
        if (key === '_problem') {
            dict[key] = [];
            for (item in this[key]) {
                dict[key].push(item.toDict());
            }
        } else if (key[0] !== '_') {
            dict[key] = this[key];
        }
    }
    return dict;
};

Contest.prototype.loadDict = function(dict) {
    for (key in dict) {
        if (key == '_problem') {
            this[key] = [];
            for (item in dict[key]) {
                this[key].push((new Problem).loadDict(dict[key]));
            }
        } else {
            this[key] = dict[key];
        }
    }
}

Contest.prototype.open = function(dir) {
    this._path = path.normalize(dir);
    var read = Promise.denodeify(fs.readFile);
    var filepath = path.join(this._path, 'data', 'contest.json');
    var that = this;

    return read(filepath).then(JSON.parse).then(that.loadDict.bind(that)).then(function() {
        that._isOpened = true;
        that.version = CONST.VERSION;
        console.log(new Date(), '====== Contest Opened ======');
    });
};

Contest.prototype.save = function() {
    var obj = this.toDict();
    var json = JSON.stringify(obj, null, 4);
    var filepath = path.join(this._path, 'data', 'contest.json');
    var write = Promise.denodeify(fs.writeFile);

    return this._createDirectories()
               .then(write(filepath, json))
               .then(function() {
                    console.log(new Date(), '====== Contest Saved ======');
                });
};

Contest.prototype._createDirectories = function() {
    var dirs = ['src', 'data'].map(function(d) { return path.join(this._path, d); }, this);
    var create = function(dir) {
        return new Promise(function(fulfill, reject) {
            fs.mkdir(dir, function(err) {
                if (err && err.code !== 'EEXIST') reject(err);
                fs.chmod(dir, 0755, function(err) {
                    if (err) reject(err);
                    fulfill();
                })
            })
        });
    };
    return Promise.all(dirs.map(create));
};

Contest.prototype.getProblem = function(index) {
    return this._problem[index];
};

Contest.prototype.addProblem = function(problem) {
    this._problem.push(problem);
};

Contest.prototype.delProblem = function(index) {
    for (var i = index+1; i < this._problem.length; ++i) {
        this._problem[i-1] = this._problem[i];
    }
    --this._problem.length;
}

Contest.prototype.problemCount = function() {
    return this._problem.length;
};

Contest.prototype.refreshDataFileList = function() {
    var base = path.join(this._path, 'data/');
    this._dataFileList = walkdir.sync(base).map(function(item) {
        return item.replace(base, '');
    });
};

Contest.prototype.getDataFileList = function(_prefix) {
    var prefix = typeof _prefix === 'undefined' ? '' : _prefix;
    var list = [];
    this._dataFileList.forEach(function(file) {
        if (file.search(_prefix) !== -1) list.push(file);
    });
    return list;
};

Contest.prototype.getNextTestcases = function(last) {
    var list = [];
    while (true) {
        var next = utils.getNextFilename(last);
        if (next && this._dataFileList.indexOf(next) !== -1) {
            list.push(next);
            last = next;
        } else {
            break;
        }
    }
    return list;
}

module.exports = Contest;
