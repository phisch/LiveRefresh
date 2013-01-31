var button;
var connect, disconnect


window.addEventListener("load",
                        function(){
                          var ToolbarUIItemProperties = {
                            title: "LiveRefresh",
                            icon: "img/icon.png",
                            popup: {
                              href: "popup.html",
                              width: 400,
                              height: 40
                            }
                          }
                          button = opera.contexts.toolbar.createItem(ToolbarUIItemProperties);
                          opera.contexts.toolbar.addItem(button);
                        },
                        false);


connect = function(host, port) {
  button.icon = "img/icon_active.png";
};

disconnect = function() {
  button.icon = "img/icon.png";
};