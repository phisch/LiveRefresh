// Sorry for bad english in the comments :) [dummer]

var background =
{
    button: null                // Widget button 
  , tabs: new Array()           // tabId -> tab:BrowserTab, socket:WebSocket, host, port
  , Init: function()
    {
      window.addEventListener("load", this.onLoad(), false); // Call constructor after load
    }
  , onLoad: function() // Constructor for the extension
            {
              var self = this; // The crutch for access to object into anonymous function.

              var ToolbarUIItemProperties =
              {
                  title: "LiveRefresh"
                , icon: "img/icon.png"
                , popup: {
                    href: "popup.html", 
                    width: 400,
                    height: 40
                  }
              }; 
              this.button = opera.contexts.toolbar.createItem(ToolbarUIItemProperties); 
              opera.contexts.toolbar.addItem(this.button);

              opera.extension.tabs.onfocus = function() { self.onFocus(); }; // Action for each switching tabs
              opera.extension.onconnect = function(event) // Post message to popup with status connection of current tab
                                          {
                                            var tabId = opera.extension.tabs.getFocused().id;
                                            var status = self.tabs[tabId] != undefined;

                                            var host, port;
                                            if (status) // If connection exist, we write current host/port to inputs placeholder
                                            {
                                              host = self.tabs[tabId].host;
                                              port = self.tabs[tabId].port;
                                            }

                                            event.source.postMessage( {
                                                                          'tabId': tabId 
                                                                        , 'status': status
                                                                        , 'host': host
                                                                        , 'port': port
                                                                      } );
                                          }

              opera.extension.onmessage = function(event) { self.onMessage(event); };
            }
  , onFocus: function () // Handler for changing the active tab
              {
                if ( this.tabs[opera.extension.tabs.getFocused().id] != undefined )
                {
                  this.updateIcon('active');
                }
                else
                {
                  this.updateIcon('passive');
                }
              }
  , onMessage: function(event) // Handler for incoming messages
                { 
                  var action = event.data.action;
                  var tabId = opera.extension.tabs.getFocused().id;

                  if ( action == 'connect' )
                  {
                    var host = event.data.host;
                    var port = event.data.port;

                    if (host.length == 0)
                    {
                      host = 'localhost';
                    }
                    if (port.length == 0)
                    {
                      port = '1025';
                    }

                    this.connect(host, port, tabId);
                  }
                  else if ( action == 'disconnect' )
                  {
                    this.disconnect(tabId);
                  }
                }
  , connect: function(host, port, tabId)
              {
                var self = this; // The crutche for access to object into anonymous function.

                this.tabs[tabId] = {
                                      'tab': opera.extension.tabs.getFocused()
                                    , 'socket': new WebSocket('ws://' + host + ':' + port)
                                    , 'host': host
                                    , 'port': port
                                  }

                this.tabs[tabId].socket.onopen = function () { self.onSocketOpen(); };
                this.tabs[tabId].socket.onclose = function(event) { self.onSocketClose( event, tabId ); };
                this.tabs[tabId].socket.onmessage = function(event)
                                                    { 
                                                      // Refreshing the target tab after receive message through socket
                                                      self.onSocketMessage( event,
                                                                            function ()
                                                                            {
                                                                               self.tabs[tabId].tab.refresh();
                                                                            }
                                                                          );
                                                    };
                this.tabs[tabId].socket.onerror = function(event) { self.onSocketError(event); };
              }
  , disconnect: function(tabId)
                 {
                    this.tabs[tabId].socket.onclose = function(event) {};
                    this.tabs[tabId].socket.close();
                    this.tabs[tabId] = null;
                    this.updateIcon('passive');
                 }
  , onSocketOpen: function ()
                  {
                    this.updateIcon('active');
                  }
  , onSocketClose: function (event, tabId)
                  {
                    this.disconnect( tabId ); // If the connection aborted we close socket
                  }
  , onSocketMessage: function (event, refresh)
                      {
                        refresh();
                      }
  , onSocketError: function (error)
                    {
                      // We have the problem, but I don't know what we should do :(
                    }
  , updateIcon: function (type) 
                {
                  if (type == 'active')
                  {
                    this.button.icon = "img/icon_active.png";
                  } else {
                    this.button.icon = "img/icon.png"; 
                  }
                }
};

background.Init();