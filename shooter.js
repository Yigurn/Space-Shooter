"use strict"

var ship;
var bullet = [];
var bulletCount = 20;
var asts = [];
var astCount = 20;
var points = 0;
var ctx;

function getPoints(cScore) {
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie;
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  points = ca[1];
  return ca;
}

function checkPoints() {
    var cScore = getPoints();
    if (cScore != "") {
      alert("You have " + cScore + " points.");
    }
}

function setPoints() {
  document.cookie = "Points;" + points + ";path=/";
}

function setCookie(cname,exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + points + ";" + expires + ";path=/";
}
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function checkCookie() {
  var user=getCookie("cScore");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
     user = prompt("Please enter your name:","");
     if (user != "" && user != null) {
       //setCookie("username", user, 30);
     }
  }
}

var screen = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function score() {
    ctx.font = "16px Arial"
    ctx.fillStyle = "#FF0000";
    ctx.fillText("Points: " + points, 20, 20);
}

function updateGameArea() {
    screen.clear();
    ship.newPos();
    ship.update();
    for (var i = 0; i < astCount; i++)
    {
    asts[i].newPos();
    asts[i].update();
    }
    for (var i = 0; i < bulletCount; i++) {
        bullet[i].newPos();
        bullet[i].update();
    }
    score();
    //setPoints();
    setCookie("cScore", 10);
}

function Object(width, height, x, y, angle, colour, shape) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.colour = colour;
    this.shape = shape;
    this.speed = 0;
    this.update = function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.save();
        ctx.restore();
        ctx.rotate(this.angle);
        ctx.fillStyle = colour;
        ctx.fill(tri);
        ctx.restore();
    }
}


function Bullet(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 0;
    this.count = 0;
    this.shot = false;
    this.update = function() {
        if (this.count >= 2) {
            this.shot = false;
            this.count = 0;
        }
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, 5, 5);
        ctx.restore();
    }
    this.newPos = function() {
        if (this.shot) {
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
        if (this.x - 5 > screen.canvas.width) {
            this.count++;
            this.x = 0;
        }
        if (this.x + 5< 0) {
            this.count++;
            this.x = screen.canvas.width;
        }
        if (this.y - 5> screen.canvas.height) {
            this.count++;
            this.y = 0;
        }
        if (this.y + 5< 0) {
            this.count++;
            this.y = screen.canvas.height;
        }
        }
        else {
            this.x = -1;
            this.y = -1;
        }
    }
    return this;
}

function Ast(width, height, x, y, angle, size) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.size = size;
    this.angle = Math.random()*6;
    this.speed = 1;
    this.shot = false;
    this.dead = false;
    this.update = function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.save();
        ctx.restore();
        ctx.rotate(this.angle);
        var ast = new Path2D();
        ast.moveTo(x, y);
        ast.lineTo(x, y - height/2);
        ast.lineTo(x + width/4, y - height/4);
        ast.lineTo(x + width/4, y);
        ast.lineTo(x + width/2, y - height/8);
        ast.lineTo(x + width/2, y + height/4);
        ast.lineTo(x, y + height/2);
        ast.lineTo(x - width/2, y + height/4);
        ast.lineTo(x - width/4, y - height/4);
        ctx.fillStyle = "white";
        ctx.fill(ast);
        ctx.restore();

        for (var i = 0; i < bulletCount; i++) {
            if (bullet[i].shot && bullet[i].x < this.x + width/2 && bullet[i].x > this.x - width/2 && bullet[i].y < this.y + height/2 && bullet[i].y > this.y - height/2) {
                this.shot = true;
                bullet[i].shot = false;
                points++;
                this.size--;
            //    if (this.size < 1)
            //    {
            //        this.dead = true;
            //        this.x = 1000;
            //    }
            }
        }
        if (ship.x < this.x + width/2 && ship.x > this.x - width/2 && ship.y < this.y + height/2 && ship.y > this.y - height/2) {
        ship.x = 300;
        ship.y = 300;
        ship.speed = 0;
        ship.faceAngle = 0;
        points = 0;

        for (var i = 0; i < bulletCount; i++) {
            bullet[i].shot = false;
        }
                for (var i = 0; i < astCount; i++) {
                    asts[i].shot = true;
                }
        }
    }
    this.newPos = function() {
        if (!this.shot && !this.dead) {
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
        if (this.x - 40 > screen.canvas.width) {
            this.x = 0;
        }
        if (this.x < 0) {
            this.x = screen.canvas.width;
        }
        if (this.y > screen.canvas.height) {
            this.y = 0;
        }
        if (this.y < 0) {
            this.y = screen.canvas.height;
        }
        }
        else {
            this.x = 1000;
            this.y = 1000;
            this.shot = false;
            this.angle = Math.random()*6;
        }
    }
    return this;
}

