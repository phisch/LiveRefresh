$(document).ready ->
	background = chrome.extension.getBackgroundPage()
	hostField = $('form#socketform #host')
	portField = $('form#socketform #port')
	connectButton = $('form#socketform #connect')
	disconnectButton = $('form#socketform #disconnect')

	$('#connect').on "click", (e) ->
		e.preventDefault()
		return if $(e.target).hasClass("disabled")
		background.connect hostField.val(), portField.val()
		window.close()

	$('#disconnect').on "click", (e) ->
		e.preventDefault()
		return if $(e.target).hasClass("disabled")
		background.disconnect()
		window.close()


	chrome.extension.sendMessage {command: "getInformation"}, (response) ->
		hostField.val response.host
		portField.val response.port
		connectButton.addClass 'disabled'
		disconnectButton.removeClass 'disabled'