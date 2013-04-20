$(document).ready(function() {
  if (!window.console) window.console = {};
  if (!window.console.log) window.console.log = function() {};

  if ($("#updateform").length) {
    $("#updateform").live("submit", function() {
      newMessage($(this));
      return false;
    });
    $("#updateform").live("keypress", function(e) {
      if (e.keyCode == 13) {
        newMessage($(this));
        return false;
      }
    });
  }
  if ($("#message").length) {
    $("#mesesage").select();
  }
  updater.poll();
});

function newMessage(form) {
  var message = form.formToDict();
  var disabled = form.find("input[type=submit]");
  disabled.attr("disabled", "");
  $.postJSON("/new", message, function(response) {
    updater.showMessage(response);
    form.find("input[type=text]").val("").select();
    disabled.removeAttr("disabled");
  });
}

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

var updater = {
  errorSleepTime: 500,

  poll: function() {
    var args = {};
    $.ajax({url: "/update", type: "POST", dataType: "text",
      data: $.param(args),
      success: updater.onSuccess,
      error: updater.onError});
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
    if (!response.message) return;
    var message = response.message;
    console.log("new messages");
    updater.showMessage(message);
  },

  showMessage: function(message) {
    var node = $(message);
    node.hide();
    $("#inbox").append(node);
    node.slideDown();
  }
};
