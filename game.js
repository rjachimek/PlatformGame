(function () {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 500;
const cw = canvas.width;
const ch = canvas.height;
let holdRight = false;
let holdLeft = false;
let jumping = false;
const gravity = 0.6;
const friction = 0.9;
let win = 0;
let jmpVar = 0; 
let enemySpeed = 4;
let defeat = 3;
let player = {
  x: cw / 2,
  y: ch - 20,
  width: 15,
  height: 15,
  speed: 3,
  speedX: 0,
  speedY: 0,
  onGround: false
};
let goal = {
  x: Math.random() * cw,
  y: ch - 300,
  width: 10,
  height: 10,
};
const enemy = {
  x: 50,
  y: ch - 15,
  width: 15,
  height: 15,
};

let platforms = []
for (i = 0; i < 15; i++) {
  platforms.push({
    x: Math.random() * cw,
    y: Math.random() * ch - 60,
    width: Math.random() * 100 + 40,
    height: 10
  });
}

function update() {

  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  if (holdLeft == true) {
    if (player.speedX > -player.speed) {
      player.speedX--;
    }
  }

  if (jumping == true) {
    if (jmpVar == 0) {
      player.speedY = -player.speed * 5;
      jmpVar = 1;
    }
  }

  if (holdRight == true) {
    if (player.speedX < player.speed) {
      player.speedX++;
    }
  }

  player.speedX *= friction;
  player.speedY += gravity;
  player.x += player.speedX;
  player.y += player.speedY;

  enemy.x += enemySpeed;
  if (enemy.x >= cw - enemy.width) {
    enemySpeed = -4;
  } else if (enemy.x <= 0) {
    enemySpeed = 4;
  }


  if (player.x >= cw - player.width) {
    player.x = cw - player.width;
  } else if (player.x <= 0) {
    player.x = 0;
  }

  if (player.y >= ch - player.height) {
    player.y = ch - player.height;
    jumping = false;
    jmpVar = 0;
  }

  ctx.clearRect(0, 0, cw, ch);
  ctx.fillStyle = "black";
  ctx.beginPath();

  player.onGround = false;
  for (let i = 0; i < platforms.length; i++) {
    ctx.rect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
    let dir = colCheck(player, platforms[i]);
    if (dir === "left" || dir === "right") {
      player.speedX = 0;
      jumping = false;
      jmpVar = 0;
    } else if (dir === "bottom") {
      player.onGround = true;
      jumping = false;
      jmpVar = 0;
    } else if (dir === "top") {
      player.speedY *= -1;
    }
  }
  if (player.onGround) {
    player.speedY = 0;
  }

  goalCheck(player, goal);
  enemyCheck(player, enemy);

  ctx.fill();
  ctx.fillStyle = '#afdcfa';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = '#fffb00';
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

  ctx.fillStyle = '#ff0000';
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

  requestAnimationFrame(update);
}

function keyDown(event) {
  switch (event.keyCode) {
    case 37:
      holdLeft = true;
      break;
    case 38:
      jumping = true;
      player.onGround = false;
      break;
    case 39:
      holdRight = true;
      break;
  }
}

function keyUp(event) {
  switch (event.keyCode) {
    case 37:
      holdLeft = false;
      break;
    case 38:
      jumping = false;
      break;
    case 39:
      holdRight = false;
      break;
  }
}

function colCheck(shapeA, shapeB) {
  let vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
    vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
    hWidths = (shapeA.width / 2) + (shapeB.width / 2),
    hHeights = (shapeA.height / 2) + (shapeB.height / 2),
    colDir = null;

  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    let oX = hWidths - Math.abs(vX),
      oY = hHeights - Math.abs(vY);
    if (oX >= oY) {
      if (vY > 0) {
        colDir = "top";
        shapeA.y += oY;
      } else {
        colDir = "bottom";
        shapeA.y -= oY;
      }
    } else {
      if (vX > 0) {
        colDir = "left";
        shapeA.x += oX;
      } else {
        colDir = "right";
        shapeA.x -= oX;
      }
    }
  }
  return colDir;
}

function goalCheck(shapeA, shapeB) {
  if (win == 3) {
    if (!alert("You won")) {
      window.location.reload();
    }
  } else if (colCheck(shapeA, shapeB) !== null) {
    win++;
    goal = {
      x: Math.random() * cw,
      y: ch - 300,
      width: 10,
      height: 10,
    }
  }
}

function enemyCheck(shapeA, shapeB) {
  if (defeat == 0) {
    if (!alert("You lost")) {
      window.location.reload();
    }
  } else if (colCheck(shapeA, shapeB) !== null) {
    defeat--;
    document.getElementById("lifes").innerText = `lifes: ${defeat}`;
    player = {
      x: cw / 2,
      y: ch - 100,
      width: 15,
      height: 15,
      speed: 3,
      speedX: 0,
      speedY: 0,
      onGround: false
    }
  }
}

window.addEventListener("load", function () {
  update();
});