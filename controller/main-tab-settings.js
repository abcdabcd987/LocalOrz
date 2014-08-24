var template = require('./template');

function defaultsChange() {
    nconf.set('data:fullScore', Number($('#full-score').val()));
    nconf.set('data:timeLimit', Number($("#time-limit").val()));
    nconf.set('data:memoryLimit', Number($("#memory-limit").val()));
    nconf.save();
}

function compilerChange() {
    var compiler = {};
    $(".compiler").each(function() {
        var extension = $(this).find('.extension').val();
        var compile = $(this).find('.compile').val();
        var execute = $(this).find('.execute').val();

        compiler[extension] = { compile: compile, execute: execute };
    })

    nconf.set('compiler', compiler);
    nconf.save();
}

function removeCompiler(e) {
    e.preventDefault();
    e.stopPropagation();

    $(this).parent().parent().remove();
    compilerChange();
}

function addCompiler(e) {
    e.preventDefault();
    e.stopPropagation();

    var p = $(this).parent().parent();
    var extension = p.find('.extension').val();
    var compile   = p.find('.compile').val();
    var execute   = p.find('.execute').val();

    $("#compilers-thead").after(renderCompilerRow(extension, compile, execute));
    compilerChange();

    p.find('.extension').val('');
    p.find('.compile').val('');
    p.find('.execute').val('');
}

function renderCompilerRow(extension, compile, execute) {
    var node = $(template.compilerSettingsRow({
        extension: extension, 
        compile: compile,
        execute: execute
    }));
    node.find('input').on('change', compilerChange);
    node.find('.remove').on('click', removeCompiler);
    return node;
}

exports.setup = function() {
    var compilers = nconf.get('compiler');
    var compilerHead = $("#compilers-thead");
    $("#new-compiler .add").on('click', addCompiler)
    compilerHead.nextAll().remove();
    for (var extension in compilers) {
        if (!compilers.hasOwnProperty(extension)) continue;
        var compile = compilers[extension].compile;
        var execute = compilers[extension].execute;
        compilerHead.after(renderCompilerRow(extension, compile, execute));
    }

    $("#defaults-settings input").on('change', defaultsChange);
}