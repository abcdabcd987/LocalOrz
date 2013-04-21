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
    json[fields[i].name] = fields[i].value;
  }
  if (json.next) delete json.next;
  return json;
};

$(document).ready(function() {
  if (!window.console) window.console = {};
  if (!window.console.log) window.console.log = function() {};

  $("#datapath").typeahead({
    source: function (query, process) {
      $.postJSON("/test/data", {datapath: query, action: "getList"}, function(response) {
        process(response.dataList);
      });
    }, sorter: function (items) {
      return items.sort();
    }
  });
  $("#dataform").submit(function () {
    $.postJSON("/test/data", {datapath: $("#datapath").val(), action: "getNext"}, function(response) {
      $("#others li").remove();
      for (var i = 0; i < response.otherData.length; ++i) {
        $("#others").append("<li>" + response.otherData[i] + "</li>");
      }
    });
    return false;
  });
  $(".selectpicker").selectpicker("render");
  $("#input-checker-extra").hide();
  $("#input-checker-extra").css("margin-bottom", "10px");
  $("#select-checker").change(function () {
    var selection = parseInt($("#select-checker option:selected").val());
    if (selection <= 1) {
      $("#input-checker-extra").hide();
    } else if (selection == 3) {
      $("#input-checker-extra").val("").width("auto").show();
      $("#input-checker-extra").data('typeahead', (data = null));
      $("#input-checker-extra").typeahead({
        source: function (query, process) {
          $.postJSON("/test/data", {datapath: query, action: "getList"}, function(response) {
            process(response.dataList);
          });
        }, sorter: function (items) {
          return items.sort();
        }
      }).select();
    } else {
      $("#input-checker-extra").val("6").width("2em").show().off().select();
    }
  });
  $("#btn-add-addition").click(function () {
    var cnt = parseInt($("#hidden-addcnt").val());
    $(this).before('<div><input type="text" id="input-add-' + cnt + '" name="addition" autocomplete="off" data-provide="typeahead"></div>');
    $("#input-add-" + cnt).typeahead({
        source: function (query, process) {
          $.postJSON("/test/data", {datapath: query, action: "getList"}, function(response) {
            process(response.dataList);
          });
        }, sorter: function (items) {
          return items.sort();
        }
    }).select();
    $("#hidden-addcnt").val(cnt+1);
    return false;
  });
});
