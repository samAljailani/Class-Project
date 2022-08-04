from app import app, userCollection
from app.utilities import IDgenerator, getUser, getFriend
from app.forms import LoginForm, RegisterForm
from flask import render_template
from flask import request, redirect, url_for, make_response
from flask import session
from werkzeug.security import generate_password_hash, check_password_hash
import json
import re
# link = {name, route}
links = [
            {'title':'Home', 'route':'./home'},
            {'title':'Profile', 'route':'./profile'},
            {'title':'Games', 'route':'./games'},
            {'title':'Logout', 'route':'./logout'}
        ]
@app.route("/")
@app.route("/home")
def get_index():
    if 'username' not in session:
        return redirect(url_for('get_login'))
    user = getUser(session['username'])
    return render_template('home.html', title="Home", links = links, username=session["username"], user=user)

@app.route("/profile", methods=["GET"])
def get_profile():
    if "username" in session:
        user = getUser(session['username'])
    else:
        return redirect(url_for('get_login'))
    return render_template('profile.html', username=session["username"], user= user, title="Profile", links = links)
@app.route("/profile", methods=["POST"])
def post_profile():
    if'username' in session:
        bio = request.form.get("bio", None)
        if bio != None and bio.strip() != '':
            userCollection.update_one({"username":session["username"]}, {"$set" : {"bio":bio} } )
        return redirect(url_for("get_profile"))
    else:
        return redirect(url_for("get_login"))
@app.route("/games", methods=["GET"])
def get_games():
    if 'username' in session:
        user = getUser(session['username'])
    else:
        return redirect(url_for('get_login'))
    return render_template('game.html', username=session['username'], user=user, title="Games", links = links)

@app.route("/register", methods=['GET', 'POST'])
def get_register():
    if 'username' in session:
        return redirect(url_for('get_index'))
    form = RegisterForm()
    if form.validate_on_submit():
        return post_register()
    return render_template('register.html', form=form)

def post_register():
    username = request.form.get("username", None)
    if username == None:
        return redirect(url_for('get_register'))
    for c in username.lower():
        if not(c.isalpha() or c.isdigit() or (c in '.-_')):
            print("illegal character in username")
            return redirect(url_for('get_register'))
    password = request.form.get("password", None)
    if password == None:
        return redirect(url_for('get_register'))
    if len(password) < 8:
        print("password not long enough")
        return redirect(url_for('get_register'))
    repeated = request.form.get("repeated", None)
    if repeated == None:
        return redirect(url_for('get_register'))
    if repeated != password:
        print("repeated password does not match password")
        return redirect(url_for('get_register'))
    # we have a legitimate registration, it seems

    # TODO: Do we have a user with this name already?
    try:
        x = userCollection.find_one({'username':username})
        if x == None:
            # TODO: store the user credentials
            newID = False
            while not newID:
                ID = IDgenerator()
                if userCollection.find_one({'_id':ID}) == None:
                    newID = True

            creds = {
                "_id":ID,
                "username":username.strip(),
                "password":generate_password_hash(password),
                "bio":"",
                "imageLink":'default/mario.png',
                "bannerLink":'default/banner.jpg',
                "highScores":{"cardGame":0},
                "friendsList":[],
                "requests":[],
                "pendingRequests":[]
            }
            userCollection.insert_one(creds)
        else:
            #TODO: return error
            #user already exists
            return redirect(url_for('get_register'))
    except Exception as e:

        return redirect(url_for("get_register"))

    # return the logged-in user to a session
    session['username'] = username
    return redirect(url_for('get_index'))

@app.route("/login", methods=['GET', 'POST'])
def get_login():
    if 'username' in session:
        return redirect(url_for('get_index'))
    form = LoginForm()
    if form.validate_on_submit():
        return post_login()
    return render_template('login.html', form=form)

#called inside get_login()
def post_login():
    username = request.form.get("username", None)
    if username == None:
        return redirect(url_for('get_login'))
    creds = userCollection.find_one({'username': username})
    if creds == None:
        #TODO: generate error user not found
        return redirect(url_for('get_login'))

    password = request.form.get("password", None)
    if not check_password_hash(creds['password'], password):
        print(f"Error - bad password.")
        return redirect(url_for('get_login'))
    session['username'] = username.strip()
    return redirect(url_for('get_index'))

@app.route("/logout", methods=['GET'])
def get_logout():
    session.pop('username',None)
    return redirect(url_for('get_login'))

#REST APIs
@app.route("/api/profile/bio", methods=["POST"])
def changeBio():
    bio = request.json
    bio = bio.strip()

    user = userCollection.update_one({"username":session["username"].strip()}, {"$set":{"bio":bio}})
    return json.dumps({'success': True})

@app.route("/api/profile/suggestions", methods=["POST"])
def suggestions():
    suggestions = []
    user = request.json
    user = user.strip()
    if(user ==''):
        return json.dumps({'success': True, 'status':'200', 'suggestions':suggestions})
    else:
        # not supported by mongita -- userCollection.find_one({"username":{"$regex": "^"+ user}})
        allUsers = list(userCollection.find())
        i = 0
        for x in allUsers:
            if i >= 5:
                break
            if(re.search("^"+ user, x["username"])):
                i = i + 1
                suggestions.append(x["username"])
        return json.dumps({'success': True, 'status':'200', 'suggestions':suggestions})
    #suggestions = [x for x in allUsers if re.search('^'+ user, x)]
    #print(suggestions)
