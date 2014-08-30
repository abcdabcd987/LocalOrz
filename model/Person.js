function Person() {
    this._name   = null;
    this._result = [];
}

Object.defineProperty(Person.prototype, 'time', {
    enumerable: true,
    get: function() {
        var sum = 0;
        this._result.forEach(function(item) { sum += item.time; });
        return sum;
    }
})

Object.defineProperty(Person.prototype, 'score', {
    enumerable: true,
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

module.exports = Person;
