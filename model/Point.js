function Point() {
    this.detail   = null;
    this.status   = null;
    this.score    = null;
    this.time     = null
    this.memory   = null;
    this.exitcode = null;
    this.stderr   = null;
}

Point.prototype.toDict = function() {
    var obj = {};
    for (var key in this) obj[key] = this[key];
    return obj;
};

Point.prototype.loadDict = function(obj) {
    for (var key in obj) this[key] = obj[key];
    return this;
};

module.exports = Point;
