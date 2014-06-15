from ChtrDao import ChtrDao
import json

class ChtrService(object):
  def __init__(self):
    self.dao = ChtrDao.Instance()
    self.count = 0

  def buildAllLocMessage(self):
    print 'buildAllLocMessage'
    out = { "LOCS": str([self.dao.getAllLocations()]) }
    return json.dumps(out)

  def dispatch(self, message, peer_uid):
    print 'dispatch ' + str(message) + ' ' + str(peer_uid)

    try:
      msg = json.loads(message)
      if ('OPEN' in msg):
        self.dao.getWebsocket(peer_uid).send('{"UID":"'+str(peer_uid)+'", "OPEN":"true"}')
      elif ('MSG' in msg):
        flagged = []
        for uid in self.dao.getAllWebsockets(peer_uid):
          try:
            self.dao.getWebsocket(uid).send(message)
          except AttributeError as ae:
            print 'invalid websocket with uid ' + str(uid)
            flagged.append(uid)
            print ae
        for uid in flagged:
          self.dao.deleteWebsocket(uid)
          self.dao.deleteLocation(uid)
      elif ('LOC' in msg):
        self.dao.getWebsocket(peer_uid).send(self.buildAllLocMessage())
        self.dao.insertLocation(msg['UID'], msg['LOC'])
      else:
        print 'fell through dispatch on message ' + str(message)
    except ValueError as e:
      print e

 

  def putWS(self, peer_uid, ws):
    print 'putWS'
    self.dao.insertWebsocket(peer_uid, ws)
    print self.dao.getAllWebsockets(peer_uid)
    
  def getWS(self, peer_uid):
    return self.dao.getWebsocket(peer_uid)