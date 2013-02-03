$(document).ready(function() {
  var source;
  var self = this;

  var hostField = $('form#socketform #host');
  var portField = $('form#socketform #port');
  var connectButton = $('form#socketform #connect');
  var disconnectButton = $('form#socketform #disconnect');

  var update = function( status, host, port )
                {
                  if ( status == true )
                  {
                    connectButton.addClass('disabled');
                    disconnectButton.removeClass('disabled');
                  }
                  else
                  {
                    connectButton.removeClass('disabled');
                    disconnectButton.addClass('disabled');
                  }

                  hostField.attr( 'placeholder', host );
                  portField.attr( 'placeholder', port );
                }

  opera.extension.onmessage = function(event)
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

                    return window.close();
                  });
   
  disconnectButton.on("click",
                      function(e)
                      { 
                        e.preventDefault();
                        if ($(e.target).hasClass("disabled")) { return; }

                        source.postMessage( {
                                              'action': 'disconnect'
                                            } );

                        return window.close();
                      });
});