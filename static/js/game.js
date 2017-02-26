
// Create a new Phaser game object with a single state that has 3 functions
var game = new Phaser.Game(500, 500, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
 
// Called first
function preload() {
 
    // Load our image assets
    game.load.image('tank', 'static/img/tank.png');
    game.load.image('tankgun', 'static/img/tankgun.png');
    //game.load.image('ground', 'static/img/ground.png');
}
 
// Called after preload
function create() {
 
    // Center game canvas on page
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    
    // Change background color
    game.stage.backgroundColor = '#87CEEB';
 
    // Add key input to the game
    this.keys = game.input.keyboard.createCursorKeys();
    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

    game.input.onDown.add(shoot, this);

    // local list of all players
    this.playerList = []
	
	//local list of players gun turrets
	this.gunList = []

    // request adding new player to the game server
    $.ajax({
        url: '/addNewPlayer', 
        type: 'POST', 
        dataType: 'json',
        context: this,
        async: false, 
        data: JSON.stringify({name:"ShittyPlayer"}),
        contentType: "application/json; charset=utf-8",

        success: function(response) {

            this.playerID = response.ID;

            player = game.add.sprite(response.x, response.y, 'tank');
            player.anchor.set(0.5, 0.5);
            
            gun = game.add.image(response.x, response.y, 'tankgun');
			gun.anchor.set(0.5, 0.5);
			gun.angle = response.a;
			
            this.playerList.push(player)
            this.gunList.push(gun)
        }
    });

}


function shoot() {

    var xMouse = this.input.mousePointer.x;
    var yMouse = this.input.mousePointer.y;

    $.ajax({
        url: '/shootBullet', 
        type: 'POST', 
        dataType: 'json',
        context: this,
        async: false, 
        data: JSON.stringify({ID:this.playerID, xMouse:xMouse, yMouse:yMouse}),
        contentType: "application/json; charset=utf-8",

        success: function(response) {
            //  get your element to update and inject some content


        }
    });
}
 
// Called once every frame, ideally 60 times per second
function update() {

    var xMouse = this.input.mousePointer.x;
    var yMouse = this.input.mousePointer.y;
    var angtank = 0;
    var upDown = 0;

    

    // Poll the arrow keys to move the player
    if (this.keys.left.isDown || this.leftKey.isDown ) {
		angtank = -5;      			
    }
    if (this.keys.right.isDown || this.rightKey.isDown) {
		angtank = 5;
    }
    if (this.keys.up.isDown || this.upKey.isDown) {
        upDown = 1;
    }
    if (this.keys.down.isDown || this.downKey.isDown) {
        upDown = -1;
    }
  
    // send the current position to the server and
    // recieve the positions of all the players
    $.ajax({
        url: '/gameState', 
        type: 'POST', 
        dataType: 'json',
        context: this,
        async: false, 
        data: JSON.stringify({ID:this.playerID, xMouse:xMouse, yMouse:yMouse, angleT:angtank, upDown:upDown}),
        contentType: "application/json; charset=utf-8",

        success: function(response) {
            //  get all the positions of players and bullets

            if (response.playerCount > 0) {
                // if there is any player

                if(this.playerList.length < response.playerCount){
                    // add the new player

                    var renderID = 'renderID' + (response.playerCount-1);
                    console.log(renderID)
                    newPlayer = game.add.sprite(response[renderID].x, response[renderID].y, 'tank');
                    newPlayer.anchor.set(0.5, 0.5);
                    newPlayer.angle = (response[renderID].at);
                    this.playerList.push(newPlayer)
                    
                    newPlayerGun = game.add.image(response[renderID].x, response[renderID].y, 'tankgun');
                    newPlayerGun.anchor.set(0.5, 0.5);
                    newPlayerGun.angle = (response[renderID].ag);
                    this.gunList.push(newPlayerGun)
                }
                for(var i = 0; i < response.playerCount; i++){
                    // render all players

                    var renderID = 'renderID' + i;
                    this.playerList[i].x = response[renderID].x;
                    this.playerList[i].y = response[renderID].y;
                    this.playerList[i].angle = response[renderID].at;
                    this.gunList[i].x = response[renderID].x;
                    this.gunList[i].y = response[renderID].y;
					this.gunList[i].angle = response[renderID].ag;                   
                }                 
            }
            if (response.bulletCount > 0) {
                // if there is any bullet

                for(var i = 0; i < response.bulletCount; i++){
                    var renderID = 'bulletRenderID' + i;
                    var bullet = new Phaser.Circle(response[renderID].x, response[renderID].y, 5);
                    game.debug.geom(bullet, '#000000');
                }
                
                
            }
            
	    },
        error: function(){
            // exit game if client is disconnected from server

            alert('Disconnected from server! Server might be dead. ');
            game.destroy()
        }
    });




}
