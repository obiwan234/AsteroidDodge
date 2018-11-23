//in event of window resize, canvas.size(windowWidth,windowHeight)
//move forward and back

let colors;
let score;
let lost;
let quit;
let pause;
let addHealthLoop;
let addCoinLoop;
let addAstLoop;
let incrScore;
let incrSpeed;
let currSpeed;
let direction;
let asteroids=[];
let shipImage;
let heartImage;
let astImage;
let coinImage;
let player;
let again;
let infoScreen=true;
let canvas;

Asteroid=function(x,y,r,level,worth) {
	this.value=worth;
	this.x=x;
	this.y=y;
	this.r=r;
	this.level=level
	let sideAcc=random(-.007,.007);
	let makeForce=random(1);
	if(makeForce<.03) {
		sideAcc=random(-.05,.05);
	}
	this.yAcc=random(0.045,0.06);
	this.ySpeed=4;
	this.xAcc=sideAcc;
	this.xSpeed=0;
	this.display=function() {
		if(this.value==1) {
			push();
			image(heartImage,this.x,this.y,this.r*2,this.r*2);
			pop();
		} else if(this.value==-1){
			push();
			translate(this.x,this.y-this.r);
			rotate(270-atan(this.xSpeed/this.ySpeed));
			image(astImage,0,0,this.r*5,this.r*5);
			pop();
		} else {
			push();
			image(coinImage,this.x,this.y,this.r*2,this.r*2);
			pop();
		}
	}
	this.update=function() {
		this.y+=this.ySpeed*this.level;
		this.ySpeed+=this.yAcc;
		this.x+=this.xSpeed*this.level;
		this.xSpeed+=this.xAcc;
		this.r+=.005;
	}
	this.offscreen=function() {
		if(this.y-this.r>height) {
			return true;
		}
		return false;
	}
	this.hitsPlayer=function(num){
		let dX=this.x-player.x;
		let dY=this.y-player.y;
		return sqrt(pow(dX,2)+pow(dY,2))<this.r+player.r;
	}
}

function preload() {
	shipImage=loadImage("assets/spaceship.png");
	heartImage=loadImage("assets/heart.PNG");
	astImage=loadImage("assets/asteroid.png");
	coinImage=loadImage("assets/coin.png");
}

function setup() {
	canvas=createCanvas(windowWidth,windowHeight);
	canvas.position((windowWidth-width)/2,(windowHeight-height)/2);
	colors=[color(255),color(255,255,0),color(255,0,0)];
	rectMode(CENTER);
	imageMode(CENTER);
	angleMode(DEGREES);
	again=createButton("Start Game");
	again.position(0.5*windowWidth-66,0.65*windowHeight);
	again.size(136,30);
	again.mousePressed(initializeVars);
}

function initializeVars() {
	infoScreen=false;
	pause=false;
	noCursor();
	again.hide();
	score=0;
	lost=false;
	quit=false;
	currSpeed=1.5;
	direction=0;
	for(let i=0; i<floor(random(4,10)); i++) {
		asteroids.push(new Asteroid(random(width),0,random(10,20),1,-1));
	}
	setTimeout(function(){
		addAst();
	},70);
	incrSpeed=setInterval(function(){currSpeed+=.01;},2000);
	incrScore=setInterval(function(){score++;},2000)
	addHealth();
	addCoin();
	player={
		health:10,
		r:15,
		w:40,
		l:60,
		x:0.5*width,
		y:0.95*height,
		display:function(){
			image(shipImage,this.x,this.y,this.w,this.l);
		},
		move:function(num) {
			if((num>0&&this.x<width-this.w/2)||(num<0&&this.x>this.w/2)) {
				this.x+=num+num*currSpeed/15;
			}
		}
	};
}