@app.route('/api/profile/friendProfile', methods=["POST"])
def getFriendInfo():
    friend = request.json
    temp = 0
    if(friend != None):
        friend = friend.strip()
        temp = 1
        if friend != '':
            temp = 2
            user = getUser(session['username'])

            if friend in user['friendsList']:
                temp = 3
                friendInfo = getFriend(friend)
                if friendInfo != None:
                    return json.dumps({'success': True, 'status':'200', 'friendProfile':friendInfo})

    return json.dumps({'success': False, 'status':'400', 'temp':temp})

@app.route('/api/profile/sendFriendRequest', methods=["POST"])
def sendFriendRequest():
    friend = request.json
    if friend != None:
        friend = friend.strip()
        if friend != '' and friend != session["username"]:
            user = getUser(session['username'])

            existingFriend = getFriend(friend)

            if friend not in user['friendsList'] and existingFriend != None:
                userCollection.update_one({'username':friend}, {'$push':{'requests':session['username']}})
                userCollection.update_one({'username':session['username']}, {'$push':{'pendingRequests':friend}})
                return json.dumps({'success': True, 'status':'200'})
    return json.dumps({'success': False, 'status':'400'})
@app.route('/api/profile/confirmRequest', methods=['POST'])
def confirmRequest():
    friend = request.json
    if friend != None:
        friend = friend.strip()
        if friend != '' and friend != session["username"]:
            user = getUser(session['username'])
            dbFriend = getFriend(friend)
            if friend not in user['friendsList'] and dbFriend != None:
                dbFriend['pendingRequests'].remove(session['username'])
                userCollection.update_one({'username':friend}, {'$set':{'pendingRequests':dbFriend['pendingRequests']}})
                user['requests'].remove(friend)
                userCollection.update_one({'username':session['username']}, {'$set':{'requests':user['requests']}})
                userCollection.update_one({'username':session['username']}, {'$push':{'friendsList':friend}})
                userCollection.update_one({'username':friend}, {'$push':{'friendsList':session['username']}})
                return json.dumps({'success':True, 'status':'200'})
    return json.dumps({'success':False, 'status':'400'})
@app.route('/api/profile/rejectRequest', methods=["POST"])
def rejectRequest():
    friend = request.json
    if friend != None:
        friend = friend.strip()
        if friend != '' and friend != session["username"]:
            user = getUser(session['username'])
            dbFriend = getFriend(friend)
            if dbFriend != None:
                print("|"+ friend+ "|")
                print(dbFriend['pendingRequests'])
                print('|'+session['username']+'|')
                dbFriend['pendingRequests'].remove(session['username'])
                userCollection.update_one({'username':friend}, {'$set':{'pendingRequests':dbFriend['pendingRequests']}})

                user['requests'].remove(friend)
                userCollection.update_one({'username':session['username']}, {'$set':{'requests':dbFriend['requests']}})

                return json.dumps({'success':True, 'status':'200'})
    return json.dumps({'success':False, 'status':'400'})
@app.route('/api/profile/deleteFriend', methods=["POST"])
def deleteFriend():
    friend=request.json
    if friend != None:
        friend = friend.strip()
        if friend != '' and friend != session["username"]:
            dbFriend = getFriend(friend)
            if dbFriend != None:
                dbFriend['friendsList'].remove(session['username'])
                userCollection.update_one({'username':friend}, {'$set': {'friendsList':dbFriend['friendsList']}})

                user = getUser(session['username'])
                user['friendsList'].remove(friend)
                userCollection.update_one({'username':session['username']}, {'$set': {'friendsList':user['friendsList']}})

                return json.dumps({'success':False, 'status':'200'})
    return json.dumps({'success':False, 'status':'200'})
@app.route('/api/profile/deletePendingRequest', methods=["POST"])
def deleteRequest():
    friend=request.json
    if friend != None:
        friend = friend.strip()
        if friend != '' and friend != session["username"]:
            dbFriend = getFriend(friend)
            if dbFriend != None:
                user = getUser(session['username'])
                user['pendingRequests'].remove(friend)
                userCollection.update_one({'username':session['username']}, {'$set': {'pendingRequests':user['pendingRequests']}})
                dbFriend['requests'].remove(session['username'])
                userCollection.update_one({'username':friend}, {'$set': {'requests':dbFriend['requests']}})
                return json.dumps({'success':False, 'status':'200'})
    return json.dumps({'success':False, 'status':'200'})
###################################################
####Game APIS######################################

@app.route('/api/game/highScore', methods=['POST'])
def UpdateCardGameHighScore():
    currentScore = int(request.json)
    print(type(currentScore), ' ', currentScore)
    if currentScore != None:
        user = getUser(session['username'])
        if currentScore > user['highScores']['cardGame']:
            user['highScores']['cardGame'] = currentScore
            userCollection.update_one({'username':user['username']}, {'$set':{'highScores':user['highScores']}})
    return json.dumps({'success':True, 'status':'200'})
