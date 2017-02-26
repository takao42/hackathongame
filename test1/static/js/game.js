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

    var playername;
    do {
        playername=prompt("Please enter your name");
    }
    while(playername.length < 1);
    
    $.ajax({
        // request adding new player to the game server

        url: '/addNewPlayer', 
        type: 'POST', 
        dataType: 'json',
        context: this,
        async: false, 
        data: JSON.stringify({name:playername}),
        contentType: "application/json; charset=utf-8",

        success: function(response) {
            // get the response(id, x, y) from the server
            // and add it to the local player list

            console.log(response);
            this.playerID = response.ID;

            player = game.add.sprite(response.x, response.y, 'ball');
            player.anchor.set(0.5, 0.5);
            
            this.playerList.push(player)
        }
    });

}
 
// Called once every frame, ideally 60 times per second
function update() {

    var xUnitMove = 0;
    var yUnitMove = 0;

    // Poll the arrow keys to move the player
    if (this.keys.left.isDown) {
        xUnitMove = -1;
    }
    if (this.keys.right.isDown) {
        xUnitMove = 1;
    }
    if (this.keys.up.isDown) {
        yUnitMove = -1;
    }
    if (this.keys.down.isDown) {
        yUnitMove = 1;
    }

    
    $.ajax({
        // send the current position to the server and
        
        url: '/gameState', 
        type: 'POST', 
        dataType: 'json',
        context: this,
        async: false, 
        data: JSON.stringify({ID:this.playerID, xUnitMove:xUnitMove, yUnitMove:yUnitMove}),
        contentType: "application/json; charset=utf-8",

        success: function(response) {
            // get a response (positions of all players) from the server
            // and render the game state

            if (response.count > 0) {
                // render if there is at least one player

                if(this.playerList.length < response.count){
                    // add the new player

                    var renderID = 'renderID' + (response.count-1);
                    //console.log(renderID)
                    newPlayer = game.add.sprite(response[renderID].x, response[renderID].y, 'ball');
                    newPlayer.anchor.set(0.5, 0.5);
                    this.playerList.push(newPlayer)
                }
                for(var i = 0; i < response.count; i++){
                    // render all players

                    var renderID = 'renderID' + i;
                    this.playerList[i].x = response[renderID].x;
                    this.playerList[i].y = response[renderID].y;
                    
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
