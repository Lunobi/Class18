var trex, trexrunimg, trexdead, ground, cloud, obstacle, trexcollided, restart;
var restart, groundimg, obstacleimg1, obstacleimg2, obstacleimg3, obstacleimg4, obstacleimg5, obstacleimg6;
var invisibleground, cloudimg,  gameover, obstaclegroup, cloudgroup, restartimg, gameoverimg;
var diesound, cpsound, jumpsound;
var gamestate="play";
var play = 1;
var end = 0;
var score = 0;

function preload(){
    trexrunimg = loadAnimation("trex1.png", "trex3.png", "trex4.png");
    groundimg = loadImage("ground2.png");
    cloudimg = loadImage("cloud.png");
    obstacleimg1 = loadImage("obstacle1.png");
    obstacleimg2 = loadImage("obstacle2.png");
    obstacleimg3 = loadImage("obstacle3.png");
    obstacleimg4 = loadImage("obstacle4.png");
    obstacleimg5 = loadImage("obstacle5.png");
    obstacleimg6 = loadImage("obstacle6.png");
    trexcollided = loadAnimation("trex_collided.png")
    gameoverimg = loadImage("gameOver.png");
    restartimg = loadImage("restart.png");
    diesound = loadSound("die.mp3");
    cpsound = loadSound("checkPoint.mp3");
    jumpsound = loadSound("jump.mp3");
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    
    trex = createSprite(50, height-80, 20, 50);
    trex.addAnimation("trexrunning", trexrunimg);
    trex.addAnimation("trexcollide", trexcollided);
    trex.scale=0.4;

    ground = createSprite(width/2, height-100, width, 20);
    ground.addImage(groundimg);

    gameover = createSprite(width/2, height/2, 10, 10);
    gameover.addImage(gameoverimg);
    gameover.scale=0.5;

    restart = createSprite(width/2, height/2+50, 10, 10);
    restart.addImage(restartimg);
    restart.scale=0.5;

    invisibleground = createSprite(width/2, height-80, width, 20);
    invisibleground.visible = false;
    obstaclegroup = createGroup();
    cloudgroup = createGroup();
    trex.setCollider("circle", 0, 0, 40);
    trex.debug=false;


}

function draw(){
    background("black");

    textSize(18  );
    fill("white");
    text("Score: "+score, width/2-625, height/2-200);

    
    if (gamestate==="play"){
        score=score+ Math.round(getFrameRate()/60);
        restart.visible=false;
        gameover.visible=false;
        trex.changeAnimation("trexrunning", trexrunimg);

        if ((touches.length>0 || keyDown("space")) && trex.y>=height-200){
            trex.velocityY=-10;
            jumpsound.play();
            touches=[];
        }

        trex.velocityY = trex.velocityY+0.8;
    
        ground.velocityX=-(6+3*score/100);
        if (ground.x<0){
            ground.x= ground.width/2;
        }
        if (score>0 && score%100===0){
            cpsound.play();
        }
    
        createclouds();
        createobstacles();
        if(trex.isTouching(obstaclegroup)){
            gamestate="end";
            diesound.play();
        }


    }
    else if(gamestate==="end"){
        gameover.visible=true;
        restart.visible=true;
        trex.changeAnimation("trexcollide", trexcollided);
        trex.velocityX=0;
        trex.velocityY=0;
        ground.velocityX=0;
        obstaclegroup.setVelocityXEach(0);
        cloudgroup.setVelocityXEach(0);
        
        if (touches.lenght>0 || keyDown("space")){
        reset();
        touches=[];
        }
    }
    
    trex.collide(invisibleground);
    drawSprites();
}


function createclouds(){
    if (frameCount%120===0){
        cloud = createSprite(width+30, height-250, 40, 10);
        cloud.addImage(cloudimg);
        cloud.scale=0.5;
        cloud.y = Math.round(random(10, 60));
        cloud.velocityX = -2;
        cloud.lifetime = 720;
        cloud.depth = trex.depth;
        trex.depth = trex.depth+1;
        cloudgroup.add(cloud);
    }
}


function createobstacles(){
    if(frameCount%60===0){
        obstacle = createSprite(550, height-110, 10, 40);
        obstacle.velocityX = -(6+3*score/100);
        obstacle.scale=0.5;
        obstacle.lifetime = 300;
        obstaclegroup.add(obstacle);

        var selectObstacle = Math.round(random(1, 6));


        switch(selectObstacle){
            case 1: obstacle.addImage(obstacleimg1);
            break; 
            case 2: obstacle.addImage(obstacleimg2);
            break;
            case 3: obstacle.addImage(obstacleimg3);
            break;
            case 4: obstacle.addImage(obstacleimg4);
            break;
            case 5: obstacle.addImage(obstacleimg5);
            break;
            case 6: obstacle.addImage(obstacleimg6);
            break; 
            default: break;
        }
    }
    
}

function reset(){
    gamestate="play";
    score = 0;
    gameover.visible=false
    restart.visible=false;
    cloudgroup.destroyEach();
    obstaclegroup.destroyEach();
}
