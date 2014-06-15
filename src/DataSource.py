import pickle
from Singleton import singleton
@singleton
class WsDataSource(object):
  def __init__(self):
    self.storage = dict()
    print 'Started datasource'

  def delete(self,id):
    del self.storage[id]

  def put(self,id,obj):
    if (len(self.storage) > 1000):
      self.storage = dict()
    self.storage[id] = obj

  def get(self,id):
    if id in self.storage:
      return self.storage[id]

  def getAll(self):
    return self.storage.values()

  def save(self):
    with open("websockets.pickle", "wb") as f:
      pickle.dump(self.storage, f)

@singleton
class LocDataSource(object):
  def __init__(self):
    self.storage = dict()
    print 'Started datasource'

  def delete(self,id):
    del self.storage[id]

  def put(self,id,obj):
    if (len(self.storage) > 1000):
      self.storage = dict()
    self.storage[id] = obj

  def get(self,id):
    if id in self.storage:
      return self.storage[id]

  def getAll(self):
    return self.storage.values()

  def save(self):
    with open("websockets.pickle", "wb") as f:
      pickle.dump(self.storage, f)