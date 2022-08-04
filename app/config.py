import os
import pymongo
dbclient = pymongo.MongoClient("mongodb://localhost/")
mydb = dbclient["flaskDatabase"]
class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or '3%.DSz77<>??!~;alaRmQ}{skdfknAS@#%D'