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
      $("#input-checker-extra").hide();
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
  $("#btn-add-addition").click(function () {
    var cnt = parseInt($("#hidden-addcnt").val());
    $(this).before('<div><input type="text" id="input-add-' + cnt + '" name="addition[]" autocomplete="off" data-provide="typeahead"></div>');
    $("#input-add-" + cnt).typeahead({
        source: function (query, process) {
          $.postJSON("/test/ajax", {datapath: query, action: "getDataFiles"}, function(response) {
            process(response.dataList);
          });
        }, sorter: function (items) {
          return items.sort();
        }, items: 40
    }).select();
    $("#hidden-addcnt").val(cnt+1);
    return false;
  });
  $('#btn-addprob').click(function () {
    var args = $("#problemform").formToDict();
    args['action'] = 'addProblem';
    $.postJSON("/test/ajax", args, function(response) {
      $("#status").append("<code>" + response.status + "</code>");
    });
  });

//------testTestcase
  $.postJSON("/test/ajax", {action: 'getProblems'}, function(response) {
    for (var i = 0; i < response.problemList.length; ++i) {
      var prob = response.problemList[i];
      $("<option>").val(prob.id).text(prob.name).appendTo($("#select-problem"));
    }
  });
  $("#input-inputfile-0").typeahead({
    source: function (query, process) {
      $.postJSON("/test/ajax", {datapath: query, action: "getDataFiles"}, function(response) {
        process(response.dataList);
      });
    }, sorter: function (items) {
      return items.sort();
    }, items: 40
  });
  $("#input-outputfile").typeahead({
    source: function (query, process) {
      $.postJSON("/test/ajax", {datapath: query, action: "getDataFiles"}, function(response) {
        process(response.dataList);
      });
    }, sorter: function (items) {
      return items.sort();
    }, items: 40
  });
  $("#btn-add-input").click(function () {
    var cnt = parseInt($("#hidden-inputcnt").val());
    $(this).before('<div><input type="text" id="input-inputfile-' + cnt + '" name="inputs[]" autocomplete="off" data-provide="typeahead" placeholder="Addition Input File"></div>');
    $("#input-inputfile-" + cnt).typeahead({
        source: function (query, process) {
          $.postJSON("/test/ajax", {datapath: query, action: "getDataFiles"}, function(response) {
            process(response.dataList);
          });
        }, sorter: function (items) {
          return items.sort();
        }, items: 40
    }).select();
    $("#hidden-inputcnt").val(cnt+1);
    return false;
  });
  $("#btn-addtestcase").click(function () {
    var args = $("#testcaseform").formToDict();
    args['action'] = 'addTestcase';
    $(this).attr("disabled", "");
    $.postJSON("/test/ajax", args, function(response) {
      for (var i = 0; i < response.testcaseList.length; ++i) {
        var testcase = response.testcaseList[i];
        $("#result").append("<li><code>" + testcase[0] + " | " + testcase[1] + ' | ' + testcase[2] + ' | ' + testcase[3] + ' | ' + testcase[4] + ' | ' + testcase[5] + '</code></li>');
      }
      $("#btn-addothercase").removeAttr("disabled");
    });
  });
  $("#btn-addothercase").click(function () {
    var args = $("#testcaseform").formToDict();
    args['action'] = 'addOtherTestcase';
    $(this).attr("disabled", "");
    $.postJSON("/test/ajax", args, function(response) {
      for (var i = 0; i < response.testcaseList.length; ++i) {
        var testcase = response.testcaseList[i];
        $("#result").append("<li><code>" + testcase[0] + " | " + testcase[1] + ' | ' + testcase[2] + ' | ' + testcase[3] + ' | ' + testcase[4] + ' | ' + testcase[5] + '</code></li>');
      }
    });
  });
  $("#select-problem").change(function() {
    $("#btn-addtestcase").removeAttr("disabled");
    $("#btn-addothercase").attr("disabled", "");
  });

//------bootstrap-select
  $(".selectpicker").selectpicker("render");
  $("form").submit(function() { return false; });
});
