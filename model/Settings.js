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

    nconf.set('compiler:pas:compile', 'fpc %s -o %s.exe');
    nconf.set('compiler:pas:execute', './%s.exe');

    nconf.set('compiler:c:compile', 'gcc %s -o %s.exe');
    nconf.set('compiler:c:execute', './%s.exe');

    nconf.set('compiler:cpp:compile', 'g++ %s -o %s.exe');
    nconf.set('compiler:cpp:execute', './%s.exe');

    nconf.save();
};
