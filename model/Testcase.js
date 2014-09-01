function Testcase() {
    this.input  = '';
    this.answer = '';
    this.score  = 0;
    this.time   = 0;
    this.memory = 0;
}

Testcase.prototype.toDict = function() {
    var obj = {};
    for (var key in this) obj[key] = this[key];
    return obj;
};

Testcase.prototype.loadDict = function(obj) {
    for (var key in obj) this[key] = obj[key];
    return this;
};

module.exports = Testcase;
