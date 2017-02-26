from flask import Flask,render_template, request,json
from random import randint

class Player:
	""" player class """
	def __init__(self, name, ID, x, y):
		self.name = name
		self.ID = ID
		self.x = x
		self.y = y

	def getInfo(self):
		info = {'Player':self.name, 'ID':self.ID, 'x':self.x, 'y':self.y}
		return info

class GameManager:
	""" Manages game state """

	def __init__(self):
		""" contructor """

		# dictionary of players
		self.playerList = []
		self.okID = 0

	def addNewPlayer(self, name):
		""" 
		add new player to the list
		"""

		x = randint(0,500)
		y = randint(0,500)
		newPlayer = Player(name, self.okID, x, y)
		self.playerList.append(newPlayer)
		self.okID += 1

		return newPlayer.getInfo()

	def delPlayer(self, ID):
		"""
		delete the player with the given ID
		"""

		for player in self.playerList:
			if player.ID == ID:
				self.playerList.remove(player)
	
	def getAll(self):
		""" 
		return the list of all players
		"""
		return self.playerList

	def getAllInJson(self):
		""" 
		return the list of all players
		in json format
		playerDict = {PlayerName:{ID, x, y}}
		"""
		playerDict = {}
		for player in self.playerList:
			info = player.getInfo()
			playerDict = {info['Player']:{'ID':info['ID'], 'x':info['x'], 'y':info['y']}}
		return self.playerDict

	def getNum(self):
		""" 
		return the list of all players
		"""
		return len(self.playerList)

	def getOkID(self):
		"""
		return available ID
		"""
		return self.okID


app = Flask(__name__)
manager = GameManager()

# game start page
@app.route('/')
def game():
	return render_template('index.html')

# game signup page
@app.route('/signUp')
def signUp():
	return render_template('signUp.html')

# cgi script to process post data
@app.route('/addNewPlayer', methods=['POST'])
def addNewPlayer():
	print("New Player Joined")
	
	newPlayer = request.get_json()
	info = manager.addNewPlayer(newPlayer['Player'])
	if info is not None:
		print("new player successfully added")
	else:
		print("new player couldn't be added")

	return json.dumps(info)

# cgi script to process post data
@app.route('/gameState', methods=['POST'])
def gameState():
	print("post data recieved")
	#player = request.get_json(force=True)
	#print(player)
	#player = request.form['player']
	playerData = request.get_json()
	print(playerData)

	return json.dumps(manager = getAllInJson)

if __name__=="__main__":
	app.run(host='0.0.0.0')
	