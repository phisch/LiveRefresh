// Sorry for bad english in the comments :) [dummer]

var background =
{
    button: null                // Widget button 
  , tabs: new Array()           // Associative array tab <-> open socket. 
  , Init: function()
    {
      window.addEventListener("load", this.onLoad(), false); // Constructor for the widget
    }
  , onLoad: function()
            {
              var self = this; // The crutche for access to object into anonymous function.

              var ToolbarUIItemProperties =
              {
                title: "LiveRefresh",
                icon: "img/icon.png",
                popup: {
                  href: "popup.html",
                  width: 400,
                  height: 40
                },
                badge: {
                  display: "block",
                  textContent: "12",
                  color: "white",
                  backgroundColor: "rgba(211, 0, 4, 1)"
                }
              };
              this.button = opera.contexts.toolbar.createItem(ToolbarUIItemProperties);
              opera.contexts.toolbar.addItem(this.button);

              opera.extension.tabs.onfocus = function() { self.onFocus(); };
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
  , onMessage: function(event) 
                {
                  //url = event.data; 
                }          
  , connect: function(host, port) 
              {
                var self = this; // The crutche for access to object into anonymous function.
                var tabId = opera.extension.tabs.getFocused().id;

                if (host.length == 0)
                {
                  host = 'localhost';
                }
                if (port.length == 0)
                {
                  port = '1025';  
                }

                this.tabs[tabId] = new WebSocket('ws://' + host + ':' + port);
                this.tabs[tabId].onopen = function () { opera.postError('onopen'); self.onSocketOpen(); };
                this.tabs[tabId].onclose = function(event) { opera.postError('onclose'); self.onSocketClose(event); };
                this.tabs[tabId].onmessage = function(event) { opera.postError('onmessage'); self.onSocketMessage(event); };
                this.tabs[tabId].onerror = function(event) { opera.postError('onerror'); self.onSocketError(event); };

                //return opera.extension.tabs.getFocused(); 
              }
  , onSocketOpen: function () 
                  { 
                    this.updateIcon('active'); 
                  }
  , onSocketClose: function (event)
                  {
                    if (event.wasClean) {
                      // Closed as normal
                    } else {
                      // Break connection
                    }
                    this.button.badge.textContent = 'close';
                  }
  , onSocketMessage: function (event)
                      {
                        this.button.badge.textContent = Math.random();
                      }
  , onSocketError: function (error)
                    {
                      // We have the problem, but I don't know what we should do :(
                      this.button.badge.textContent = 'Error';
                    }
  , disconnect: function()
                 {
                    this.updateIcon('passive');
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
}

background.Init();