
// Create a new Phaser game object with a single state that has 3 functions
var game = new Phaser.Game(500, 500, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
 
// Called first
function preload() {
 
    // Load our image assets
    game.load.image('ball', 'static/img/ball.png');
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

    // local list of all players
    this.playerList = []

    

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
            //  get your element to update and inject some content
            console.log(response);
            //playerInfo = JSON.parse(response);
            //console.log(playerInfo);
            // Add the ball to the middle of the game area
            //this.ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
            
            //console.log(response.x)
            //this.ball.x = response.x;
            //this.ball.y = response.y;
            this.playerID = response.ID;

            player = game.add.sprite(response.x, response.y, 'ball');
            player.anchor.set(0.5, 0.5);
            
            this.playerList.push(player)
        }
    });

}
 
// Called once every frame, ideally 60 times per second
function update() {

    var xMove = 0;
    var yMove = 0;

    // Poll the arrow keys to move the player
    if (this.keys.left.isDown) {
        xMove = -1;
    }
    if (this.keys.right.isDown) {
        xMove = 1;
    }
    if (this.keys.up.isDown) {
        yMove = -1;
    }
    if (this.keys.down.isDown) {
        yMove = 1;
    }

    // send the current position to the server and
    // recieve the positions of all the players
    $.ajax({
        url: '/gameState', 
        type: 'POST', 
        dataType: 'json',
        context: this,
        async: false, 
        data: JSON.stringify({ID:this.playerID, xUnitMove:xMove, yUnitMove:yMove}),
        contentType: "application/json; charset=utf-8",

        success: function(response) {
            //  get your element to update and inject some content
            //console.log(response);
            //console.log(response.renderID0.x);
            //this.ball.x = response.renderID0.x;
            if (response.count > 0) {
                //console.log(response.count);
                //console.log(this.playerList.length);
                if(this.playerList.length < response.count){
                    // add the new player

                    var renderID = 'renderID' + (response.count-1);
                    console.log(renderID)
                    newPlayer = game.add.sprite(response[renderID].x, response[renderID].y, 'ball');
                    newPlayer.anchor.set(0.5, 0.5);
                    this.playerList.push(newPlayer)
                }
                for(var i = 0; i < response.count; i++){
                    var renderID = 'renderID' + i;
                    this.playerList[i].x = response[renderID].x;
                    this.playerList[i].y = response[renderID].y;
                    
                }
                
                
                
            }
            
            
        }
    });

    // render all players


}
