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

function updateContest(save, e) {
    e.preventDefault();
    e.stopPropagation();

    contest.title = $("#title-to-update").val();
    $("#contest-title").text(contest.title);

    if (save) contest.save();
}

exports.setup = function() {
    $("#btn-new").on('click', newContest);
    $("#btn-open").on('click', openContest);
    $("#title-to-update").on('change', updateContest.bind(this, true));
    $("#title-to-update").on('keyup', updateContest.bind(this, false));
};
