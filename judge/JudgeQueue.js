var events = require('events');

var task = [];
var head = 0;
var executing = false;

function dequeue() {
    if (!task.length) return undefined;
    var item = task[head++];
    if (head >= task.length/2) {
        task.splice(0, head);
        head = 0;
    }
    return item;
}

function onStart() {
    process.stdout.write('start\n');
    if (!executing) {
        var t = dequeue();
        if (t) {
            executing = true;
            t.start();
        }
    }
}

function onFinish() {
    process.stdout.write('finish\n');
    executing = false;
    global.JudgeQueue.emit('start');
}

global.JudgeQueue = new events.EventEmitter;
global.JudgeQueue.on('start', onStart);
global.JudgeQueue.on('finish', onFinish);

global.JudgeQueue.enqueue = function(item) {
    task.push(item);
    global.JudgeQueue.emit('start');
}

//Test code:
JudgeQueue.on('text', function(text) {
    process.stdout.write('        [text]' + text + '\n');
})

JudgeQueue.on('mesg', function(mesg) {
    process.stdout.write('        [mesg]' + mesg + '\n');
})

JudgeQueue.on('testcase', function(i, p) {
    process.stdout.write('        [Testcase ' + i + ']' + p.status + ', ' + p.time + 'ms\n');
})