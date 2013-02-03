$(document).ready(function() {
  var source; // The channel for messaging

  var hostField = $('form#socketform #host');
  var portField = $('form#socketform #port');
  var connectButton = $('form#socketform #connect');
  var disconnectButton = $('form#socketform #disconnect');

  var update = function( status, host, port )
                {
                  if ( status )
                  {
                    connectButton.addClass('disabled');
                    hostField.attr( 'placeholder', host );
                    portField.attr( 'placeholder', port );
                  }
                  else
                  {
                    disconnectButton.addClass('disabled');
                  }
                }

  opera.extension.onmessage = function(event) // Initialisation after connect with background.js
                              {
                                  source = event.source; 
                                  update( event.data.status, event.data.host, event.data.port );
                              }
   
  connectButton.on("click",
                  function(e)
                  { 
                    e.preventDefault(); 
                    if ($(e.target).hasClass("disabled")) { return; }

                    source.postMessage( {
                                            'action': 'connect'
                                          , 'host': hostField.val()
                                          , 'port': portField.val()
                                        } );

                    return window.close(); // Popup of Opera's extension not close in development mode. Use oex archive
                  });
   
  disconnectButton.on("click",
                      function(e)
                      { 
                        e.preventDefault();
                        if ($(e.target).hasClass("disabled")) { return; }

                        source.postMessage( {
                                              'action': 'disconnect'
                                            } );

                        return window.close(); // Popup of Opera's extension not close in development mode. Use oex archive
                      });
});