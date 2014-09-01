function Point() {
    this.detail   = '';
    this.status   = '';
    this.score    = 0;
    this.time     = 0;
    this.memory   = 0;
    this.exitcode = 0;
    this.stderr   = '';
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
