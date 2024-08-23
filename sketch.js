let player1, player2;
let ball;
let player1Score = 0;
let player2Score = 0;
let gameState = 'start'; // 'start', 'play', 'end'

function setup() {
  createCanvas(800, 400);
  player1 = new Player(true); // true indica que é o jogador 1
  player2 = new Player(false); // false indica que é o jogador 2
  ball = new Ball();
}

function draw() {
  background(0);

  if (gameState === 'start') {
    textAlign(CENTER);
    fill(255);
    textSize(32);
    text('Pressione Enter para iniciar', width / 2, height / 2);
  } else if (gameState === 'play') {
    player1.show();
    player2.show();
    player1.update();
    player2.update();
    ball.show();
    ball.update();
    textAlign(CENTER);
    fill(255);
    textSize(32);
    text(player1Score + ' - ' + player2Score, width / 2, 50);
  } else if (gameState === 'end') {
    textAlign(CENTER);
    fill(255);
    textSize(32);
    text('Fim de jogo', width / 2, height / 2);
    textSize(24);
    text('Pressione Enter para jogar novamente', width / 2, height / 2 + 40);
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (gameState === 'start' || gameState === 'end') {
      gameState = 'play';
      player1Score = 0;
      player2Score = 0;
      ball.reset();
    }
  }

  if (gameState === 'play') {
    // Controles do Player 1 (W, A, S, D)
    if (key === 'w') {
      player1.moveUp();
    } else if (key === 'a') {
      player1.moveLeft();
    } else if (key === 's') {
      player1.moveDown();
    } else if (key === 'd') {
      player1.moveRight();
    } else if (key === 'f') {
      ball.hit(player1);
    } else if (key === 'e') {
      ball.serve(player1);
    }

    // Controles do Player 2 (setas)
    if (keyCode === UP_ARROW) {
      player2.moveUp();
    } else if (keyCode === LEFT_ARROW) {
      player2.moveLeft();
    } else if (keyCode === DOWN_ARROW) {
      player2.moveDown();
    } else if (keyCode === RIGHT_ARROW) {
      player2.moveRight();
    } else if (keyCode === 191) { // código para a tecla | no teclado brasileiro
      ball.hit(player2);
    } else if (keyCode === 221) { // código para a tecla } no teclado brasileiro
      ball.serve(player2);
    }
  }
}

function keyReleased() {
  if (gameState === 'play') {
    // Parar movimento do Player 1
    if (key === 'w' || key === 's' || key === 'a' || key === 'd') {
      player1.stop();
    }

    // Parar movimento do Player 2
    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
      player2.stop();
    }
  }
}

class Player {
  constructor(isPlayer1) {
    this.w = 20;
    this.h = 80;
    this.isPlayer1 = isPlayer1;
    if (isPlayer1) {
      this.x = 50;
    } else {
      this.x = width - 70;
    }
    this.y = height / 2 - this.h / 2;
    this.ySpeed = 0;
    this.speed = 8;
  }

  show() {
    fill(255);
    rect(this.x, this.y, this.w, this.h);
  }

  update() {
    this.y += this.ySpeed;
    this.y = constrain(this.y, 0, height - this.h);
  }

  moveUp() {
    this.ySpeed = -this.speed;
  }

  moveDown() {
    this.ySpeed = this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
    this.x = constrain(this.x, 0, width - this.w);
  }

  moveRight() {
    this.x += this.speed;
    this.x = constrain(this.x, 0, width - this.w);
  }

  stop() {
    this.ySpeed = 0;
  }
}

class Ball {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-2, 2);
    this.speedIncrement = 0.5;
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, 20);
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Verificar colisão com as bordas
    if (this.y < 0 || this.y > height) {
      this.ySpeed *= -1;
    }

    // Verificar colisão com os jogadores
    if (this.x <= player1.x + player1.w &&
      this.y >= player1.y &&
      this.y <= player1.y + player1.h) {
      this.xSpeed *= -1;
      this.x += this.speedIncrement;
      this.speedIncrement += 0.1;
    } else if (this.x >= player2.x - player2.w &&
      this.y >= player2.y &&
      this.y <= player2.y + player2.h) {
      this.xSpeed *= -1;
      this.x -= this.speedIncrement;
      this.speedIncrement += 0.1;
    }

    // Verificar se a bola saiu pela lateral
    if (this.x < 0) {
      player2Score++;
      this.reset();
    } else if (this.x > width) {
      player1Score++;
      this.reset();
    }
  }

  hit(player) {
    if (player.isPlayer1 && this.x <= player1.x + player1.w &&
      this.y >= player1.y &&
      this.y <= player1.y + player1.h) {
      this.xSpeed *= -1;
      this.x += this.speedIncrement;
      this.speedIncrement += 0.1;
    } else if (!player.isPlayer1 && this.x >= player2.x - player2.w &&
      this.y >= player2.y &&
      this.y <= player2.y + player2.h) {
      this.xSpeed *= -1;
      this.x -= this.speedIncrement;
      this.speedIncrement += 0.1;
    }
  }

  serve(player) {
    if (player.isPlayer1) {
      this.xSpeed = 5;
    } else {
      this.xSpeed = -5;
    }
    this.ySpeed = random(-3, 3);
  }
}
