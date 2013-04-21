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
        $("#others").append($("<li>" + response.otherData[i] + "</li>"));
      }
    });
    return false;
  });

 //var subjects = ['PHP', 'MySQL', 'SQL', 'PostgreSQL', 'HTML', 'CSS', 'HTML5', 'CSS3', 'JSON'];   
});

