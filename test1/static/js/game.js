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

    var playerX = 0;
    var playerY = 0;
    var playerID = 0;

    // request adding new player to the game server
    $.ajax({
        url: '/addNewPlayer', 
        type: 'POST', 
        dataType: 'json',
        async: false, 
        data: JSON.stringify({Player:"ShittyPlayer"}),
        contentType: "application/json; charset=utf-8",

        success: function(response) {
            //  get your element to update and inject some content
            console.log(response);
            //playerInfo = JSON.parse(response);
            //console.log(playerInfo);
            // Add the ball to the middle of the game area
            //this.ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
            
            //console.log(response.x)
            playerX = response.x;
            playerY = response.y;
            playerID = response.ID;
            
        }
    });

    this.ball.x = playerX;
    this.ball.y = playerY;
    this.playerID = playerID;


    // request adding new player to the game server
    $.ajax({
        url: '/gameState', 
        type: 'POST', 
        dataType: 'json',
        async: false, 
        data: JSON.stringify({ID:this.playerID, x:this.ball.x, y:this.ball.y}),
        contentType: "application/json; charset=utf-8",

        success: function(response) {
            //  get your element to update and inject some content
            console.log(response);
        }
    });
    

}
 
// Called once every frame, ideally 60 times per second
function update() {

    // Poll the arrow keys to move the ball
    if (this.keys.left.isDown) {
        this.ball.x -= BallWorld.velocity;
    }
    if (this.keys.right.isDown) {
        this.ball.x += BallWorld.velocity;
    }
    if (this.keys.up.isDown) {
        this.ball.y -= BallWorld.velocity;
    }
    if (this.keys.down.isDown) {
        this.ball.y += BallWorld.velocity;
    }
 
    // Prevent ball from escaping outside the stage's boundaries
    var halfWidth = this.ball.width / 2;
    var halfHeight = this.ball.height / 2;
    if ((this.ball.x - halfWidth) < 0) {
        this.ball.x = halfWidth;
    }
    if ((this.ball.x + halfWidth) > game.width) {
        this.ball.x = game.width - halfWidth;
    }
    if ((this.ball.y - halfHeight) < 0) {
        this.ball.y = halfHeight;
    }
    if ((this.ball.y + halfHeight) > game.height) {
        this.ball.y = game.height - halfHeight;
    }

 
    


    
}
