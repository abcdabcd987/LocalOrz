function Testcase() {
    this.input  = '';
    this.answer = '';
    this.score  = '';
    this.time   = '';
    this.memory = '';
}

Testcase.prototype.toDict = function() {
    var obj = {};
    for (key in this) obj[key] = this[key];
    return obj;
};

Testcase.prototype.loadDict = function(obj) {
    for (key in obj) this[key] = obj[key];
    return this;
};

module.exports = Testcase;
