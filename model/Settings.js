var fs = require('fs');
var path = require('path');
var conf = path.join(global.gui.App.dataPath, 'settings.json')

global.nconf = require('nconf');

exports.setup = function() {
    nconf.file(conf);
    if (fs.existsSync(conf)) return;

    nconf.set('data:fullScore', 10);
    nconf.set('data:timeLimit', 1000);
    nconf.set('data:memoryLimit', 131072);

    nconf.set('compiler:pas:compile', 'fpc %s.pas -o %s');
    nconf.set('compiler:pas:execute', '%s');

    nconf.set('compiler:c:compile', 'gcc %s.c -o %s');
    nconf.set('compiler:c:execute', '%s');

    nconf.set('compiler:cpp:compile', 'g++ %s.cpp -o %s');
    nconf.set('compiler:cpp:execute', '%s');

    nconf.save();
};
