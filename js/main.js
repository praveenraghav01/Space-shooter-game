w = innerWidth;
h = innerHeight;
var game = new Phaser.Game(w,h,Phaser.CANVAS,'canvas');

var backg;
var space;
var backgroundv;
var cursors;
var bullets;
var bulletTime = 0;
var fireButton;
var enemies;
var score = 0;
var scoreText;
var winText;
var playButton;
var instruction;
var myInput;
var time=0;
var over;
var again;

var mainState = {
    preload : function(){
        game.load.image('space','assets/space.png');
        game.load.image('back','assets/back.png');
        game.load.image('bullet','assets/bullet.png');
        game.load.image('enemy','assets/enemy.png');
        game.load.spritesheet('button','assets/start.png');
        game.load.image('over','assets/over.png');
        game.load.spritesheet('again','assets/again.png');
    },
    create : function(){
        space = game.add.tileSprite(0,0,w,h,'back');
        backgroundv = 5;

        player = game.add.sprite(game.world.centerX,h-50,'space');
        game.physics.enable(player,Phaser.Physics.ARCADE);
        player.scale.set(0.15);
        player.anchor.setTo(0.5);
        cursors = game.input.keyboard.createCursorKeys();
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        createEnemies();
        scoreText = game.add.text(10,10,'Score : ',{font : '32px Luckiest Guy',fill : '#fff'});
        scoreText.visible = false;
        winText = game.add.text(game.world.centerX,game.world.centerY,'You Win!',{font : '40px Luckiest Guy',fill : '#fff'});
        winText.visible = false;
        instruction = game.add.text(game.world.centerX,game.world.centerY,'Use < or > to Move & SPACEBAR to fire',{font : '32px Luckiest Guy',fill : '#fff'});
        instruction.visible = false;
        instruction.anchor.setTo(0.5);
        button = game.add.button(game.world.centerX,game.world.centerY, 'button', actionOnClick);
        button.anchor.setTo(0.5);
        button.scale.set(0.5);

    },
    update : function(){
        game.physics.arcade.overlap(bullets,enemies,collisionHandler,null,this);
        player.body.velocity.x = 0;
        space.tilePosition.y += backgroundv;

        if(cursors.left.isDown && player.x>50)
        {
            instruction.visible = false;
            player.body.velocity.x = -350;
        }
        if(cursors.right.isDown && player.x<w-50)
        {
            instruction.visible = false;
            player.body.velocity.x = 350;
        }
        if(fireButton.isDown)
        {
            instruction.visible = false;
            fireBullet();
        }
        scoreText.text = 'Score : ' + score;
        if(score == 4000)
        {
            winText.visible = true;
            scoreText.visible = false;
        }
        if(time == 1)
        {
        game.time.events.add(Phaser.Timer.SECOND * 15, gaveOver, this);
        }
    },
    render : function(){
        game.debug.text("Time remains: " + (game.time.events.duration)/1000 + " sec", 10, 250);
    }
}


function fireBullet(){
    if(game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);
        if(bullet)
        {
            bullet.reset(player.x,player.y);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        }
    }
}

function createEnemies(){
    for(var y = 0; y< 4; y++)
    {
        for(var x = 0; x< 10; x++)
        {
            var enemy = enemies.create(x*120,y*50,'enemy');
            enemy.anchor.setTo(0.5);
            enemy.scale.set(0.20);
        }
    }
    enemies.x = 100;
    enemies.y = 50;
    var tween = game.add.tween(enemies).to({x:200},2000,Phaser.Easing.Linear.None,true,0,1000,true);
    tween.onLoop.add(descend,this);
}

function descend(){
    enemies.y += 10;
}

function collisionHandler(bullet,enemy){
    bullet.kill();
    enemy.kill();
    score += 100;
}

function actionOnClick(){
    button.visible = false;
    instruction.visible = true;
    scoreText.visible = true;
    time = 1;
}

function start(){
    game.state.add('mainState',mainState);
    game.state.start('mainState');
}

function gaveOver(){
    over = game.add.sprite(w/2,h/2-100,'over');
    over.anchor.set(0.5);
    over.scale.setTo(0.8);
    time = 0;
    winText.visible = false;
    again = game.add.button(game.world.centerX,game.world.centerY+50, 'again', actionOnClick1);
    again.anchor.setTo(0.5);
}

function actionOnClick1(){
    again.visible = false;
    start();
}
start();