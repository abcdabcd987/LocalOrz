var fs = require('fs');
var ejs = require('ejs');
var path = require('path');

function load(filename) {
    var str = fs.readFileSync(path.join(__dirname, '..', 'view', filename + '.ejs'), 'utf8');
    return ejs.compile(str);
}

exports.mainNav        = load('main-nav');
exports.mainTabContest = load('main-tab-contest');
