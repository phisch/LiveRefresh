import sublime, sublime_plugin, sys, os, platform

# Hack so Python is able to load either 32bit or 64bit "select.pyd"
if os.name == "nt" or os.name == "ce":
    __path__ = os.path.dirname(os.path.normpath(os.path.abspath(__file__)))
    sys.path.insert(0, os.path.join(__path__, platform.architecture()[0]))

from threading import Thread
from tornado.websocket import WebSocketHandler 
from tornado.httpserver import HTTPServer 
from tornado.ioloop import IOLoop 
from tornado.web import Application

PORT = 1025 
websockets = []

class WebSocket(WebSocketHandler): 
    def open(self):
        if self not in websockets:
            websockets.append(self)

    def on_close(self):
        offset = 0
        for websocket in websockets:
            if websocket == self:
                break
            offset += 1
        websockets.pop(offset)

class InstantView():
    def __init__(self):
        t = Thread(target=self.thread, args=()).start()

    def thread(self):
        self.app = Application([("/", WebSocket)]) 
        http_server = HTTPServer(self.app).listen(PORT)
        IOLoop.instance().start() 

    def sendToClients(self, msg):
        for websocket in websockets:
            websocket.write_message(msg)

app = InstantView()

class OnSaveRefresh( sublime_plugin.EventListener ):
    def on_post_save( self, view ):
        app.sendToClients("refresh")