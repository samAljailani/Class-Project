import string
import random
from app import userCollection
def IDgenerator():
    S = 10 # number of digits for the ID
    ID = ''.join(random.choices(string.ascii_uppercase + string.digits, k = S))
    return ID

def getUser(username):
    ##mongita occasionally return None even though the data exists this is to ensure the data is retrieved
    user = None
    username = username.strip()
    while user == None:
        user = userCollection.find_one({'username':username})
    return user
def getFriend(username):
    friend = None
    username = username.strip()
    for i in range(0,5):
        if friend != None:
            break
        friend = userCollection.find_one({'username':username})
    return friend