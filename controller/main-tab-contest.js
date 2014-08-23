function showAlert(message) {
    $("#alert").html(message).addClass('display-block');
    console.debug(message);
};

function newContest(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!$("#title").val()) { showAlert('Title not provided'); return; }
    if (!$("#save-path").val()) { showAlert('Save path not provided'); return; }
    contest.title = $("#title").val();
    contest._path = $("#save-path").val();

    contest.save()
           .then(contest.open.bind(contest, contest._path))
           .then(null, showAlert);
}

function openContest(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!$("#path").val()) { showAlert('Path not provided'); return; }

    var dir = $("#path").val();
    contest.open(dir);
}

function updateContest(e) {
    e.preventDefault();
    e.stopPropagation();
}

exports.setup = function() {
    $("#btn-new").on('click', newContest);
    $("#btn-open").on('click', openContest);
    $("#btn-update").on('click', updateContest);
};
