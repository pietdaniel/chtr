from ChtrDao import ChtrDao
import json

class ChtrService(object):
  def __init__(self):
    self.dao = ChtrDao.Instance()
    self.count = 0

  def buildAllLocMessage(self, locs):
    out = { "LOCS": locs }
    return json.dumps(out)

  def dispatch(self, message, peer_uid):
    print 'dispatch ' + str(message) + ' ' + str(peer_uid)

    try:
      msg = json.loads(message)
      if ('OPEN' in msg):
        self.dao.getWebsocket(peer_uid).send('{"UID":"'+str(peer_uid)+'", "OPEN":"true"}')
      elif ('MSG' in msg):
        self.broadcast(message)
      elif ('LOC' in msg):
        locs = self.dao.getAllLocations()
        if (len(locs) > 0):
          self.broadcast(self.buildAllLocMessage(locs))
        self.dao.insertLocation(msg['UID'], msg['LOC'])
      else:
        print 'fell through dispatch on message ' + str(message)
    except ValueError as e:
      print 'caught value error in dispatch '
      print e

  def broadcast(self, message):
    flagged = []
    for uid in self.dao.getAllWebsockets():
      try:
        self.dao.getWebsocket(uid).send(message)
      except AttributeError as ae:
        print 'invalid websocket with uid ' + str(uid) + ' due to:'
        print ae
        flagged.append(uid)
    for uid in flagged:
      self.dao.deleteWebsocket(uid)
      self.dao.deleteLocation(uid)

  def putWS(self, peer_uid, ws):
    self.dao.insertWebsocket(peer_uid, ws)
    
  def getWS(self, peer_uid):
    return self.dao.getWebsocket(peer_uid)