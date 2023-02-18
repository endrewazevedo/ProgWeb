(function () {
  const TAMX = 600;
  const TAMY = 800;
  const FPS = 100;
  const PROB_ENEMY_SHIP = 0.5;
  const PROB_ENEMY_UFO = 0.3;
  const PROB_METEOR_BIG = 0.1;
  const PROB_METEOR_SMALL = 0.2;
  const SPEED_INCREASE_INTERVAL = 60000
  const SPEED_INCREASE_PERCENTAGE = 20;
  
  let space, ship;
  let enemies = [];
  let shots = [];
  let enemyShipSpeed = 2
  let enemyUFOSpeed = 2
  let enemyMeteorBigSpeed = 1
  let enemyMeteorSmallSpeed = 4

  let interval = null;
  let isPaused = false;
  let isStarted = false;

  function init() {
    space = new Space();
    ship = new Ship();
    // interval = window.setInterval(run, 1000 / FPS);
  }

  window.addEventListener("keydown", (e) => {
    if (!isStarted) {
      if (e.key === " ") {
        const startMessage = document.getElementById("start-message");
        startMessage.remove();
        startGame();
      }
    } else if (isStarted){
      if (e.key === " "){
        shots.push(new Shot())
      }
      if (e.key === "ArrowLeft") ship.mudaDirecao(-1);
      if (e.key === "ArrowRight") ship.mudaDirecao(+1);
      if (e.key === "p") {
        // pausa o jogo quando o usuário pressiona a tecla p
        if (!isPaused) {
          clearInterval(interval);
          isPaused = true;
        } else {
          // despausa o jogo caso o usuário pressione a tecla p enquanto o jogo estiver pausado
          interval = setInterval(run, 1000 / FPS);
          isPaused = false;
        }
      }
      if (e.key === " ") { // adicionado novo listener de eventos para a tecla espaço
        if (!isStarted) {
          startGame();
        }
      }
    }
  });

  function startGame() {
    if (!isStarted) {
      isStarted = true;
      interval = window.setInterval(run, 1000 / FPS);
      setInterval(increaseObstaclesSpeed, SPEED_INCREASE_INTERVAL);
    }
  }

  class Space {
    constructor() {
      this.element = document.getElementById("space");
      this.element.style.width = `${TAMX}px`;
      this.element.style.height = `${TAMY}px`;
      this.element.style.backgroundPositionY = "0px";
    }
    move() {
      this.element.style.backgroundPositionY = `${
        parseInt(this.element.style.backgroundPositionY) + 1
      }px`;
    }
  }

  class Ship {
    constructor() {
      this.element = document.getElementById("ship");
      this.AssetsDirecoes = [
        "assets/playerLeft.png",
        "assets/player.png",
        "assets/playerRight.png",
        "assets/playerDamaged.png"
      ];
      this.direcao = 1;
      this.element.src = this.AssetsDirecoes[this.direcao];
      this.element.style.bottom = "20px";
      this.element.style.left = `${parseInt(TAMX / 2) - 50}px`;
    }
    mudaDirecao(giro) {
      if (this.direcao + giro >= 0 && this.direcao + giro <= 2) {
        this.direcao += giro;
        this.element.src = this.AssetsDirecoes[this.direcao];
      }
    }
    move() {
      if (this.direcao === 0 && parseInt(this.element.style.left) > 0)
        this.element.style.left = `${parseInt(this.element.style.left) - 1}px`;
      if (this.direcao === 2 && parseInt(this.element.style.left) < TAMX - this.element.offsetWidth)
        this.element.style.left = `${parseInt(this.element.style.left) + 1}px`;
      space.move();
    }
  }

  class EnemyShip {
    constructor() {
      this.element = document.createElement("img");
      this.element.className = "enemy-ship";
      this.element.src = "assets/enemyShip.png";
      this.element.style.top = "0px";
      this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`;
      this.speed = enemyShipSpeed
      space.element.appendChild(this.element);
    }
    move() {
      const top = parseInt(this.element.style.top);
      const height = this.element.offsetHeight;
      this.element.style.top = `${parseInt(this.element.style.top) + this.speed}px`;
      if (top + height > space.element.offsetHeight) {
        this.element.remove();
      }
    }
  }

  class EnemyUFO {
    constructor() {
      this.element = document.createElement("img");
      this.element.className = "enemy-ufo";
      this.element.src = "assets/enemyUFO.png";
      this.element.style.top = "0px";
      this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`;
      this.speed = enemyUFOSpeed
      space.element.appendChild(this.element);
    }
    move() {
      const top = parseInt(this.element.style.top);
      const height = this.element.offsetHeight;

      this.element.style.top = `${parseInt(this.element.style.top) + this.speed}px`;
      if (top + height > space.element.offsetHeight) {
        this.element.remove();
      }
    }
  }

  class meteorBig {
    constructor() {
      this.element = document.createElement("img");
      this.element.className = "meteor-big";
      this.element.src = "assets/meteorBig.png";
      this.element.style.top = "0px";
      this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`;
      this.speed = enemyMeteorBigSpeed
      space.element.appendChild(this.element);
    }
    move() {
      const top = parseInt(this.element.style.top);
      const height = this.element.offsetHeight;
      this.element.style.top = `${parseInt(this.element.style.top) + this.speed}px`;
      if (top + height > space.element.offsetHeight) {
        this.element.remove();
      }
    }
  }

  class meteorSmall {
    constructor() {
      this.element = document.createElement("img");
      this.element.className = "meteor-small";
      this.element.src = "assets/meteorSmall.png";
      this.element.style.top = "0px";
      this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`;
      this.speed = enemyMeteorSmallSpeed
      space.element.appendChild(this.element);
    }
    move() {
      const top = parseInt(this.element.style.top);
      const height = this.element.offsetHeight;
      this.element.style.top = `${parseInt(this.element.style.top) + this.speed}px`;
      if (top + height > space.element.offsetHeight) {
        this.element.remove();
      }
    }
  }

  class Shot {
    constructor() {
      this.element = document.createElement("img");
      this.element.className = "shot";
      this.element.src = "assets/laserRed.png";
      this.element.style.bottom = "20px";
      this.element.style.left = `${parseInt(ship.element.style.left) + (ship.element.offsetWidth / 2)}px`;
      this.speed = 5
      space.element.appendChild(this.element);
    }
    move() {
      this.element.style.bottom = `${parseInt(this.element.style.bottom) + this.speed}px`;
    }
  }

  function increaseObstaclesSpeed() {
    enemyShipSpeed *= (100 + SPEED_INCREASE_PERCENTAGE) / 100;
    enemyUFOSpeed *= (100 + SPEED_INCREASE_PERCENTAGE) / 100;
    enemyMeteorBigSpeed *= (100 + SPEED_INCREASE_PERCENTAGE) / 100;
    enemyMeteorSmallSpeed *= (100 + SPEED_INCREASE_PERCENTAGE) / 100;
  }

  function run() {
    const random_enemy_ship = Math.random() * 100;
    const random_enemy_ufo = Math.random() * 100;
    const random_meteor_big = Math.random() * 100;
    const random_meteor_small = Math.random() * 100;

    if (random_enemy_ship <= PROB_ENEMY_SHIP) {
      enemies.push(new EnemyShip(enemyShipSpeed));
    }
    if (random_enemy_ufo <= PROB_ENEMY_UFO) {
      enemies.push(new EnemyUFO(enemyUFOSpeed));
    }
    if (random_meteor_big <= PROB_METEOR_BIG) {
      enemies.push(new meteorBig(enemyMeteorBigSpeed));
    }
    if (random_meteor_small <= PROB_METEOR_SMALL) {
      enemies.push(new meteorSmall(enemyMeteorSmallSpeed));
    }
    enemies.forEach((e) => {
      if (!isPaused) {
        e.move();
      }
    });
    shots.forEach((e) => {
      if (!isPaused) {
        e.move();
      }
    });
    if (!isPaused) {
      ship.move();
      ship.element.style.left = `${parseInt(ship.element.style.left)}px`;
    }
  }

  init();
})();
