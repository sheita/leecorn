var game = {
  state: 0,
  time: 0,
  speed: 7,
  holeHeight: 200,
  score: 0,
  scoreStep: 1,
  timeWhenLost: 0,
  canClickAfterDeath: false,
  init: function() {
    pipes.initPipes();
    this.time = 0;
    this.numberOfPipes = 0;
    licorne.x = width/5;
    licorne.y = height/2;
    this.score = 0;
    this.scoreStep = 1;
    this.holeHeight = 200;
    this.fullTime = 0;
  },
  fullTime: 0,
  decreasingHoleHeight: function() {
    if(game.fullTime % 60 == 0) {
      game.holeHeight -= 1;
    }
  } 
}

var licorne = {
  x: 0,
  y: 0,
  taille: 34,
  afficher: function() {
    image(flap, licorne.x, licorne.y, licorne.taille, licorne.taille);
  },
  yLastTap: 0
}

var check = {
  score: function() {
    if(licorne.x > pipes.pipes[0].x) {
      game.score = pipes.pipes[0].number;
    }
  }
}

var pipes = {
  numberOf: 0,
  pipes: [],
  initPipes: function() {
    this.numberOf = 0;
    this.pipes = [];
    for (var i=0; i<3; i++) {
      this.numberOf += 1;
      this.pipes.push({
      number: this.numberOf,
      x: 500 + 600 * this.numberOf,
      hole: Math.random() * ((height - game.holeHeight/2) - (game.holeHeight/2 + 20)) + (game.holeHeight/2 + 20)
      });
    }
  },
  moving: function() {
    for (var i=0; i<3; i++) {
      this.pipes[i].x -= game.speed;
    }
  },
  displayPipes: function() {
    fill(0);
    for(var i=0; i<3; i++) {
      rect(this.pipes[i].x,0,50,this.pipes[i].hole-game.holeHeight/2);
      rect(this.pipes[i].x,this.pipes[i].hole+game.holeHeight/2,50,height-this.pipes[i].hole-game.holeHeight/2);
    }
    fill(255);
  },
  checkIfPipeAway: function() {
    if(this.pipes[0].x < -200) {
      this.pipes.splice(0,1);
      this.numberOf += 1;
      this.pipes.push({
      number: this.numberOf,
      x: 1600,
      hole: Math.random() * ((height - game.holeHeight/2) - (game.holeHeight/2 + 20)) + (game.holeHeight/2 + 20)
      });
    }
  },
  checkIfNotDead: function() {
    if(licorne.x > this.pipes[0].x-licorne.taille/2 && licorne.x < this.pipes[0].x+50+licorne.taille/2) {
      if((licorne.y-licorne.taille/2 < this.pipes[0].hole - game.holeHeight/2) || (licorne.y+licorne.taille/2 > this.pipes[0].hole + game.holeHeight/2)) {
        game.state = 3;
        game.timeWhenLost = game.fullTime;
      }
    }
  }
}

var clouds, flap, intro, perdu;

function preload() {
  clouds = loadImage('images/clouds.jpg');
  flap = loadImage('images/flapflap.png');
  intro = loadImage('images/intro.png');
  perdu = loadImage('images/perdu.png');
}

function setup() {
  createCanvas(800,500); // Affichage de la fenêtre
  imageMode(CENTER); // Centrage des images
  noStroke();

  textAlign(CENTER);
  textStyle(BOLD);
  fill(255);

  game.init();
}

function draw() {
  image(clouds, width/2, height/2, width, height);
  game.time += 1;
  
  switch(game.state) {
  case 0: // Acceuil du jeu
    image(intro, width/2, height/2, width, height);
    break;

  case 1: // Prêt à démarrer
    licorne.y = licorne.y + Math.cos(game.time/30);
    licorne.afficher();
    break;

  case 2: // Jeu
    licorne.y = (1/4)*game.time*game.time-10*game.time+licorne.yLastTap;
    if (licorne.y>height+licorne.taille || licorne.y<0-licorne.taille) { 
      game.state = 3;
    }
    licorne.afficher();
     
    pipes.displayPipes();
    
    check.score();
    textSize(50);
    text(game.score, 95*width/100, 55);
    
    pipes.moving();
    
    pipes.checkIfNotDead();
    pipes.checkIfPipeAway();
    
    game.fullTime += 1;
    game.decreasingHoleHeight();
    break;

  case 3: // Perdu & Score
    game.fullTime += 1;
    image(perdu, width/2, height/3, width, height);
    textSize(20);
    text('SCORE : ' + game.score, width/2, (15*height)/28);
    break;
  }
}

function keyPressed() {
  switch(game.state) {
  case 0: // Acceuil du jeu
    game.state = 1;
    break;

  case 1: // Prêt à démarrer
    game.state = 2;
    licorne.yLastTap = licorne.y; 
    game.time = 0;
    break;

  case 2: // Jeu
    game.state = 2;
    licorne.yLastTap = licorne.y; 
    game.time = 0;
    break;

  case 3: // Perdu & Score
    if(game.timeWhenLost+20 < game.fullTime) {
      game.state = 1;
      game.init();
      break;
    }
  }
}

function touchStarted() { 
  keyPressed();
}