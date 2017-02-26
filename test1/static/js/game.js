// Global object to store our game parameters
var BallWorld = {
    velocity: 8
};
 
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

    this.ball = game.add.sprite(100, 100, 'ball');
    this.ball.anchor.set(0.5, 0.5);

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
            this.ball.x = response.x;
            this.ball.y = response.y;
            this.playerID = response.ID;
            
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

    // request adding new player to the game server
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
            console.log(response);
            console.log(response.renderID0.x);
            this.ball.x = response.renderID0.x;
            this.ball.x = response['renderID0'].x;
            this.ball.y = response.renderID0.y;
        }
    });

    // render all players


}
