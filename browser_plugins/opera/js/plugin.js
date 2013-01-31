$(document).ready(function() {
  var background, connectButton, disconnectButton, hostField, portField;
  background = opera.extension.bgProcess;
  hostField = $('form#socketform #host');
  portField = $('form#socketform #port');
  connectButton = $('form#socketform #connect');
  disconnectButton = $('form#socketform #disconnect');
  
  connectButton.on("click", function(e) {
    e.preventDefault();
    if ($(e.target).hasClass("disabled")) {
      return;
    }
    background.connect(hostField.val(), portField.val());
    return window.close();
  });
  
  disconnectButton.on("click", function(e) {
    e.preventDefault();
    if ($(e.target).hasClass("disabled")) {
      return;
    }
    background.disconnect();
    return window.close();
  });
});
