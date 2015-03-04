
var gameStarted = false ;
var min = 0 ;
var max = 3 ;
var LiveScore = '' ;
var BonuScore = '' ;
var bonusItems = [] ;
var scores = [] ;
var allEnemies = [];
var gameEndText = 'Welcome';
var finalScore = "" ;
var changeChar = 'Right key to change character';
var enterToPlay = "Hit enter to play";
var EndTheGame = false ;

/* Sound Class */
var Sound = function(){
    var dir = 'sounds/' ;

    var jumpSound = new Audio(dir + 'kick.wav');
    var hurtSound = new Audio(dir + 'hurt.wav');
    var dieSound = new Audio(dir + 'die.wav');
    var coinSound = new Audio(dir + 'coins.wav');
    var playerDieS = new Audio(dir + 'player-die.wav');
    var overSound = new Audio(dir + 'game-over.wav');

    this.gameOver = function(){
        overSound.play();
    };

    this.playerDie = function(){
        playerDieS.play();
    };

    this.stopAll = function(){
        jumpSound.pause();
        hurtSound.pause();
        dieSound.pause();
    };

    this.coins = function(){
        coinSound.play();
    };

    this.jump = function(){
        jumpSound.play();
    };

    this.hurt = function(){
        hurtSound.play();
    };

    this.die = function(){
        dieSound.play();
    };
};

var sound = new Sound();


// Enemies our player must avoid
var Enemy = function(x,y,z) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x ;
    this.y = y;
    this.z = z; // speed
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var oldX = this.x ;
    var random = dt * 10 + this.z ;
    if(oldX >= 500){
        this.x = 0 ;
    }else{
        this.x = oldX + random;
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(){
    var x = 400;
    var y = 390;
    this.x = x ;
    this.y = y ;

    this.players = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ];

    this.sprite = this.players[0] ;

    this.reset = function(){
        this.x = x ;
        this.y = y ;
        sound.die();
    }
};

Player.prototype.handleInput = function(direction){

    var posX = this.x ;
    var posY = this.y ;
    var move = null ;
    var ySteps = 80 ;
    var xSteps = 100 ;

    if(gameStarted){
        switch (direction){
            case 'up':
                move = posY - ySteps;
                if(move == -10){
                    sound.hurt();
                }else{
                    this.y = move ;
                    sound.jump();
                }
                break;
            case 'down':
                move = posY + ySteps;
                if(move > 390){
                    sound.hurt();
                }else{
                    this.y = move ;
                    sound.jump();
                }
                break;
            case 'left':
                move = posX - xSteps;
                if(move < 0){
                    sound.hurt();
                }else{
                    this.x = move ;
                    sound.jump();
                }
                break;
            case 'right':
                move = posX + xSteps;
                if(move > 400){
                    sound.hurt();
                }else{
                    this.x = move ;
                    sound.jump();
                }
                break;
            default :
                break;
        }
    }

};

Player.prototype.update = function(){

};

Player.prototype.render = function(){
    ///console.log(this.sprite);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    var direction = allowedKeys[e.keyCode];

    player.handleInput(direction);

    /* Handle player change */
    if(!gameStarted && direction == 'right'){
        max++;
        if(max >= 3){
            max = 0 ;
        }
        player.sprite = player.players[max];
    }

    if(direction == 'enter'){
        startGame();
    }

    /* check for points */

});

/* Create bonus class */
var Bonus = function(sprite,x,y,point,key){
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.point = point ;
    this.key = key;
    this.read = false ;
};

Bonus.prototype.render = function(){
    if(this.read == false){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

var Score = function(sprite,x,y){
    this.sprite = sprite;
    this.x = x;
    this.y = y;
};

Score.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var clearScreen = function(){
    gameEndText = '';
    finalScore = '';
    changeChar = '';
    enterToPlay = '';
};

var startGame = function(){

    player.reset();

    clearScreen();

    gameStarted = true ;
    LiveScore = 5 ;
    BonuScore = 0 ;

    scores.push(new Score('images/Heart.png',20,65));
    scores.push(new Score('images/x-mark.png',85,80));
    scores.push(new Score('images/Star.png',216,55));
    scores.push(new Score('images/x-mark.png',288,80));

    allEnemies.push(new Enemy(110,70,3));
    allEnemies.push(new Enemy(180,150,1));
    allEnemies.push(new Enemy(330,230,2));
    allEnemies.push(new Enemy(100,310,4));

    bonusItems.push(new Bonus('images/gem-blue.png',400,230,6));
    bonusItems.push(new Bonus('images/gem-green.png',300,70,6));
    bonusItems.push(new Bonus('images/gem-orange.png',200,310,6));
    bonusItems.push(new Bonus('images/Key.png',100,150,10,10));
    bonusItems.push(new Bonus('images/Rock.png',0,70,3));
};

//startGame();
