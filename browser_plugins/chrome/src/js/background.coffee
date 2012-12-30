#localhost:1025
#192.169.0.2:1025

class tabFactory
	constructor: () ->
		@tabs = []
		return

	# adds a new tab instance to the tabs array
	addTab: (tabId) ->
		tab = new tabHandler(tabId, @)
		@tabs[tabId] = tab
		return tab

	# sets a tab to undefinde after it called the disconnect method of it
	removeTab: (tabId) ->
		tab = @getTab tabId
		if tab isnt false
			tab.disconnect()
			@tabs[tabId] = undefined
		return

	# returns a tab if available, else false
	getTab: (tabId) ->
		if @tabs[tabId] is undefined
			return false
		else
			return @tabs[tabId]

	# console.logs all tabs
	logTabs: ->
		console.log @tabs
		return



class tabHandler
	constructor: (@tabId, @factory, @isClosed = false) ->

	connect: (host, port) ->
		@host = if host is null or host is "" then "localhost" else host
		@port = if port is null or port is "" or port > 65535 or port < 1 then 1025 else port

		@socket = new WebSocket("ws://#{@host}:#{@port}")
		@socket.tabHandler = @

		@socket.onopen = (data) ->
			@tabHandler.setTabIcon()
			return
		
		@socket.onclose = (data) ->
			if not @tabHandler.getIsClosed() then @tabHandler.setTabIcon()
			@tabHandler.factory.removeTab @tabHandler.tabId
			return

		@socket.onmessage = (data) ->
			if data.data is "refresh"
				chrome.tabs.update @tabHandler.tabId, {selected: true}
				chrome.tabs.reload @tabHandler.tabId
			return

		@socket.onerror = (data) ->
			return

	disconnect: () ->
		@socket.close()

	refreshTab: () ->
 
	setTabIcon: () ->
		icon = "icon.png"
		# 0: connection has not yet been established
		# 1: connection is established and communication is possible
		# 2: connection is going through the closing handshake
		# 3: connection has been closed or could not be opened
		icon = "icon_active.png" if @socket.readyState is 1
		chrome.tabs.get @tabId, (tab) ->
			if tab then chrome.browserAction.setIcon {path:"img/#{icon}", tabId: tab.id}

	getHost:     -> return @host
	getPort:     -> return @port
	getTab:      -> return @tab
	getSocket:   -> return @socket
	getIsClosed: -> return @isClosed

	setIsClosed: (closed) ->
		@isClosed = closed

	getInformation: () ->
		return {host: @host, port: @port}


class socketStates
	constructor: ->
		@NONE = 0
		@CONNECTING = 1
		@CONNECTED = 2
		@ERROR = 3


factory = new tabFactory()

connect = (host, port) ->
	chrome.tabs.query {active: yes, currentWindow: yes}, (tabs) ->
		tab = factory.addTab tabs[0].id
		tab.connect(host, port)
    
disconnect = ->
	chrome.tabs.query {active: yes, currentWindow: yes}, (tabs) ->
		tab = factory.getTab tabs[0].id
		if tab isnt false then factory.removeTab tabs[0].id

chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) ->
	tab = factory.getTab tabId
	if tab isnt false then tab.setTabIcon()

chrome.tabs.onRemoved.addListener (tabId, removeInfo) ->
	factory.removeTab(tabId)

chrome.extension.onMessage.addListener (request, sender, sendResponse) ->
	chrome.tabs.query {active: yes, currentWindow: yes}, (tabs) ->
		tab = factory.getTab tabs[0].id
		if request.command is "getInformation"
			if tab isnt false
				sendResponse tab.getInformation()
	return true
