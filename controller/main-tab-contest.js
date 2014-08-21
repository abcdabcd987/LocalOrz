function showAlert(message) {
    $("#alert").html(message).addClass('display-block');
    console.debug(message);
};

exports.setup = function() {
    $("#btn-new").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!$("#title").val()) { showAlert('Title not provided'); return; }
        if (!$("#save-path").val()) { showAlert('Save path not provided'); return; }
        contest.title = $("#title").val();
        contest._path = $("#save-path").val();

        contest.save()
               .then(contest.open.bind(contest))
               .then(null, showAlert);
    });

    $("#btn-open").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!$("#save-path").val()) { showAlert('Path not provided'); return; }

        var dir = $("#path").val();
        contest._path = dir;
        contest.open();
    });

    $("#btn-update").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
};
