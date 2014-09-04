function Executor(person, problem, emitter) {
    this.person = person;
    this.problem = problem;
    this.emitter = emitter;
    this.datadir = path.join(person._path, '..', '..', data);
    this.tmpdir = path.join(person._path, '..', '..', 'tmp');

    this.result = new Result;
    this.result.uuid     = that.problem.uuid;
    this.result.title    = that.problem.title;
    this.result.status   = CONST.RESULT.UNKNOWN;
    this.result.detail   = '';
    this.result.filename = '';

    this.findSourceFile()
        .then(this.copySource)
        .then(this.compileSource)
        .then(this.run)
        .done(this.finish, this.finish);
}

Executor.prototype.findSourceFile = function() {
    var that = this;
    return new Promise(function (fulfill, reject) {
        that.emitter.emit('mesg', 'Finding Source File...');
        var exts = Object.keys(nconf.get('compiler'));
        for (var ext in exts) {
            var filename = that.problem.source + '.' + ext;
            var fullpath = path.join(that.person._path, filename);
            if (fs.existsSync(fullpath)) {
                that.source = fullpath;
                taht.tmpsrc = path.join(that.tmpdir, filename);
                that.extension = ext;
                that.emitter.emit('text', 'Source File Found: ' + filename);
                that.result.filename = filename;
                fulfill();
                return;
            }
        }

        that.emitter.emit('text', 'No Source File Found!');
        that.result.status = CONST.RESULT.NO_SOURCE_FILE;
        reject();
    });
}

Executor.prototype.copySource = function() {
    var that = this;
    return new Promise(function(fulfill, reject) {
        that.result.status = CONST.RESULT.COMPLIATION_ERROR;
        that.emitter.emit('mesg', 'Copying Source File...')
        fse.ensureDir(that.tmpdir, function(err) {
            if (err) {
                that.emitter.emit('text', 'Cannot ensure the directory: ' + that.tmpdir);
                that.result.detail = err.toString();
                reject();return;
            }
            fse.copy(that.source, that.tmpsrc, function(err) {
                if (err) {
                    that.emitter.emit('text', 'Cannot copy ' + that.source + ' to ' + that.tmpsrc);
                    that.result.detail = err.toString();
                    reject();
                }
                fulfill();
            });
        })
    })
}

Executor.prototype.compileSourceFile = function() {
    var that = this;
    return new Promise(function(fulfill, reject) {
        that.emitter.emit('mesg', 'Compiling Source File...');
        var compiler = nconf.get('compiler')[that.extension];
        var compileCommand = compiler.compile.replace(/%s/g, that.problem.source);
        var options = { cwd: that.tmpdir };
        child_process.exec(compileCommand, options, function(err, stdout, stderr) {
            if (err) {
                that.result.detail = stderr;
                that.emitter.emit('text', 'Compilation Error!');
                reject();return;
            }
            fse.remove(that.tmpsrc, function(err) {
                if (err) {
                    that.emitter.emit('text', 'Cannot remove ' + that.tmpsrc);
                    that.result.detail = err.toString();
                }
                fulfill();
            })
        })
    });
}

Executor.prototype.prepareExecute = function() {
    var that = this;
    return new Promise(function(fulfill, reject) {
        var s_input = path.join(that.datadir, that.testcase.input);
        var t_input = path.join(that.tmpdir, that.problem.input);

        that.emitter.emit('mesg', 'Copying Input File...');
        fse.copy(s_input, t_input, function(err) {
            if (err.code === 'ENOENT' && err.path === s_input) {
                that.point.status = CONST.POINT.NO_STD_INPUT;
                reject();return;
            }
            if (err) {
                that.point.status = CONST.POINT.UNKNOWN;
                that.point.detail = err.toString();
                reject();return;
            }
            fulfill();
        });
    })
}

