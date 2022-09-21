from flask import Flask
from app.config import Config
import pymongo                                 
from mongita import MongitaClientDisk
app = Flask(__name__)
app.config.from_object(Config)
dbclient = MongitaClientDisk(host="./.mongita")
db = dbclient["flaskDatabase"]
userCollection = db["users"]
friendsCollection = db["userFriends"]
from app import routes
'db design for messages'
'''
class User():
    _id ="user"
    password ="password"

class userFriends():
    _id ="username"
    username = ""
    friendList      = [ 'friend1', 'friend2', 'friend3', 'friend4']
    pendingRequests = ['username1', 'username2', 'usernmame3']
    requestRecieved = ['username1', 'username2', 'etc']
class userMessages:
    _id ="username"
    messages = {       
        'friend.username':[
            {'sender'  :'me/friend',
             'timeSent':'time.time()',
             'content' :'info'
            }
        ]
    }
'''