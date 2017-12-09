// Déclaration des variables

// Images
var clouds, flap, intro, perdu;
// Etape initial du jeu
// 0 - Accueil  1 - Prêt à démarrer  2 - Jeu  3 - Fin du jeu
var gameState = 0;
// Variable de temps
var t = 0;
// Variables de position de la licorne
var xLicorne, yLicorne;
// Taille de flap
var tailleFlap = 30;
// Score
var score = 0;
var scoreStep = 1;
// Variables pipes
var pipes = 0;
// Vitesse des pipes
var vitesse = 6;
// Hauteur du trou des pipes
var holeHeight = 200;

// Préchargement

function preload() {
  clouds = loadImage('images/clouds.jpg');
  flap = loadImage('images/flapflap.png');
  intro = loadImage('images/intro.png');
  perdu = loadImage('images/perdu.png');
}

// Affichage du programme

function setup() {
  createCanvas(800, 500); // Affichage de la fenêtre
  imageMode(CENTER); // Centrage des images
  noStroke();

  // Propriétés du texte
  textSize(20);
  textAlign(CENTER);
  textStyle(BOLD);
  fill(255);

  // Définition de la position de la licorne par rapport à l'écran
  xLicorne = width/5;
  yLicorne = height/2;

  // Pipes
  pipe1 = new Pipe();
  pipe2 = new Pipe();
  pipe3 = new Pipe();
}

// Fonction répétée 30 fois par secondes

function draw() {
  image(clouds, width/2, height/2, width, height); // Fond d'écran nuages
  t+=1; // Temps à 30 images/secondes
  

  switch(gameState) {
  case 0: // Acceuil du jeu
    image(intro, width/2, height/2, width, height);
    break;

  case 1: // Prêt à démarrer
    yLicorne = yLicorne + Math.cos(t/30);
    licorne.afficher();
    break;

  case 2: // Jeu
    checkScore();
    print(score);
    yLicorne = licorne.x(yLicorneTap);
    if (yLicorne>height+tailleFlap || yLicorne<0-tailleFlap) { 
      gameState = 3;
    }
    licorne.afficher();
     
    pipe1.afficherPipe();
    pipe2.afficherPipe();
    pipe3.afficherPipe();
    
    pipe1.x -= vitesse;
    pipe2.x -= vitesse;
    pipe3.x -= vitesse;
    
    if(xLicorne > pipe1.x && xLicorne < pipe1.x+50) {
      if((yLicorne < pipe1.hole - holeHeight/2) || (yLicorne > pipe1.hole + holeHeight/2)) {
        gameState = 3;
      }
    }
    if(xLicorne > pipe2.x && xLicorne < pipe2.x+50) {
      if((yLicorne < pipe2.hole - holeHeight/2) || (yLicorne > pipe2.hole + holeHeight/2)) {
        gameState = 3;
      }
    }
    if(xLicorne > pipe3.x && xLicorne < pipe3.x+50) {
      if((yLicorne < pipe3.hole - holeHeight/2) || (yLicorne > pipe3.hole + holeHeight/2)) {
        gameState = 3;
      }
    }
    
    if(pipe1.x < -200) { 
      pipe1.x = 1600;
      pipe1.hole = Math.random() * ((height - holeHeight/2) - (holeHeight/2 + 20)) + (holeHeight/2 + 20);
    }
    if(pipe2.x < -200) { 
      pipe2.x = 1600;
      pipe2.hole = Math.random() * ((height - holeHeight/2) - (holeHeight/2 + 20)) + (holeHeight/2 + 20);
    }
    if(pipe3.x < -200) {
      pipe3.x = 1600;
      pipe3.hole = Math.random() * ((height - holeHeight/2) - (holeHeight/2 + 20)) + (holeHeight/2 + 20);
    }
    break;

  case 3: // Perdu & Score
    image(perdu, width/2, height/3, width, height);
    text('SCORE : ' + score, width/2, (15*height)/28);
    break;
  }
}

// Fonction qui s'active quand l'écran d'un smartphone est pressé

function touchStarted() {
  switch(gameState) {
  case 0: // Acceuil du jeu
    gameState = 1;
    break;

  case 1: // Prêt à démarrer
    gameState = 2;
    yLicorneTap = yLicorne; 
    t = 0;
    break;

  case 2: // Jeu
    gameState = 2;
    yLicorneTap = yLicorne;
    t = 0;
    break;

  case 3: // Perdu & Score
    score = 0;
    gameState = 1;
    xLicorne = width/5;
    yLicorne = height/2;
    t=0
    
    pipes = 1;
    pipe1.x = 200 + 600 * pipes;
    pipes+=1
    pipe2.x = 200 + 600 * pipes;
    pipes+=1
    pipe3.x = 200 + 600 * pipes;
    pipe1.hole = Math.random() * ((height - holeHeight/2) - (holeHeight/2 + 20)) + (holeHeight/2 + 20);
    pipe2.hole = Math.random() * ((height - holeHeight/2) - (holeHeight/2 + 20)) + (holeHeight/2 + 20);
    pipe3.hole = Math.random() * ((height - holeHeight/2) - (holeHeight/2 + 20)) + (holeHeight/2 + 20);
    break;
  }
}

// Fonction qui s'active quand une touche est pressée sur ordinateur

function keyPressed() { 
  touchStarted();
}

// Variable de la licorne

var licorne = {
  x: function(yOrigin) {
  return (1/4)*t*t-10*t+yOrigin;
  // (1/2)*(9.8/30)*t*t-10*t+yOrigin;
  }, 
  afficher: function() {
  image(flap, xLicorne, yLicorne, tailleFlap, tailleFlap);
  }
}

function Pipe() {
  pipes += 1;
  this.x = 200 + 600 * pipes;
  this.hole = Math.random() * ((height - holeHeight/2) - (holeHeight/2 + 20)) + (holeHeight/2 + 20);
  
  this.afficherPipe = function() {
    rect(this.x,0,50,this.hole-holeHeight/2);
    
    rect(this.x,this.hole+holeHeight/2,50,height-this.hole-holeHeight/2);
  }
}

function checkScore() {
  switch(scoreStep) {
    case 1:
    if(xLicorne > pipe1.x) {score += 1; scoreStep = 2;}
    break;
    case 2:
    if(xLicorne > pipe2.x) {score += 1; scoreStep = 3;}
    break;
    case 3:
    if(xLicorne > pipe3.x) {score += 1; scoreStep = 1;}
    break;
  }
}