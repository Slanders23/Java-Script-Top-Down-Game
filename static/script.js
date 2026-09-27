let canvas;
let context;

let fpsInterval = 1000 / 15;
let now;
let then = Date.now();

let request_id;
let lastHitTime = 0;
const hitCooldown = 1000;
let playerImage = new Image();
let score = 0;
const DIRECTIONS = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};
const animations = {
  wait: 0,
  walk: 1,
  run: 2,
  attack: 3,
  defend: 4,
  hit: 5,
  use: 6,
  death: 7,
};
const barrierValue = [108, 109];

let powerTimer = 0;
let background = [
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  ],
  [
    -1, -1, -1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 25, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 23, -1, -1, -1, -1, -1, -1, -1, -1,
  ],
  [
    -1, -1, -1, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 24, 2, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, 0, 25, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    0, 1, 25, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 24, 1, 1, 1, 2, -1, -1, -1,
    -1,
  ],
  [
    21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, -1, -1,
    -1, -1,
  ],
  [
    21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, -1, -1,
    -1, -1,
  ],
  [
    21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, -1, -1,
    -1, -1,
  ],
  [
    21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 11, 11, 11,
    11, 11,
  ],
  [
    21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, -1, -1,
    -1, -1,
  ],
  [
    42, 4, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, -1, -1,
    -1, -1,
  ],
  [
    -1, 42, 43, 4, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 63, 64, 64, 64, 88, 28, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 84, 109, 108, 108, 109, 89, 6,
    7, -1, -1,
  ],
  [
    -1, -1, 0, 25, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 63, 64, 64, 88, 108, 109, 108, 109, 109,
    108, 28, -1, -1,
  ],
  [
    0, 1, 25, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 63, 64, 64, 88, 108, 108, 109, 108, 108, 109, 109, 108,
    108, 28, -1, -1,
  ],
  [
    21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 84, 108, 108, 108, 108, 108, 109, 108, 109, 108, 108,
    108, 108, 28, -1, -1,
  ],
  [
    21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 84, 109, 108, 109, 108, 109, 108, 108, 108, 108, 108,
    108, 108, 28, -1, -1,
  ],
  [
    21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 63, 64, 64, 88, 108, 109, 108, 108, 108, 109, 108, 109, 108, 108,
    108, 108, 89, 6, 7,
  ],
  [
    21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 84, 109, 108, 108, 108, 109, 108, 109, 108, 109, 68, 48, 48, 48, 69,
    109, 27, 108, 28,
  ],
  [
    42, 4, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    63, 64, 88, 108, 109, 68, 48, 48, 48, 48, 48, 48, 49, -1, -1, -1, 26, 108,
    109, 27, 28,
  ],
  [
    -1, 42, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43,
    43, 48, 48, 48, 48, 49, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 47, 48, 48,
    48, 49,
  ],
];
let scoreSent = false
let mouseX = 0;
let mouseY = 0;
let player = {
  x: 100,
  y: 100,
  width: 144,
  height: 144,
  frameX: 0,
  frameY: 0,
  direction: 0,
  size: 20,
  hitboxWidth: 46,
  hitboxHeight: 48,
  xChange: 10,
  yChange: 10,
  stamina: 100,
  maxStamina: 100,
  staminaRegen: 1,
  staminaLoss: 1,
  health: 100,
  attackRange: 50,
  attackHitBoxWidth: 48,
  attackHitBoxHeight: 48,
  viewRadius: 180,
  hx: 0,
  hy: 0,
};
let enemies = [];
const consumables = [
  { name: "hennessy", image: "static/images/hennesy.png", effect: "Black Out" },
  {
    name: "marlboro",
    image: "static/images/banana.png",
    effect: "Infinite stamina",
  },
  {
    name: "liquedLuck",
    image: "static/images/liquedLuck.png",
    effect: "2X Points",
  },
  { name: "comp", image: "static/images/beans.png", effect: "Stench" },
  {
    name: "pinkMonster",
    image: "static/images/pinkMonster.png",
    effect: "Crash Out",
  },
  {
    name: "naughtyOnes",
    image: "static/images/naughtyOnes.png",
    effect: "Strenght",
  },
];
const playerSkins = [
  { name: "Mick", image: "static/images/Mick.png" },
  { name: "Vlad", image: "static/images/Vlad.png" },
  { name: "JJ", image: "static/images/JJ.png" },
  { name: "Shteve", image: "static/images/Shteve.png" },
  { name: "Conor", image: "static/images/Conor.png" },
  { name: "Lizzy", image: "static/images/Lizzy.png" },
  { name: "Owen", image: "static/images/Owen.png" },
  { name: "Dave", image: "static/images/Dave.png" },
  { name: "Jordan", image: "static/images/Jordan.png" },
  { name: "Jake", image: "static/images/Jake.png" },
  { name: "JB", image: "static/images/JB.png" },
  { name: "Mike", image: "static/images/Mike.png" },
  { name: "Paddy", image: "static/images/Paddy.png" },
  { name: "Stan", image: "static/images/Stan.png" },
  { name: "Derek", image: "static/images/Derek.png" },
];
const characters = [
  { name: "Mick", image: "static/CharecterSelect/MickC.png" },
  { name: "Vlad", image: "static/CharecterSelect/VladC.png" },
  { name: "JJ", image: "static/CharecterSelect/JJC.png" },
  { name: "Shteve", image: "static/CharecterSelect/ShteveC.png" },
  { name: "Conor", image: "static/CharecterSelect/ConorC.png" },
  { name: "Lizzy", image: "static/CharecterSelect/LizzyC.png" },
  { name: "Owen", image: "static/CharecterSelect/OwenC.png" },
  { name: "Dave", image: "static/CharecterSelect/DaveC.png" },
  { name: "Jordan", image: "static/CharecterSelect/JordanC.png" },
  { name: "Jake", image: "static/CharecterSelect/JakeC.png" },
  { name: "JB", image: "static/CharecterSelect/JBC.png" },
  { name: "Mike", image: "static/CharecterSelect/MikeC.png" },
  { name: "Paddy", image: "static/CharecterSelect/PaddyC.png" },
  { name: "Stan", image: "static/CharecterSelect/StanC.png" },
  { name: "Derek", image: "static/CharecterSelect/DerekC.png" },
];
const dartImg = [{ name: "dart", image: "static/images/dart.png" }];
const ZombieSkins = [
  { name: "zombie1", image: "static/images/zombie1.png" },
  { name: "zombie2", image: "static/images/zombie2.png" },
  { name: "zombie3", image: "static/images/zombie3.png" },

  { name: "zombie5", image: "static/images/zombie5.png" },
  { name: "zombie6", image: "static/images/zombie6.png" },

  { name: "zombie8", image: "static/images/zombie8.png" },
];
let attackHitBox = {
  hx: player.x,
  hy: player.y,
  width: player.width,
  height: player.height,
};

