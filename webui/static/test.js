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
      $("#current-contest").fadeOut(function() {
        $(this).text(response.current).fadeIn();
      });
    });
    return false;
  });
  $("#btn-addothercase").click(function () {
    var args = $("#add-testcase").formToDict();
    args['action'] = 'addOtherTestcase';
    $.postJSON("/test/ajax", args, function(response) {
      $("#current-contest").fadeOut(function() {
        $(this).text(response.current).fadeIn();
      });
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

function showPersonResult(response) {
  var person_result = $("#person-result");
  person_result.slideUp(function() {
    $(this).html("");
    for (var i = 0; i < response.problem.length; ++i) {
      var problem = response.problem[i];
      var tbody = $('<tbody></tbody>');
      for (var j = 0; j < problem.testcase.length; ++j) {
        var testcase = problem.testcase[j];
        $('<tr data-status="' + testcase.status + '"><td>' + (j+1) + '</td><td>' + testcase.status + '<a class="data-detail" data-detail="' + testcase.detail + '" href="#">(?)</a></td><td>' + testcase.score + '</td><td>' + testcase.time + 'ms</td><td>' + testcase.memory + 'KB</td></tr>').appendTo(tbody);
      }
      var wrapper = $('<div></div>');
      var table = $('<table class="table table-hover table-condensed"></table>');
      $('<p style="font-family:monospace;">Title: ' + problem.title + ' | Status: ' + problem.status + '<a class="data-detail" data-detail="' + problem.detail + '" href="#">(?)</a> | Filename: ' + problem.filename + ' | Total Time: ' + problem.time + 'ms | Score: ' + problem.score + ' | <a href="#" data-problemid="' + i + '" data-personid="' + response.personid + '" class="data-judge-problem">Rejudge</a></p>').appendTo(wrapper);
      $('<thead><tr><td>#</td><td>Status</td><td>Score</td><td>Time</td><td>Memory</td></thead>').appendTo(table);
      tbody.appendTo(table);
      table.appendTo(wrapper);
      wrapper.appendTo(person_result);
    }
    $('#person-result tr[data-status="Accepted"]').addClass("alert alert-success");
    $('#person-result tr[data-status="Partly Accepted"]').addClass("alert alert-success");
    $('#person-result tr[data-status="Wrong Answer"]').addClass("alert alert-error");
    $('#person-result tr[data-status="Runtime Error"]').addClass("alert alert-error");
    $('#person-result tr[data-status="Time Limit Exceeded"]').addClass("alert");
    $('#person-result tr[data-status="Memory Limit Exceeded"]').addClass("alert");
    person_result.slideDown();
    $(".data-detail").click(function() {
      alert($(this).attr("data-detail"));
      return false;
    });
    $(".data-judge-problem").click(function() {
      $.postJSON("/test/ajax", {action: 'judgeProblem', personid: $(this).attr("data-personid"), problemid: $(this).attr("data-problemid")}, function(response) {
        $("#person-result").slideUp(function() {
          $(this).html("Judging").slideDown();
        });
      });
      return false;
    });
  });
}

function refreshPeople() {
  $.postJSON("/test/ajax", {action: 'getPeople'}, function(response) {
    $("#people-table").slideUp(function() {
      $(this).html("");
      for (i = 0; i < response.people.length; ++i) {
        var people = response.people[i];
        $("<tr data-person-id=\"" + i + "\"><td>" + people.id + "</td><td>" + people.name + "</td><td>" + people.score + "</td><td>" + people.time + "ms</td></tr>")
          .click(function() {
            $.postJSON('/test/ajax', {action: 'getPersonResult', personid: $(this).attr("data-person-id")}, function(response) {
              showPersonResult(response);
            });
          })
          .appendTo($("#people-table"));
      }
      $(this).slideDown();
    });
  });
}

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
    if (message.message === '!!RefreshPerson') {
      $.postJSON('/test/ajax', {action: 'getPersonResult', personid: response.message.personid}, function(response) {
        showPersonResult(response);
      });
    } else if (message.message === '!!RefreshPeople') {
      $("#person-result").slideUp(function() {
        $(this).html("");
      });
      refreshPeople();
    } else {
      var judge_info = $("#judge-info");
      judge_info.text(judge_info.text() + message);
      judge_info.animate({
          scrollTop:judge_info[0].scrollHeight - judge_info.height()
      },50);
    }
  },
};
function setJudge() {
  $("#start-judge").click(function() {
    $.postJSON("/test/ajax", {action: 'judgeAll'}, function(response) {
      $("#person-result").slideUp(function() {
        $(this).html("Judging").slideDown();
      });
    });
  });
}
