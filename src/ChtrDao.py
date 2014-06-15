from DataSource import WsDataSource, LocDataSource
from Singleton import singleton

@singleton
class ChtrDao(object):
  def __init__(self):
    print 'New Dao'
    self.wsds = WsDataSource.Instance()
    self.locds = LocDataSource.Instance()

  def insertLocation(self,uid,loc):
    self.locds.put(uid,loc)

  def getAllLocations(self):
    return self.locds.storage
    
  def deleteLocation(self, uid):
    self.locds.delete(uid)

  def insertWebsocket(self, peer_address, ws):
    self.wsds.put(peer_address,ws)

  def getWebsocket(self,peer_address):
    return self.wsds.get(peer_address)

  def deleteWebsocket(self, peer_address):
    self.wsds.delete(peer_address)

  def getAllWebsockets(self, peer_address):
    return self.wsds.storage
