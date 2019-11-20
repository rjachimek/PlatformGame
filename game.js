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
let jmpVar = 0; // zmienna która sprawia że klocek nie odlatuje, tymaczasowe rozwiązanie
player = {
  x: cw / 2,
  y: ch - 20,
  width: 10,
  height: 10,
  speed: 3,
  speedX: 0,
  speedY: 0,
  onGround: false
};

let platforms = []
for (i = 0; i < 15; i++) {
  platforms.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
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
  for (var i = 0; i < platforms.length; i++) {
    ctx.rect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);

    var dir = colCheck(player, platforms[i]);

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

  if(player.onGround){
    player.speedY = 0;
}


  ctx.fill();

  ctx.fillStyle = '#afdcfa';
  ctx.fillRect(player.x, player.y, player.width, player.height);

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
  var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
    vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
    hWidths = (shapeA.width / 2) + (shapeB.width / 2),
    hHeights = (shapeA.height / 2) + (shapeB.height / 2),
    colDir = null;

  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    var oX = hWidths - Math.abs(vX),
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



window.addEventListener("load", function () {
  update();
});