// Consumables

let hennessyPower = false;
let hentimer = 0;
let marlboroPower = false;
let liquedLuckPower = false;
let compPower = false;
let pinkMonsterPower = false;
let crashOut = false;
let 

naughtyOnesPower = false;
// random
let attack = false;
let darts = [];
let level = 1;
let enemyLevel = 5;
let number = 5;
let damage = 20;
let animation = animations.wait;
let moveLeft = false;
let moveUp = false;
let moveRight = false;
let moveDown = false;
let gameOver = false;
let sprint = 1;
let powerUp = null;
let chargingAttack = false;
let defending = false;
let backImage = new Image();
let zombieImage = new Image();
let consumableImage = new Image();
let tilesPerRow = 21;
let tileSize = 16;
// Sounds
let henMusic = new Audio("static/Sounds/hennessy.mp3");
let hen2Music = new Audio("static/Sounds/hennessy2.mp3");
let marMusic = new Audio("static/Sounds/marlboro2.mp3");
let mar2Music = new Audio("static/Sounds/marlboro2.mp3");
let hitMusic = new Audio("static/Sounds/hit.mp3");
let swingMusic = new Audio("static/Sounds/swing.mp3");
let ooofMusic = new Audio("static/Sounds/ooof.mp3");
let shieldMusic = new Audio("static/Sounds/shield.mp3");
let code = new Audio("static/Sounds/code.mp3");
let red40 = new Audio("static/Sounds/red40.mp3");
let grr = new Audio("static/Sounds/grr.mp3");
let drink = new Audio("static/Sounds/drink.mp3");
let rightBois = new Audio("static/Sounds/rightBois.mp3");
let dartMusic = new Audio("static/Sounds/dart.mp3");
let selectedPlayer = 0;
document.addEventListener("DOMContentLoaded", init, false);
window.addEventListener("mousedown", activateMouse, false);
window.addEventListener("mouseup", deactivateMouse, false);
window.addEventListener("contextmenu", (event) => event.preventDefault());
window.addEventListener("mousedown", function (e) {
  if (e.button === 1) {
    e.preventDefault();
  }
});
const barrier = {
  hx: 0,
  hy: 0,
};
function init() {
  canvas = document.querySelector("canvas");
  context = canvas.getContext("2d");
  window.addEventListener("keydown", activate, false);
  window.addEventListener("keyup", deactivate, false);
  canvas.addEventListener("mousemove", function (event) {
    const rect = canvas.getBoundingClientRect(); 
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
  });
  load_assets(
    [
      { var: backImage, url: "static/images/overworld.png" }
    ],
    () => {
      selectPlayer(0);
      for (let i = 0; i < number; i+=1) spawnEnemy();
    }
  );
}
function selectPlayer(index) {
  selectedPlayer = index;
  const newImage = new Image();
  newImage.src = playerSkins[selectedPlayer].image;

  newImage.onload = function () {
    playerImage = newImage;
    console.log("Selected Player:", playerSkins[selectedPlayer].name);
    document.getElementById("characterSelect").style.display = "none";
    document.querySelector("canvas").style.display = "block";
    draw();
  };
}

