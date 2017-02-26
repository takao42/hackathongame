from flask import Flask,render_template, request,json
from random import randint
import math

class Player:
	""" 
	player class 
	"""

	def __init__(self, name, ID, x, y, at, ag):
		""" constructor """

		self.name = name
		self.ID = ID
		self.x = x
		self.y = y
		self.at = at;
		self.ag = ag;

	def getName(self):
		return self.name

	def getID(self):
		return self.ID

	def getX(self):
		return self.x

	def getY(self):
		return self.y
		
	def getAT(self):
		return self.at
		
	def getAG(self):
		return self.ag

	def move(self, xMove, yMove, at):
		self.x += xMove
		self.y += yMove
		self.at += at

	def movegun(self, ag):
		self.ag = ag
	
	def setPos(self, x, y, at, ag):
		self.x = x
		self.y = y	
		self.at = at
		self.ag = ag
		
	def getInfo(self):
		""" 
		return player info as a dictionary 
		"""

		info = {'name':self.name, 'ID':self.ID, 'x':self.x, 'y':self.y, 'at':self.at, 'ag':self.ag}
		return info

class GameManager:
	""" Manages game state """

	def __init__(self):
		""" contructor """

		# dictionary of players
		self.playerList = []
		self.okID = 0
		self.velocity = 2

	def addNewPlayer(self, name):
		""" 
		add new player to the list
		"""

		x = randint(0,500)
		y = randint(0,500)
		at = 90
		ag = 90
		newPlayer = Player(name, self.okID, x, y, at, ag)
		self.playerList.append(newPlayer)
		self.okID += 1

		return newPlayer.getInfo()

	def updatePlayerPos(self, ID, x, y, at, ag):
		""" 
		directly update the position of the player 
		with the given ID
		"""

		for idx in range(len(self.playerList)):
			if self.playerList[idx].getID() == ID:
				self.playerList[idx].set(x, y, at, ag)

	def movePlayer(self, ID, xMouse, yMouse, angleT, upDown):
		""" 
		move the player with the given ID 
		"""
		xMove = 0
		yMove = 0
		
		for idx in range(len(self.playerList)):
			if self.playerList[idx].getID() == ID:
				"""
				move tank
				"""
				if upDown == 1:
					xMove = math.cos(math.radians(self.playerList[idx].at + angleT));
					yMove = math.sin(math.radians(self.playerList[idx].at + angleT));
				if upDown == -1:
					xMove = -math.cos(math.radians(self.playerList[idx].at + angleT));
					yMove = -math.sin(math.radians(self.playerList[idx].at + angleT));				
							
				futureX = self.playerList[idx].getX() + xMove*self.velocity
				futureY = self.playerList[idx].getY() + yMove*self.velocity
				
				xIsInRange = futureX > 0 and futureX < 500
				yIsInRange = futureY > 0 and futureY < 500
				if(xIsInRange and yIsInRange):
					# edge case
					self.playerList[idx].move(xMove*self.velocity, yMove*self.velocity, angleT)

				"""
				move gun turret
				"""
				dx = xMouse - self.playerList[idx].x;
				dy = yMouse - self.playerList[idx].y;			
				self.playerList[idx].movegun(math.degrees((math.atan2(dy,dx))%(2*math.pi)));
   
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

	def getAllAsDict(self):
		""" 
		return the list of all players
		in json format
		playerDict = {PlayerName:{ID, x, y}}
		"""

		playerDict = {}
		renderID = 0
		for player in self.playerList:
			info = player.getInfo()
			playerDict['renderID{}'.format(renderID)] = {'name':info['name'], 'ID': player.ID, 'x':info['x'], 'y':info['y'], 'at':info['at'], 'ag':info['ag']}
			renderID += 1
		playerDict['count'] = renderID 
		return playerDict

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

# display only errors of server
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

# object of game manaber
manager = GameManager()

# game start page
@app.route('/')
def game():
	return render_template('game.html')

# cgi script to process post data
@app.route('/addNewPlayer', methods=['POST'])
def addNewPlayer():
	print("join request from new player")
	
	newPlayer = request.get_json()
	info = manager.addNewPlayer(newPlayer['name'])
	if info is not None:
		print("{} successfully joined".format(newPlayer['name']))
	else:
		print("new player couldn't be added")

	return json.dumps(info)

# cgi script to process post data
@app.route('/gameState', methods=['POST'])
def gameState():
	#print("new player position ")
	#player = request.get_json(force=True)
	#print(player)
	#player = request.form['player']
	playerData = request.get_json()
	#print('new move {}'.format(playerData))
	manager.movePlayer(playerData['ID'], playerData['xMouse'], playerData['yMouse'], playerData['angleT'], playerData['upDown'])

	#print(manager.getAllAsDict())
	return json.dumps(manager.getAllAsDict())

if __name__=="__main__":
	app.run(host='0.0.0.0')
	
