// Déclaration des variables

// Variable principale du jeu
var game = {
  state: 0,
  time: 0,
  numberOfPipes: 0,
  speed: 6,
  holeHeight: 200,
  score: 0,
  scoreStep: 1,
  timeWhenLost: 0,
  canClickAfterDeath: false,
  init: function() {
    this.time = 0;
    this.numberOfPipes = 0;
    licorne.x = width/5;
    licorne.y = height/2;
    this.score = 0;
    this.scoreStep = 1;
    this.holeHeight = 200;
    this.fullTime = 0;
    this.canClickAfterDeath = false;
  },
  fullTime: 0,
  decreasingHoleHeight: function() {
    if(game.fullTime % 90 == 0) {
      game.holeHeight -= 1;
    }
  } 
}

// Variable qui caractérise flappy leecorn
var licorne = {
  x: 0,
  y: 0,
  taille: 34,
  afficher: function() {
    image(flap, licorne.x, licorne.y, licorne.taille, licorne.taille);
  },
  yLastTap: 0
}

// Variable qui vérifie le score et si le joueur a perdu ou non
var check = {
  score: function() {
    switch(game.scoreStep) {
    case 1:
      if(licorne.x > pipe1.x) {game.score += 1; game.scoreStep = 2;}
      break;
    case 2:
      if(licorne.x > pipe2.x) {game.score += 1; game.scoreStep = 3;}
      break;
    case 3:
      if(licorne.x > pipe3.x) {game.score += 1; game.scoreStep = 1;}
      break;
    }
  },
  ifNotDead: function() {
    if(licorne.x > pipe1.x-licorne.taille/2 && licorne.x < pipe1.x+50+licorne.taille/2) {
      if((licorne.y-licorne.taille/2 < pipe1.hole - game.holeHeight/2) || (licorne.y+licorne.taille/2 > pipe1.hole + game.holeHeight/2)) {
        game.state = 3;
        game.timeWhenLost = game.fullTime;
      }
    }
    if(licorne.x > pipe2.x-licorne.taille/2 && licorne.x < pipe2.x+50+licorne.taille/2) {
      if((licorne.y-licorne.taille/2 < pipe2.hole - game.holeHeight/2) || (licorne.y+licorne.taille/2 > pipe2.hole + game.holeHeight/2)) {
        game.state = 3;
        game.timeWhenLost = game.fullTime;
      }
    }
    if(licorne.x > pipe3.x-licorne.taille/2 && licorne.x < pipe3.x+50+licorne.taille/2) {
      if((licorne.y-licorne.taille/2 < pipe3.hole - game.holeHeight/2) || (licorne.y+licorne.taille/2 > pipe3.hole + game.holeHeight/2)) {
        game.state = 3;
        game.timeWhenLost = game.fullTime;
      }
    }
  }, 
  ifPipeAway: function() {
    if(pipe1.x < -200) { 
      pipe1.x = 1600;
      pipe1.hole = Math.random() * ((height - game.holeHeight/2) - (game.holeHeight/2 + 20)) + (game.holeHeight/2 + 20);
    }
    if(pipe2.x < -200) { 
      pipe2.x = 1600;
      pipe2.hole = Math.random() * ((height - game.holeHeight/2) - (game.holeHeight/2 + 20)) + (game.holeHeight/2 + 20);
    }
    if(pipe3.x < -200) {
      pipe3.x = 1600;
      pipe3.hole = Math.random() * ((height - game.holeHeight/2) - (game.holeHeight/2 + 20)) + (game.holeHeight/2 + 20);
    }
  }
}

function Pipe() {
  game.numberOfPipes += 1;
  this.x = 500 + 600 * game.numberOfPipes;
  this.hole = Math.random() * ((height - game.holeHeight/2) - (game.holeHeight/2 + 20)) + (game.holeHeight/2 + 20);
  
  this.afficherPipe = function() {
    fill(0);
    rect(this.x,0,50,this.hole-game.holeHeight/2);
    rect(this.x,this.hole+game.holeHeight/2,50,height-this.hole-game.holeHeight/2);
    fill(255);
  }
}

// Images
var clouds, flap, intro, perdu;

// Préchargement
function preload() {
  clouds = loadImage('images/clouds.jpg');
  flap = loadImage('images/flapflap.png');
  intro = loadImage('images/intro.png');
  perdu = loadImage('images/perdu.png');
}

// Premier affichage du programme
function setup() {
  createCanvas(800,500); // Affichage de la fenêtre
  imageMode(CENTER); // Centrage des images
  noStroke();

  // Propriétés du texte
  textAlign(CENTER);
  textStyle(BOLD);
  fill(255);

  game.init();

  // Pipes
  pipe1 = new Pipe();
  pipe2 = new Pipe();
  pipe3 = new Pipe();
}

// Fonction répétée 30 fois par secondes
function draw() {
  image(clouds, width/2, height/2, width, height); // Fond d'écran nuages
  game.time+=1; // Temps à 30 images/secondes
  

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
     
    pipe1.afficherPipe();
    pipe2.afficherPipe();
    pipe3.afficherPipe();
    
    check.score();
    textSize(50);
    text(game.score, 95*width/100, 60);
    
    pipe1.x -= game.speed;
    pipe2.x -= game.speed;
    pipe3.x -= game.speed;
    
    check.ifNotDead();
    check.ifPipeAway();
    
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

// Fonction qui s'active quand on appuie sur une touche
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
      
      game.numberOfPipes = 1;
      pipe1.x = 200 + 600 * game.numberOfPipes;
      game.numberOfPipes += 1
      pipe2.x = 200 + 600 * game.numberOfPipes;
      game.numberOfPipes += 1
      pipe3.x = 200 + 600 * game.numberOfPipes;
      pipe1.hole = Math.random() * ((height - game.holeHeight/2) - (game.holeHeight/2 + 20)) + (game.holeHeight/2 + 20);
      pipe2.hole = Math.random() * ((height - game.holeHeight/2) - (game.holeHeight/2 + 20)) + (game.holeHeight/2 + 20);
      pipe3.hole = Math.random() * ((height - game.holeHeight/2) - (game.holeHeight/2 + 20)) + (game.holeHeight/2 + 20);
      break;
    }
  }
}

// Compatibilité smartphones et clic de souris
function touchStarted() { 
  keyPressed();
}