function spawnDart() {
  player.stamina -= 10;
  dartMusic.play();
  const angle = Math.atan2(
    mouseY - (player.hy + player.hitboxHeight / 2),
    mouseX - (player.hx + player.hitboxHeight / 2)
  );
  const speed = 30;
  console.log("Dart angle (radians):", angle);
  const dart = {
    hx: player.hx + player.hitboxWidth / 2,
    hy: player.hy + player.hitboxHeight / 2,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    hitboxWidth: 20,
    hitboxHeight: 20,
    frameX: 0,
    frameY: 0,
    direction: 0,
    image: new Image(),
    angle: angle,
  };
  dart.image.src = "static/images/dart.png";
  darts.push(dart);
}

function spawnEnemy() {
  console.log("Canvas at spawnEnemy:", canvas);
  const randomZombie =
    ZombieSkins[Math.floor(Math.random() * ZombieSkins.length)];
  const enemy = {
    hx: Math.random() * (canvas.width - 32),
    hy: Math.random() * (canvas.height - 32),
    width: 45,
    height: 36,
    xChange: 4,
    yChange: 4,
    hitboxWidth: 40,
    hitboxHeight: 40,
    frameX: 0,
    frameY: 0,
    direction: 0,
    health: 100,
    maxHealth: 100,
    chasing: false,
    viewRadius: 300,
    image: new Image(),
  };
  enemy.image.src = randomZombie.image;
  enemies.push(enemy);
}

console.log("Selected Player:", playerSkins[selectedPlayer].name);
console.log("Player image source:", playerImage.src);

