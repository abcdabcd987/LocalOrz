var template = require('./template');

function setupEvents() {
    $("#nav li a").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        exports.setup($(this).text());
    })
}

function pageContest() {
    var title = contest._isOpened ? contest.title : '';
    $("#nav").html(template.mainNav({
        active: ['Contest'],
        isOpen: contest._isOpened,
    }));
    $("#wrap").html(template.mainTabContest({
        isOpened: contest._isOpened,
        title   : title,
    }))
    require('./main-tab-contest').setup();

    setupEvents();
}

function pageProblems() {
    $("#nav").html(template.mainNav({
        active:['Problems'],
        isOpen: contest._isOpened,
    }));
    $("#wrap").html(template.mainTabProblems({}));
    require('./main-tab-problem').setup();

    setupEvents();
}

function pageContestants() {
    $("#nav").html(template.mainNav({
        active:['Contestants'],
        isOpen: contest._isOpened,
    }));
    $("#wrap").html(template.mainTabContestants({}));
    require('./main-tab-contestants').setup();
    require('./main-tab-contestants').refresh();

    setupEvents();
}

function pageSettings() {
    $("#nav").html(template.mainNav({
        active:['Settings'],
        isOpen: contest._isOpened,
    }));
    $("#wrap").html(template.mainTabSettings({
        data: nconf.get('data')
    }));
    require('./main-tab-settings').setup();

    setupEvents();
}

exports.setup = function(showPage) {
    page = {};
    page['Contest'] = pageContest;
    page['Problems'] = pageProblems;
    page['Settings'] = pageSettings;
    page['Contestants'] = pageContestants;

    var func = page[showPage];
    func();
}
