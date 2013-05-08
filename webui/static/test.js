$.postJSON = function(url, args, callback) {
  $.ajax({url: url, data: $.param(args), dataType: "text", type: "POST",success: function(response) {
    if (callback) callback(eval("(" + response + ")"));
  }, error: function(response) {
    console.log("ERROR:", response)
  }});
};

$.fn.formToDict = function() {
  var fields = this.serializeArray();
  var json = {}
  for (var i = 0; i < fields.length; i++) {
    var name = fields[i].name;
    if (name.substr(name.length-2, 2) == '[]') {
      name = name.substr(0, name.length-2);
      if (name in json) {
        json[name].push(fields[i].value);
      } else {
        json[name] = [fields[i].value];
      }
    } else {
      json[name] = fields[i].value;
    }
  }
  return json;
};

$(document).ready(function() {
  if (!window.console) window.console = {};
  if (!window.console.log) window.console.log = function() {};

//------testProblem
  $("#input-checker-extra").hide();
  $("#input-checker-extra").css("margin-bottom", "10px");
  $("#select-checker").change(function () {
    var selection = $("#select-checker option:selected").val();
    if (selection == 'standard') {
      $("#input-checker-extra").val("").hide();
    } else if (selection == 'special') {
      $("#input-checker-extra").val("").width("auto").show();
      $("#input-checker-extra").data('typeahead', (data = null));
      $("#input-checker-extra").typeahead({
        source: function (query, process) {
          $.postJSON("/test/data", {datapath: query, action: "getList"}, function(response) {
            process(response.dataList);
          });
        }, sorter: function (items) {
          return items.sort();
        }, items: 40
      }).select();
    } else {
      $("#input-checker-extra").val("6").width("2em").show().off().select();
    }
  });
  //$('#btn-addprob').click(function () {
  //  var args = $("#problemform").formToDict();
  //  args['action'] = 'addProblem';
  //  $.postJSON("/test/ajax", args, function(response) {
  //    $("#status").append("<code>" + response.status + "</code>");
  //  });
  //});

//------testTestcase
  $.postJSON("/test/ajax", {action: 'getProblems'}, function(response) {
    for (var i = 0; i < response.problemList.length; ++i) {
      var prob = response.problemList[i];
      $("<option>").val(prob.id).text(prob.name).appendTo($("#select-problem"));
    }
  });
  $("#btn-testcase-add-input").click(function() {
    $(this).before($('<div><input type="text" name="inputs[]" placeholder="Input File Path" class="typeahead-data" autocomplete="off" data-provide="typeahead" class="typeahead-data"></div>').typeahead({
        source: function (query, process) {
          $.postJSON("/test/ajax", {datapath: query, action: "getDataFiles"}, function(response) {
            process(response.dataList);
          });
        }, sorter: function (items) {
          return items.sort();
        }, items: 40
      })
    );
    return false;
  });
  $("#btn-addtestcase").click(function () {
    var args = $("#add-testcase").formToDict();
    args['action'] = 'addTestcase';
    $.postJSON("/test/ajax", args, function(response) {
      $("#current-contest").fadeOut().text(response.current).fadeIn();
    });
    return false;
  });
  $("#btn-addothercase").click(function () {
    var args = $("#add-testcase").formToDict();
    args['action'] = 'addOtherTestcase';
    $.postJSON("/test/ajax", args, function(response) {
      $("#current-contest").fadeOut().text(response.current).fadeIn();
    });
    return false;
  });
  $("#select-problem").change(function() {
    $("#btn-addtestcase").removeAttr("disabled");
    $("#btn-addothercase").removeAttr("disabled");
  });
  $("#btn-add-input").click(function() {
    $(this).before('<input type="text" name="inputs[]" placeholder="Input Filename">');
    return false;
  });
  $("#btn-add-addition").click(function() {
    $(this).before($('<input type="text" name="addition[]" placeholder="Addition Filename" class="typeahead-data" autocomplete="off" data-provide="typeahead">').typeahead({
        source: function (query, process) {
          $.postJSON("/test/ajax", {datapath: query, action: "getDataFiles"}, function(response) {
            process(response.dataList);
          });
        }, sorter: function (items) {
          return items.sort();
        }, items: 40
      })
    );
    return false;
  });
  $("#select-checker").change(function () {
    var selection = $("#select-checker option:selected").val();
    if (selection == 'Normal Judge') {
      $("#input-checker-extra").hide();
    } else if (selection == 'Special Judge') {
      $("#input-checker-extra").val("").width("auto").show();
      $("#input-checker-extra").data('typeahead', (data = null));
      $("#input-checker-extra").typeahead({
        source: function (query, process) {
          $.postJSON("/test/ajax", {datapath: query, action: "getDataFiles"}, function(response) {
            process(response.dataList);
          });
        }, sorter: function (items) {
          return items.sort();
        }, items: 40
      }).select();
    } else {
      $("#input-checker-extra").val("6").width("2em").show().off().select();
    }
  });
  $(".typeahead-data").typeahead({
    source: function (query, process) {
      $.postJSON("/test/ajax", {datapath: query, action: "getDataFiles"}, function(response) {
        process(response.dataList);
      });
    }, sorter: function (items) {
      return items.sort();
    }, items: 40
  });


//------bootstrap-select
  $(".selectpicker").selectpicker("render");





});

function refreshPeople() {
  $.postJSON("/test/ajax", {action: 'getPeople'}, function(response) {
    $("#people-table").html("");
    for (var i = 0; i < response.people.length; ++i) {
      var people = response.people[i];
      $("<tr><td>" + people.id + "</td><td>" + people.name + "</td><td>" + people.score + "</td><td>" + people.time + "</td></tr>").appendTo($("#people-table"));
    }
  });
}

function setJudge() {
  $("#start-judge").click(function() {
    $.postJSON("/test/ajax", {action: 'judgeAll'}, function(response) {
      $(this).attr("disabled", "");
    });
  });
  var updater = {
    errorSleepTime: 500,

    poll: function() {
      $.ajax({url: "/test/judge", type: "POST", dataType: "text", success: updater.onSuccess, error: updater.onError});
    },
    
    onSuccess: function(response) {
      try {
        updater.newMessage(eval("(" + response + ")"));
      } catch (e) {
        updater.onError();
        return;
      }
      updater.errorSleepTime = 500;
      window.setTimeout(updater.poll, 0);
    },

    onError: function(response) {
      updater.errorSleepTime *= 2;
      console.log("Poll error; sleeping for", updater.errorSleepTime, "ms");
      window.setTimeout(updater.poll, updater.errorSleepTime);
    },

    newMessage: function(response) {
      var message = response.message;
      if (!message) return;
      var judge_info = $("#judge-info");
      judge_info.text(judge_info.text() + message);
      $(window).scrollTop(1000000);
    },
  };
  updater.poll();
}