function draw() {
  const nowTime = Date.now();
  if (!playerImage.complete || !backImage.complete) {
    console.warn("Image not yet loaded.");
    return;
  }
  request_id = window.requestAnimationFrame(draw);
  let now = Date.now();
  player.hx = player.x + (player.width - player.hitboxWidth) / 2;
  player.hy = player.y + (player.height - player.hitboxHeight) / 2;
  player.x = player.hx - (player.width - player.hitboxWidth) / 2;
  player.y = player.hy - (player.height - player.hitboxHeight) / 2;

  let elapsed = now - then;
  if (elapsed <= fpsInterval) {
    return;
  }

  then = now - (elapsed % fpsInterval);
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#378ad1";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < 22; r += 1) {
    for (let c = 0; c < 40; c += 1) {
      let tile = background[r][c];
      if (tile >= 0) {
        let tileRow = Math.floor(tile / tilesPerRow);
        let tileCol = Math.floor(tile % tilesPerRow);
        context.drawImage(
          backImage,tileCol * tileSize, tileRow * tileSize, tileSize,tileSize, c * 32,r * 32, 32,32 
        );
      }
    }
  }


  context.drawImage(
    playerImage,
    player.frameX * player.width +
      576 * (animation < 4 ? animation : animation - 4),
    (animation < 4 ? 0 : 576) + player.frameY * player.height,
    player.width,
    player.height,
    player.x,
    player.y,
    player.width,
    player.height
  );
  if (attack === true) {
    if (player.frameY === 0) {
      attackHitBox.hx = player.hx;
      attackHitBox.hy = player.hy + player.hitboxHeight;

      
      
    } else if (player.frameY === 1) {
      attackHitBox.hx = player.hx - player.attackRange;
      attackHitBox.hy = player.hy;
     
    } else if (player.frameY === 2) {
      attackHitBox.hx = player.hx + player.hitboxWidth;
      attackHitBox.hy = player.hy;
      
    } else if (player.frameY === 3) {
      attackHitBox.hx = player.hx;
      attackHitBox.hy = player.hy - player.attackRange;
      
    }
  }

  // Following

  darts.forEach((dart) => {
    if (dart.angle > -Math.PI / 4 && dart.angle <= Math.PI / 4) {
      dart.frameX = 0;
      dart.frameY = 1;
    } else if (dart.angle > Math.PI / 4 && dart.angle <= (3 * Math.PI) / 4) {
      dart.frameX = 1;
      dart.frameY = 1;
    } else if (dart.angle > -(3 * Math.PI) / 4 && dart.angle < -Math.PI / 4) {
      dart.frameX = 0;
      dart.frameY = 0;
    } else {
      dart.frameX = 1;
      dart.frameY = 0;
    }
    dart.hx += dart.vx;
    dart.hy += dart.vy;
    context.drawImage(
      dart.image,
      dart.frameX * 512,
      dart.frameY * 512,
      512,
      512,
      dart.hx,
      dart.hy,
      dart.hitboxWidth,
      dart.hitboxWidth
    );
  });

  enemies.forEach((enemy, index) => {
    darts.forEach((dart) => {
      if (collides(dart, enemy)) {
        enemy.health -= 20;
      }
    });

    if (enemy.health <= 0) {
      enemies.splice(index, 1);
      enemyLevel -= 1;
      score += 10;
    }
    if (enemyLevel <= 0) {
      level += 1;
      nextLevel();
    }
    if (circleCol(enemy, player)) {
      if (player.x + player.width / 2 < enemy.hx + enemy.width / 2) {
        enemy.hx -= 4;
        enemy.direction = 3;
      } else if (player.x + player.width / 2 > enemy.hx + enemy.width / 2) {
        enemy.hx += 1;
        enemy.direction = 1;
      }

      if (player.y + player.height / 2 < enemy.hy + enemy.width / 2) {
        enemy.hy -= 4;
        enemy.direction = 2;
      } else if (player.y + player.height / 2 > enemy.hy + enemy.height / 2) {
        enemy.hy += 1;
        enemy.direction = 0;
      }

      enemy.frameY = enemy.direction;
    }
    // cross hear 
    context.beginPath();
    context.arc(mouseX, mouseY, 5, 0, Math.PI * 2);
    context.fillStyle = "red";
    context.fill();
    // Draw enemy
    context.drawImage(
      enemy.image,
      enemy.frameX * enemy.width,
      enemy.frameY * enemy.height,
      enemy.width,
      enemy.height,
      enemy.hx,
      enemy.hy,
      enemy.width,
      enemy.height
    );
    if (compPower) {
      context.beginPath();
      context.arc(
        player.x + player.width / 2,
        player.y + player.height / 2,
        140,
        0,
        2 * Math.PI
      );
      context.fillStyle = "rgba(142, 250, 136, 0.2)";
      context.fill();
    }

    if (pinkMonsterPower) {
      if (crashOut) {
        context.beginPath();
        context.arc(
          player.x + player.width / 2,
          player.y + player.height / 2,
          140,
          0,
          2 * Math.PI
        );
        context.fillStyle = "rgba(234, 26, 26, 0.2)";
        context.fill();
        grr.play();
      }
    }

    //consumable timers
    if (hennessyPower || liquedLuckPower || compPower || pinkMonsterPower) {
      powerTimer -= 1;
      if (powerTimer <= 0) {
        liquedLuckPower = hennessyPower = compPower = pinkMonsterPower = false;
      }
    }
    if (marlboroPower) {
      powerTimer -= 1;
      player.stamina = 100;
      if (powerTimer <= 0) {
        marlboroPower = false;
      }
    }

    if (pinkMonsterPower) {
      if (crashOut) {
        if (circleCol(player, enemy)) {
          enemy.health = 0;
        }
      }
    }

    if (compPower) {
      if (circleCol(player, enemy)) {
        enemy.health -= 1;
      }
    }

    if (collides(player, enemy)) {
      let now = Date.now();
      if (now - lastHitTime >= hitCooldown && player.health > 0) {
        lastHitTime = now;
        const bounceStrength = 100;
        if (player.health > 0) {
          if (hennessyPower) {
            player.x = Math.random() * (canvas.width - 32);
            player.y = Math.random() * (canvas.height - 32);
            hentimer = 10;
          } else if (defending) {
            player.stamina -= 30;
            shieldMusic.play();
            if (enemy.frameY === 0) {
              enemy.hy -= bounceStrength;
            } else if (enemy.frameY === 1) {
              enemy.hx -= bounceStrength;
            } else if (enemy.frameY === 2) {
              enemy.hy += bounceStrength;
            } else if (enemy.frameY === 3) {
              enemy.hy -= bounceStrength;
            }
          } else {
            ooofMusic.play();
            player.health -= 10;
            context.fillStyle = "rgba(255, 0, 0, 0.3)";
            context.fillRect(0, 0, canvas.width, canvas.height);
          }
          if (moveLeft) {
            player.x += bounceStrength;
          } else if (moveRight) {
            player.x -= bounceStrength;
          } else if (moveUp) {
            player.y += bounceStrength;
          } else if (moveDown) {
            player.y -= bounceStrength;
          }
        }
      }
    }

    enemy.frameX = (enemy.frameX + 1) % 3;
    // Health bar
    const healthRatio = enemy.health / enemy.maxHealth;
    context.fillStyle = "black";
    context.fillRect(enemy.hx, enemy.hy - 10, enemy.width, 5);
    context.fillStyle = "lime";
    context.fillRect(enemy.hx, enemy.hy - 10, enemy.width * healthRatio, 5);
  });

  // Attack / kill enemys
  if (attack === true) {
    enemies.forEach((enemy, index) => {
      if (naughtyOnesPower) {
        damage = damage * 2;
      }
      if (collides(enemy, attackHitBox)) {
        enemy.health -= damage;
        hitMusic.play();
        if (enemy.health <= 0) {
          if (liquedLuckPower) {
            score += 20;
          } else {
            score += 10;
          }
          if (Math.random() < 1) {
            currentPowerUp =
              consumables[Math.floor(Math.random() * consumables.length)];
            powerUp = {
              hx: enemy.hx,
              hy: enemy.hy,
              hitboxWidth: 32,
              hitboxHeight: 32,
              spawnTime: Date.now(),
            };
            consumableImage = new Image();
            consumableImage.src = currentPowerUp.image;
          }
          enemies.splice(index, 1);
          enemyLevel -= 1;
        }
      } else {
        swingMusic.play();
      }

      if (enemyLevel <= 0) {
        level += 1;
        nextLevel();
      }
    });

    attack = false;
    damage = 10;
  }

  context.fillStyle = "green";
  context.fillStyle = "cyan";
  if (animation < 4) {
    context.drawImage(
      playerImage,
      player.frameX * player.width + 576 * animation,
      player.frameY * player.height,
      player.width,
      player.height,
      player.x,
      player.y,
      player.width,
      player.height
    );
  } else {
    context.drawImage(
      playerImage,
      player.frameX * player.width + 576 * (animation - 4),
      576 + player.frameY * player.height,
      player.width,
      player.height,
      player.x,
      player.y,
      player.width,
      player.height
    );
  }
  if (sprint === 3 && player.stamina > 0) {
    player.stamina -= player.staminaLoss;
    if (player.stamina <= 0) {
      player.stamina = 0;
      sprint = 1;
    }
  } else if (player.stamina <= 0) {
    player.stamina = 0;
    sprint = 1;
  }

  if (sprint === 1 && player.stamina < player.maxStamina) {
    player.stamina += player.staminaRegen;
    if (player.stamina > player.maxStamina) {
      player.stamina = player.maxStamina;
    }
  }
  if (chargingAttack) {
    sprint = 0.5;
    player.frameX = 1;
    animation = animations.attack;
    damage += 5;
  }
  if (defending) {
    player.frameX = 1;
    animation = animations.defend;
  } else if (
    (moveLeft || moveRight || moveUp || moveDown) &&
    !(moveLeft && moveRight) &&
    !defending
  ) {
    player.frameX = (player.frameX + 1) % 4;
  } else if (!defending) {
    player.frameX = (player.frameX + 1) % 4;
  }

  //  movement

  if (moveRight) {
    player.x = player.x + player.xChange * sprint;
    // player.frameY = 2;
    if (defending) {
      player.frameX = 1;
      animation = animations.defend;
    }
    else if (sprint) {
      animation = animations.run;
    }
     else {
      animation = animations.walk;
    }
    player.frameY = DIRECTIONS.right;
  }
  if (moveUp) {
    player.y = player.y - player.yChange * sprint;
    if (defending) {
      player.frameX = 1;
      animation = animations.defend;
    }
    else if (sprint === 3) {
      animation = animations.run;
    } else {
      animation = animations.walk;
    }
    player.frameY = DIRECTIONS.up;
  }
  if (moveDown) {
    player.y = player.y + player.yChange * sprint;
    
    if (defending) {
      player.frameX = 1;
      animation = animations.defend;
    }
    else if (sprint === 3) {
      animation = animations.run;
    } else{
      animation = animations.walk;
    }
    player.frameY = DIRECTIONS.down;
  }
  if (moveLeft) {
    player.x = player.x - player.xChange * sprint;
    if (defending) {
      player.frameX = 1;
      animation = animations.defend;
    }
    else if (sprint) {
      animation = animations.run;
    } else  {
      animation = animations.walk;
    }
    player.frameY = DIRECTIONS.left;
  }
  if (player.x < -49) player.x = -49;
  if (player.x + player.width > canvas.width + 49)
    player.x = canvas.width + 49 - player.width;
  if (player.y < -49) player.y = -49;
  if (player.y + player.height > canvas.height + 49)
    player.y = canvas.height + 49 - player.height;
  if (player.health <= 0) {
    stop(score)
    gameOver = true
    animation = animations.death;
    player.xChange = player.yChange = 0;
    context.fillStyle = "rgba(0,0,0,0.7)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "black";
    context.lineWidth = 10;
    context.font = "100px Arial";
    context.strokeText(`GAME OVER`, canvas.width / 4, canvas.height / 2);
    context.fillStyle = "yellow";
    context.fillText(`GAME OVER`, canvas.width / 4, canvas.height / 2);
    context.fillStyle = "white";
  context.font = "40px Arial";
  context.fillText(`Press R to Restart`, canvas.width / 4, canvas.height / 2 + 80);
  }
  if (hennessyPower) {
    hentimer -= 1;
    if (hentimer > 0) {
      context.fillStyle = "rgba(0,0,0)";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
  if (powerUp && consumableImage.complete) {
    context.drawImage(consumableImage, powerUp.hx, powerUp.hy, 48, 48);

    if (Date.now() - powerUp.spawnTime > 300 && collides(player, powerUp)) {
      if (currentPowerUp.name === "hennessy") {
        player.health = 100;
        player.stamina = player.maxStamina;
        if (Math.random() < 0.5) {
          henMusic.play();
        } else {
          hen2Music.play();
        }
        hennessyPower = true;
      } else if (currentPowerUp.name === "marlboro") {
        if (Math.random() < 0.5) {
          marMusic.play();
        } else {
          mar2Music.play();
        }
        marlboroPower = true;
      } else if (currentPowerUp.name === "liquedLuck") {
        drink.play();

        liquedLuckPower = true;
      } else if (currentPowerUp.name === "comp") {
        code.play();
        compPower = true;
      } else if (currentPowerUp.name === "pinkMonster") {
        red40.play();
        pinkMonsterPower = true;
      } else if (currentPowerUp.name === "naughtyOnes") {
        naughtyOnesPower = true;
        rightBois.play();
      }

      powerTimer = 1000;
      powerUp = null;
    }
  }
  context.font = "30px Arial";
  context.strokeText(`Level: ${level}`, 900, 40);
  context.fillText(`Level: ${level}`, 900, 40);
  // Player Heath
  let barWidth = 300;
  let barHeight = 30;
  context.fillStyle = "grey";
  context.fillRect(20, 670, barWidth, barHeight);
  context.fillStyle = "red";
  context.fillRect(20, 670, (player.health / 100) * barWidth, barHeight);
  context.strokeStyle = "black";
  context.strokeRect(20, 670, barWidth, barHeight);
  //player stamina
  context.fillStyle = "grey";
  context.fillRect(340, 670, barWidth, barHeight);

  context.fillStyle = "yellow";
  context.fillRect(
    340,
    670,
    (player.stamina / player.maxStamina) * barWidth,
    barHeight
  );

  context.strokeStyle = "black";
  context.strokeRect(340, 670, barWidth, barHeight);

  // Power up
  context.fillStyle = "grey";
  context.fillRect(660, 670, barWidth, barHeight);

  context.fillStyle = "cyan";
  context.fillRect(660, 670, (powerTimer / 1000) * barWidth, barHeight);

  context.strokeStyle = "black";
  context.strokeRect(660, 670, barWidth, barHeight);

  context.strokeStyle = "black";
  context.lineWidth = 5;
  context.font = "30px Arial";
  context.strokeText(`Score: ${score}`, 1100, 40);
  context.fillText(`Score: ${score}`, 1100, 40);

  if (powerTimer > 10) {
    context.strokeStyle = "black";
    context.lineWidth = 10;
    context.font = "70px Arial";
    context.strokeText(`${currentPowerUp.effect}`, 20, 70);
    context.fillStyle = "blue";
    context.fillText(`${currentPowerUp.effect}`, 20, 70);
  }
}

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function activate(event) {
  let key = event.key;
  if (
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight" ||
    event.key === "ArrowUp" ||
    event.key === "ArrowDown" ||
    event.key === "Shift"
  ) {
    event.preventDefault();
  }
  if (key === "ArrowLeft" || key === "A" || key == "a") {
    moveLeft = true;
 
  } else if (key === "ArrowUp" || key === "W" || key == "w") {
    moveUp = true;
 
  } else if (key === "ArrowRight" || key === "D" || key == "d") {
    moveRight = true;

  } else if (key === "ArrowDown" || key === "S" || key == "s") {
    moveDown = true;

  } else if (key === "Shift" && player.stamina > 0) {
    sprint = 3;
  } else if (key === "e" || (key === "E" )) {
    crashOut = true;
  } else if (key === "c" || key === "C") {
    document.getElementById("characterSelect").style.display = "block";
    document.querySelector("canvas").style.display = "none";
  } else if (key === "T" || (key === "t" )) {
    hennessyPower = true;
    marlboroPower= false
    liquedLuckPower = false
    compPower = false
    pinkMonsterPower =false
    naughtyOnesPower = false
    powerTimer = 1000
    hen2Music.play()
  
  }
  else if (key === "Y" || (key === "y" )) {
    hennessyPower = false;
    marlboroPower= true
    liquedLuckPower = false
    compPower = false
    pinkMonsterPower =false
    naughtyOnesPower = false
    powerTimer = 1000
    mar2Music.play()
  }
   else if (key === "U" || (key === "u")) {
    hennessyPower = false;
    marlboroPower= false
    liquedLuckPower = true
    compPower = false
    pinkMonsterPower =false
    naughtyOnesPower = false
    powerTimer = 1000
    drink.play()
  } else if (key === "I" || (key === "i")) {
    hennessyPower = false;
    marlboroPower= false
    liquedLuckPower = false
    compPower = true
    pinkMonsterPower =false
    naughtyOnesPower = false
    powerTimer = 1000
    code.play()
  } else if (key === "O" || (key === "o")) {
    hennessyPower = false;
    marlboroPower= false
    liquedLuckPower = false
    compPower = false
    pinkMonsterPower =true
    naughtyOnesPower = false
    powerTimer = 1000
    red40.play()
  }
  else if (key === "p" || key === "P") {
    hennessyPower = false;
    marlboroPower= false
    liquedLuckPower = false
    compPower = false
    pinkMonsterPower =false
    naughtyOnesPower = true
    powerTimer = 1000
    rightBois.play()}
    else if(key === "r" || key ==="R"){
      gameOver = false
      window.location.reload();


    }
}
function deactivate(event) {
  let key = event.key;
  if (key === "ArrowLeft" || key === "A" || key == "a") {
    moveLeft = false;
    animation = animations.wait;
  } else if (key === "ArrowUp" || key === "W" || key == "w") {
    moveUp = false;
    animation = animations.wait;
  } else if (key === "ArrowRight" || key === "D" || key == "d") {
    moveRight = false;
    animation = animations.wait;
  } else if (key === "ArrowDown" || key === "S" || key == "s") {
    moveDown = false;
    animation = animations.wait;
  } else if (key === "Shift") {
    sprint = 1;
  } else if (key === "e" || (key === "E" && player.stamina > 0)) {
    crashOut = false;
  }
}
function stop(score){
  if (scoreSent) return; 
  scoreSent = true;
  window.removeEventListener("keydown",activate,false);
  window.removeEventListener("keyup",deactivate,false);

  let data = new FormData()
  data.append("score",score)
  xhttp = new XMLHttpRequest()
  xhttp.addEventListener("readystatechange", handle_response, false);
  xhttp.open("POST", "/store_score", true);
  xhttp.send(data);
}
function handle_response(){
  if ( xhttp.readyState === 4 ) {
    if ( xhttp.status === 200 ) {
      if ( xhttp.responseText === "success" ) {
        console.log("Yes");
      } else {
        console.log("No");
  }
     } }}



function activateMouse(event) {
  if (event.button === 0 && player.stamina > 0) {
    chargingAttack = true;
  } else if (event.button === 2) {
    defending = true;
  } else if (event.button === 1 && player.stamina > 50) {
    spawnDart();
  }
}
function deactivateMouse(event) {
  if (event.button === 0 && player.stamina > 0) {
    chargingAttack = false;
    player.stamina -= 30;
    animation = animations.attack;
    moveLeft = moveRight = moveUp = moveDown = false;
    player.frameX = 0;
    attack = true;
  } else if (event.button === 2) {
    animation = animations.wait;
    defending = false;
  }
}



function collides(obj1, obj2) {
  if (
    obj1.hx + obj1.hitboxWidth < obj2.hx ||
    obj1.hx > obj2.hx + obj1.hitboxWidth ||
    obj1.hy + obj1.hitboxHeight < obj2.hy ||
    obj1.hy > obj2.hy + obj2.hitboxHeight
  ) {
    return false;
  } else {
    return true;
  }
}

function circleCol(obj1, obj2) {
  dx1 = obj1.hx + obj1.hitboxWidth / 2;
  dy1 = obj1.hy + obj1.hitboxHeight / 2;
  dx2 = obj2.hx + obj2.hitboxWidth / 2;
  dy2 = obj2.hy + obj2.hitboxHeight / 2;

  let distance = Math.sqrt(
    (dx2 - dx1) * (dx2 - dx1) + (dy2 - dy1) * (dy2 - dy1)
  );
  if (distance < obj1.viewRadius) {
    return true;
  } else {
    return false;
  }
}
function colidesSuround(obj1, obj2) {
  if (
    obj1.hx + obj1.hitboxWidth < obj2.hx ||
    obj1.hx > obj2.hx + obj1.hitboxWidth ||
    obj1.hy + obj1.hitboxHeight < obj2.hy
  ) {
    return false;
  } else {
    return true;
  }
}


function nextLevel() {
  number += 5;
  enemyLevel = number;
  for (let i = 0; i < number; i +=1) spawnEnemy();
}
let currentIndex = 0;
function updateCharacter() {
  const characterImage = document.getElementById("characterImage");
  const charName = document.getElementById("charName");

  characterImage.src = characters[currentIndex].image;
  charName.textContent = characters[currentIndex].name;
}

function prev() {
  currentIndex = (currentIndex - 1 + characters.length) % characters.length;
  updateCharacter();
}

function next() {
  currentIndex = (currentIndex + 1) % characters.length;
  updateCharacter();
}
function selectCharacter() {
  selectPlayer(currentIndex);
}
window.onload = updateCharacter;
function load_assets(assets, callback) {
  let num_assets = assets.length;
  let loaded = function () {
    console.log("loaded");
    num_assets = num_assets - 1;
    if (num_assets === 0) {
      callback();
    }
  };
  for (let asset of assets) {
    let element = asset.var;
    if (element instanceof HTMLImageElement) {
      console.log("img");
      element.addEventListener("load", loaded, false);
    } else if (element instanceof HTMLaudioElement) {
      consol.log("audio");
      element.addEventListener("canplaytrough", loaded, false);
    }
    element.src = asset.url;
  }
}
