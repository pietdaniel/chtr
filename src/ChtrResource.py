import cherrypy
from ws4py.server.cherrypyserver import WebSocketPlugin, WebSocketTool
from ws4py.websocket import WebSocket
from ChtrService import ChtrService
import json

cherrypy.config.update({'server.socket_port': 9000})
WebSocketPlugin(cherrypy.engine).subscribe()
cherrypy.tools.websocket = WebSocketTool()

class Root(object):
    @cherrypy.expose
    def index(self):
      return 'Please connect with a websocket'
    @cherrypy.expose
    def chtr(self):
      handler = cherrypy.request.ws_handler

class Server(WebSocket):
    def __init__(self, *args, **kwargs):
      WebSocket.__init__(self,*args,**kwargs)
      self.service = ChtrService()
 
    def opened(self):
      print 'opened connection with ' + str(self.peer_address)
      self.service.putWS(self.peer_address, self)

    def received_message(self, message):
      print "received message from peer " + str(self.peer_address) + " with message: " + str(message)
      self.service.dispatch(message.data, self.peer_address)
  
class ChtrResource(object):
  def __init__(self):
    print 'ChtrResource started'
    self.root = Root
    self.server = Server

  def run(self):
    cherrypy.quickstart(self.root(), '/', config={'/chtr': {'tools.websocket.on': True, 'tools.websocket.handler_cls': self.server}})

if __name__ == '__main__':
  chtrResource = ChtrResource()
  chtrResource.run()
  