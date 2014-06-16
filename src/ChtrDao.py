from DataSource import DataSource
from Singleton import singleton

@singleton
class ChtrDao(object):
  
  def __init__(self):
    self.dao = DataSource.Instance()
    self.LOC_TABLE = 'location'
    self.WS_TABLE = 'websocket'
    self.dao.makeTables([self.LOC_TABLE,self.WS_TABLE])

  def insertLocation(self,uid,loc):
    self.dao.put(uid,loc,self.LOC_TABLE)

  def getAllLocations(self):
    return self.dao.getAll(self.LOC_TABLE)
    
  def deleteLocation(self, uid):
    self.dao.delete(uid,self.LOC_TABLE)

  def insertWebsocket(self, peer_address, ws):
    self.dao.put(peer_address,ws,self.WS_TABLE)

  def getWebsocket(self,peer_address):
    return self.dao.get(peer_address,self.WS_TABLE)

  def deleteWebsocket(self, peer_address):
    self.dao.delete(peer_address,self.WS_TABLE)

  def getAllWebsockets(self):
    return self.dao.getAll(self.WS_TABLE)