function addAst() {
	asteroids.push(new Asteroid(random(width),0,random(10,20),currSpeed,-1));
	addAstLoop=setTimeout(addAst,80/currSpeed+20);
}
function addCoin() {
	asteroids.push(new Asteroid(random(width),0,17,currSpeed/4,0));
	addCoinLoop=setTimeout(addCoin,random(3000,4000)/currSpeed);
}
function addHealth() {
	asteroids.push(new Asteroid(random(width),0,25,currSpeed/6,1));
	addHealthLoop=setTimeout(addHealth,15000/currSpeed);
}


function draw() {
	if(!infoScreen&&!pause) {
		background(1,1,20);
		for(let i=0; i<asteroids.length; i++) {
			asteroids[i].update();
			asteroids[i].display();
			if(asteroids[i].hitsPlayer(i)) {
				asteroids[i].display();
				player.health+=asteroids[i].value;
				if(asteroids[i].value==0) {
					score+=5;
				}
				asteroids.splice(i,1);
				if(player.health==0) {
					loseGame();
					lost=true;
				}
			}
		}
		player.display();
		player.move(direction*5);
		if(asteroids.length>200) {
			asteroids.splice(0,1);
		}
		if(currSpeed>=2.7) {
			clearInterval(incrSpeed);
		}
		push();
		fill(255);
		textSize(0.0107*width);
		text("Health: "+player.health,0.0107*width,0.0219*height);
		text("Score: "+score,0.0107*width,0.0547*height);
		pop();
	} else if(infoScreen){
		push();
		fill(255);
		rect(0.49*width,0.34*height,0.29*width,0.33*height);
		textSize(0.0295*width);
		text("Asteroid Dodge",0.4*width,0.09*height);
		fill(0);
		textSize(0.0215*width);
		text("Instructions",0.44*width,0.23*height);
		textSize(0.0134*width);
		text("Don't hit the asteroids - you'll lose health!",0.36*width,0.275*height);
		text("Last as long as you can and",0.4*width,0.32*height);
		text("collect golden coins to increase score.",0.365*width,0.353*height);
		text("Collect hearts to increase health.",0.385*width,0.4*height);
		text("Press 'P' to pause and 'Q' to quit.",0.386*width,0.45*height);
		pop();
	}
	if(lost) {
		push();
		fill(255);
		textSize(0.02*width);
		text("You Lost!",0.46*width,0.5*height);
		pop();
	}
	if(quit) {
		push();
		fill(255);
		textSize(0.02*width);
		text("You Quit!",0.46*width,0.5*height);
		pop();
	}
	if(pause) {
		push();
		fill(255);
		textSize(0.02*width);
		text("Paused",0.47*width,0.5*height);
		pop();
	}
}

function loseGame() {
	asteroids=[];
	cursor();
	clearTimeout(addAstLoop);
	clearTimeout(addHealthLoop);
	clearTimeout(addCoinLoop);
	clearInterval(incrSpeed);
	clearInterval(incrScore);
	push();
	fill(255);
	again.html("Play Again?");
	again.show();
	pop();
}

function keyPressed() {
	if(keyCode==RIGHT_ARROW||key=='D') {
		direction=1;
	}
	if(keyCode==LEFT_ARROW||key=='A') {
		direction=-1;
	}
	if(key=="Q") {
		quit=true;
		pause=false;
		loseGame();
	}
	if(key=="P") {
		pause=!pause;
		if(pause) {
			clearTimeout(addAstLoop);
			clearTimeout(addHealthLoop);
			clearTimeout(addCoinLoop);
			clearInterval(incrSpeed);
			clearInterval(incrScore);
			cursor();
		} else {
			noCursor();
			incrSpeed=setInterval(function(){currSpeed+=.01;},2000);
			incrScore=setInterval(function(){score++;},2000)
			addHealth();
			addCoin();
			addAst();
		}
	}
}

function keyReleased() {
	if(keyCode==RIGHT_ARROW||key=='D'||keyCode==LEFT_ARROW||key=='A') {
		direction=0;
	}
}
