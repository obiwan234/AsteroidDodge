/*NOTES:
	1)format words-center the instruction text
*/

let colors;
let score;
let lost;
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
let player;
let again;
let cont;
let infoScreen=true;
let p;

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
		} else {
			push();
			fill(colors[this.value+1]);
			ellipse(this.x,this.y,this.r*2,this.r*2);
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
		let dX=this.x-max(player.x,min(this.x,player.x+player.w));
		let dY=this.y-max(player.y,min(this.y,player.y+player.l));
		return sqrt(pow(dX,2)+pow(dY,2))<this.r;
	}
}

function preload() {
	shipImage=loadImage("assets/Spaceship.png");
	heartImage=loadImage("assets/Heart.png");
}

function setup() {
	createCanvas(windowWidth-30,windowHeight-20);
	colors=[color(255),color(255,255,0),color(255,0,0)];
	rectMode(CENTER);
	imageMode(CENTER);
	again=createButton("Start Game");
	again.position(width/2-30,height/2+20);
	again.mousePressed(initializeVars);
	//let instr="Don't hit the asteroids - you'll lose health!\n<br></br>\nLast as long as you can and \n<br></br>collect yellow coins to increase score.\n\n<br></br>Collect hearts to increase health.\n\n<br></br>Press 'P' to pause and 'Q' to quit.";
	//p=createElement("H3",instr);
	//p.position(width/2-300,height/4-90);
}

function initializeVars() {
	infoScreen=false;
	p.hide();
	noCursor();
	again.hide();
	score=0;
	lost=false;
	currSpeed=1.5;
	direction=0;
	for(let i=0; i<floor(random(4,10)); i++) {
		asteroids.push(new Asteroid(random(width),0,random(5,10),1,-1));
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
		w:30,
		l:25,
		x:width/2-10,
		y:height-25,
		display:function(){
			image(shipImage,this.x,this.y,40,40);
		},
		move:function(num) {
			if((num>0&&this.x<width-this.w/2)||(num<0&&this.x>this.w/2)) {
				this.x+=num+num*currSpeed/15;
			}
		}
	};
}

function addAst() {
	asteroids.push(new Asteroid(random(width),0,random(5,10),currSpeed,-1));
	addAstLoop=setTimeout(addAst,70/currSpeed+20);
}
function addCoin() {
	asteroids.push(new Asteroid(random(width),0,10,currSpeed/4,0));
	addCoinLoop=setTimeout(addCoin,random(3000,4000)/currSpeed);
}
function addHealth() {
	asteroids.push(new Asteroid(random(width),0,25,currSpeed/6,1));
	addHealthLoop=setTimeout(addHealth,15000/currSpeed);
}


function draw() {
	if(!infoScreen) {
		background(0);
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
		if(lost) {
			push();
			fill(255);
			textSize(20);
			text("You Lost!",width/2-20,height/2);
			pop();
		}
		push();
		fill(255);
		textSize(20);
		text("Health: "+player.health,20,20);
		text("Score: "+score,20,50);
		pop();
	} else {
		background(1,1,20);
		push();
		fill(255);
		rect(width/2+15,height/4,700,400);
		fill(0);
		textSize(40);
		text("Instructions",width/2-95,height/4-150);
		textSize(30);
		let instr="Don't hit the asteroids - you'll lose health!\n\nLast as long as you can and \ncollect yellow coins to increase score.\n\nCollect hearts to increase health.\n\nPress 'P' to pause and 'Q' to quit.";
		text(instr,width/2-300,height/4-90);
		p.show();
		pop();
	}
}

function loseGame() {
	asteroids=[];
	lost=true;
	cursor();
	clearTimeout(addAstLoop);
	clearTimeout(addHealthLoop);
	clearTimeout(addCoinLoop);
	clearInterval(incrSpeed);
	clearInterval(incrScore);
	push();
	fill(255);
	textSize(20);
	text("You Lost!",width/2-20,height/2);
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
		loseGame();
		if(cont) {
			cont.hide();
			loop();
		}
	}
	if(key=="P") {
		clearTimeout(addAstLoop);
		clearTimeout(addHealthLoop);
		clearTimeout(addCoinLoop);
		clearInterval(incrSpeed);
		clearInterval(incrScore);
		cursor();
		noLoop();
		cont=createButton("Continue")
		cont.position(width/2-30,height/2+20);
		cont.mousePressed(function(){
			cont.hide();
			noCursor();
			incrSpeed=setInterval(function(){currSpeed+=.01;},2000);
			incrScore=setInterval(function(){score++;},2000)
			addHealth();
			addCoin();
			addAst();
			loop();
		});
	}
}

function keyReleased() {
	if(keyCode==RIGHT_ARROW||key=='D'||keyCode==LEFT_ARROW||key=='A') {
		direction=0;
	}
}
