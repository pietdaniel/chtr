import pickle
from Singleton import singleton
@singleton
class DataSource(object):
  def __init__(self):
    print 'Started datasource'
    self.storage = dict()

  def makeTables(self, listOfTables):
    for tableKey in listOfTables:
      self.storage[tableKey] = dict()

  def delete(self,id,tableKey):
    self.storage[tableKey][id] = False

  def put(self,id,obj, tableKey):
    print 'get ' + str(id) + ' ' + str(type(id)) + ' ' + tableKey
    if (len(self.storage[tableKey]) > 1000):
      self.storage[tableKey] = dict()
    self.storage[tableKey][id] = obj

  def get(self,id,tableKey):
    print 'get ' + str(id) + ' ' + str(type(id)) + ' ' + tableKey
    if id in self.storage[tableKey]:
      out =  self.storage[tableKey][id]
      if (out):
        return out
    print 'id ' + str(id) + 'not found in ' + str(tableKey)

  def getAll(self,tableKey):
    out = dict()
    for key in self.storage[tableKey]:
      if self.storage[tableKey][key]:
        out[key] = self.storage[tableKey][key]
    return out

  def save(self):
    with open("websockets.pickle", "wb") as f:
      pickle.dump(self.storage, f)