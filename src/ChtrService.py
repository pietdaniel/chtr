from ChtrDao import ChtrDao
import models.RequestTypes
import json

class ChtrService(object):
  def __init__(self):
    self.dao = ChtrDao.Instance()
    self.count = 0

  def dispatch(self, message, peer_address):
    print 'dispatch ' + str(message) + ' ' + str(peer_address)

    try:
      msg = json.loads(message)
      if ('OPEN' in msg):
        self.dao.getWebsocket(peer_address).send('{"UID":"'+str(peer_address)+'", "OPEN":"true"}')
      elif ('MSG' in msg):
        flagged = []
        for pa in self.dao.getAllWebsockets(peer_address):
          try:
            self.dao.getWebsocket(pa).send(message)
          except AttributeError as ae:
            flagged.append(pa)
            print ae
        for pa in flagged:
          self.dao.deleteWebsocket(pa)

    except ValueError as e:
      print e

  def getObj(self, funcType, jsonBlob):
    return funcType().deserialize(jsonBlob)

  def toJSON(self, obj):
    return json.dumps(obj)

  def putWS(self, peer_address, ws):
    print 'putWS'
    self.dao.insertWebsocket(peer_address, ws)
    print self.dao.getAllWebsockets(peer_address)
    

  def getWS(self, peer_address):
    return self.dao.getWebsocket(peer_address)


