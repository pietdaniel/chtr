from models.User import User 
from models.Room import Room 
from DataSource import DataSource
from Singleton import singleton

@singleton
class ChtrDao(object):
  def __init__(self):
    print 'New Dao'
    self.wsds = DataSource.Instance()

  def insertWebsocket(self, peer_address, ws):
    self.wsds.put(peer_address,ws)

  def getWebsocket(self,peer_address):
    return self.wsds.get(peer_address)

  def deleteWebsocket(self, peer_address):
    self.wsds.delete(peer_address)

  def getAllWebsockets(self, peer_address):
    return self.wsds.storage
