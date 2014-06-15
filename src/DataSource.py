import pickle
from Singleton import singleton
@singleton
class WsDataSource(object):
  def __init__(self):
    self.storage = dict()
    print 'Started datasource'

  def delete(self,id):
    del self.storage[str(id)]

  def put(self,id,obj):
    if (len(self.storage) > 1000):
      self.storage = dict()
    self.storage[str(id)] = obj

  def get(self,id):
    if id in self.storage:
      return self.storage[str(id)]

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
    if (self.storage[str(id)]):
      del self.storage[str(id)]
    else:
      print 'attempting to delete something that doesnt exist  ' + str(id)

  def put(self,id,obj):
    if (len(self.storage) > 1000):
      self.storage = dict()
    self.storage[str(id)] = obj

  def get(self,id):
    if id in self.storage:
      return self.storage[str(id)]

  def getAll(self):
    return self.storage.values()

  def save(self):
    with open("websockets.pickle", "wb") as f:
      pickle.dump(self.storage, f)