Executor.prototype.execute = function() {
    var that = this;
    return new Promise(function(fulfill, reject) {
        that.emitter.emit('mesg', 'Running...');
        var compiler = nconf.get('compiler')[that.extension];
        var executeCommand = compiler.execute.replace(/%s/g, that.problem.source);
        var options = { cwd: that.tmpdir };
        var args = [executeCommand, that.problem.time, that.problem.memory];
        child_process.execFile(CONST.BIN.TRACKER, args, options, function(err, stdout, stderr) {
            if (err) {
                that.point.status = CONST.POINT.RE;
                that.point.detail = err.toString();
                reject();return;
            }

            var arr = stdout.split('\n');
            that.point.time     = arr[0];
            that.point.memory   = arr[1];
            that.point.exitcode = arr[2];
            that.point.status   = arr[3];
            that.point.signal   = arr[4];
            that.point.stderr   = stderr;

            fulfill();
        });
    });
}

Executor.prototype.diff = function() {
    var that = this;
    return new Promise(function(fulfill, reject) {
        var s_output = path.join(that.datadir, that.testcase.output);
        var t_output = path.join(that.tmpdir, that.testcase.output);
        var c_output = path.join(that.tmpdir, that.problem.output);
        fs.exists(c_output, function(exists) {
            if (!exists) {
                that.point.status = CONST.POINT.NO_OUTPUT;
                reject();return;
            }
            fse.copy(s_output, t_output, function(err) {
                if (err.code === 'ENOENT' && err.path === s_input) {
                    that.point.status = CONST.POINT.NO_STD_OUTPUT;
                    reject();return;
                }
                if (err) {
                    that.point.status = CONST.POINT.UNKNOWN;
                    that.point.detail = err.toString();
                    reject();return;
                }

                var checker = CONST.BIN.NORMAL_JUDGE;
                if (that.problem.comparison === CONST.PROBLEM.SPJ) {
                    checker = path.join(that.datadir, that.problem.spj);
                }
                var args = [Number(that.testcase.score).toString(), t_output, c_output];
                var options = { cwd: that.tmpdir };
                child_process.execFile(checker, args, options, function(err, stdout, stderr) {
                    if (err) {
                        that.point.status = CONST.POINT.SPJ_ERROR;
                        that.point.detail = err.toString();
                        reject();return;
                    }
                    var score = Number(stdout);
                    if (isNaN(score)) {
                        that.point.status = CONST.POINT.SPJ_ERROR;
                        that.point.detail = 'Score is not a number';
                        reject();return;
                    }
                    that.point.score = score;
                    that.point.detail = stderr;
                    if (score === that.testcase.score) {
                        that.point.status = CONST.POINT.AC;
                    } else {
                        that.point.status = CONST.POINT.PART_CORRECT;
                    }
                    fulfill();
                });
            })
        })
    })
}

Executor.prototype.clean = function() {
    var that = this;
    var remove = function(file) {
        return new Promise(function(fulfill, reject) {
            fs.unlink(file, function(err) {
                fulfill();
            })
        })
    };

    that.result.addPoint(that.point);
    that.emitter.emit('testcase', that.testcaseID, that.point);

    return new Promise(function(fulfill, reject) {
        that.emitter.emit('mesg', 'Doing some cleaning...');
        fs.readdir(that.tmpdir, function(err, files) {
            if (err) {
                fulfill();return;
            }
            var compiler = nconf.get('compiler')[that.extension];
            var executeCommand = compiler.execute.replace(/%s/g, that.problem.source);
            var promises = [];
            files.forEach(function(item) {
                if (item !== executeCommand) return;
                promises.push(remove(path.join(that.tmpdir, item)));
            })
            Promise.all(promises).then(fulfill);
        })
    })
}

Executor.prototype.run = function() {
    var that = this;
    return new Promise(function(fulfill, reject) {
        for (var i = 0; i < that.problem.testcaseCount(); ++i) {
            that.testcaseID = i;
            that.testcase = that.problem.getTestcase(i);

            that.point = new Point;
            that.point.detail   = '';
            that.point.status   = CONST.POINT.CANNOT_EXECUTE;
            that.point.score    = 0;
            that.point.time     = 0;
            that.point.memory   = 0;
            that.point.exitcode = 0;
            that.point.signal   = '';
            that.point.stderr   = '';

            that.prepareExecute()
                .then(that.execute)
                .then(that.diff)
                .done(that.clean, that.clean);
        }
        fulfill();
    })
}

Executor.prototype.finish = function() {
    this.person.updateResult(this.result);
    fse.remove(that.tmpdir, function(err) {
        
    })
}