function shoot() {
    for (var i = 0; i < bulletCount ; i++)
    {
        if (!bullet[i].shot) {
            bullet[i].shot = true;
            bullet[i].speed = 5;
            bullet[i].x = ship.x;
            bullet[i].y = ship.y;
            bullet[i].angle = ship.faceAngle;
            break;
        }
    }
}

function ship(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.angle = 0;
    this.faceAngle = 0;
    this.moveAngle = 0;

    this.update = function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.save();
        ctx.restore();
        ctx.rotate(this.faceAngle);
        var tri = new Path2D();
        tri.moveTo(x, y);
        tri.lineTo(x + width/2, y + height);
        tri.lineTo(x - width/2, y + height);
        ctx.fillStyle = "white";
        ctx.fill(tri);
        ctx.restore();
    }

    this.newPos = function() {
        this.faceAngle += this.angle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.moveAngle);
        this.y -= this.speed * Math.cos(this.moveAngle);
        if (this.x - 40 > screen.canvas.width)
            this.x = 0;
        if (this.x < 0)
            this.x = screen.canvas.width;
        if (this.y > screen.canvas.height)
            this.y = 0;
        if (this.y < 0)
            this.y = screen.canvas.height;
    }
}

function keyPush(evt) {
    switch(evt.keyCode) {
        case 32:
        //Left
            //bullet = new Bullet(ship.x, ship.y, ship.faceAngle);
            shoot();
            break;
        case 37:
        //Left
            ship.angle = -3;
            break;
        case 38:
        //Up
            ship.speed = 3;
            ship.moveAngle = ship.faceAngle;
            break;
        case 39:
        //Right
            ship.angle = 3;
            break;
        case 40:
        //Down
            ship.speed -= 0.3;
            ship.moveAngle = ship.faceAngle;
            break;
    }
}

function keyStop(evt) {
    switch(evt.keyCode) {
        case 37:
        //Left
        ship.angle = 0;
            break;
        case 38:
        //Up
            //ship.speed= 1;
            ship.moveAngle = ship.faceAngle;
            break;
        case 39:
        //Right
            ship.angle = 0;
            break;
        case 40:
        //Down
            ship.speed= 0;
            ship.moveAngle = ship.faceAngle;
            break;
    }
}

window.onload = function () {
    getPoints();
    for (var i = 0; i < bulletCount; i++)
    {
        bullet[i] = new Bullet(ship.x/2, ship.y/2, ship.faceAngle);
    }
    for (var i = 0; i < astCount; i++)
    {
        asts[i] = new Ast(Math.random()*30 + 40, Math.random()*30 + 40, 0, 0, 2, Math.floor(Math.random()*3) + 1);
    }
    ship = new ship(20, 40, 0, -20);
    screen.start();
    document.addEventListener("keydown",keyPush);
    document.addEventListener("keyup",keyStop);
    ship.x = 200;
    ship.y = 200;
    ctx = screen.context;
}

//Condense similar functions
//functionise commons
//breakapart asts
