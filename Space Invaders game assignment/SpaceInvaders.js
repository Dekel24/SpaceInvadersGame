//����� �� ����� ����� ��� ������ ��
var ctx; 
//����� �� ������� ������� �����
var player = new Image();
var invader = new Image();
var background = new Image();
var shoter = new Image();
//���� ������� �����
var enemies = new Array();
//������ ������� ��� ����� ���� �� �� , ����� ������ ������ ������� ������ ��� ����� ���� �� ��
var counter = 0;
var win = false;
var lose = false;
//������ ������� ������ �����
for (var i = 0; i < 10; i++) {
    enemies.push({
        x: i * 100 + 20 * i,
        y: 50,
        killed: 0,
        side: 1
    });
}
//������ ����� ������ ����
var hero = {
    y:700,
    x: 550
};
//������ ������ ������ ����
var shot = {
    x: hero.x + 25,
    y: hero.y,
    handleShot: -1
};
//����� ����� ������� ���� �� �����
gameLoop();
//����� ������ ������ �� �������� ��� ���� ���� 15 ����� ������ �����
setTimeout("fasterEnemies()", 15000);
//���� �� ������� �� ��� ����� ���� ����� ���
function inIt() {
    ctx = document.getElementById("canvas").getContext('2d');
    player.src = 'images/player1.png';
    invader.src = 'images/invader1.png';
    background.src = 'images/background.jpeg';
    shoter.src = 'images/shot1.png';
    player.onload = function () {
        drawAll();
    }
    invader.onload = function () {
        drawAll();
    }
    background.onload = function () {
        drawAll();
    }
    shoter.onload = function () {
        drawAll();
    }
}


//���� �� ����� �� ����� ����� ���� ���� ���, �� ��� ��� ����� ��� ����� ��� �10 ����� ��� ����� ����� ����, �� ��� ��� ����� ��� ����� ���� ����, ����� ��� ����� ����� ����
//����� ���� �� ��� ����� ����� ������ ���� ����� ����� 
document.onkeydown = function (key) {
    if (key.keyCode === 37) {
        hero.x -= 10;
        drawAll();
    }
    else if (key.keyCode === 39) {
        hero.x += 10;
        drawAll();
    }
    else if (key.keyCode === 32) {
        if (shot.handleShot == -1) {
            shot.x = hero.x + 25;
            shot.handleShot = setInterval("drawShot();", 5);
        }
    }
}

//����� �� ������� �� ��� �����, ����� ������ �� ���� ������ ��� ���� �� ������ ����
function moveEnemy() {
    if (lose != true && win != true) {
        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i].killed == 0)
                ctx.drawImage(invader, enemies[i].x, enemies[i].y, 50, 50);
        }
    }
}

//����� �� ������, ������ ���� ����� ������ ���� ����� ������ ���� �����
function drawShot() {
    if (lose != true && win != true) {
        drawAll();
        ctx.drawImage(shoter, shot.x - 20, shot.y, 40, 40);
        shot.y -= 2;
        if (shot.y <= 0) {
            clearInterval(shot.handleShot);
            shot.handleShot = -1;
            shot.y = hero.y;
        }
    }
}

//����� �� ����� �� ��� �����
function moveHero() {
    if (lose != true && win != true) {
        checkBorders();
        ctx.drawImage(background, 0, 0, 1200, 800);
        ctx.drawImage(player, hero.x, hero.y, 50, 50);
    }
}

//����� ������ ������ ����� - ����� �� ��� ����� �� ����� 
function gameLoop() {
    setTimeout("gameLoop()", 10);
    checkKill();
    CheckGame();
    KillHero();
}

//����� ������ ��� ����� ��� ������� �����, ������� ���� ���� ����� ����� ����� ��� ��� ����� ����
function checkBorders() {
    if (hero.x >= 1150) {
        hero.x = 1150;
    }
    else if (hero.x <= 0) {
        hero.x = 0;
    }
}

//����� ������ �� �� ������ ������ �� ����� ���������, ��� ���� �� ���� ������ ���� ����� ��� �� ����� ����� ����� �� ��� ����� �����
function drawAll() {
    moveHero();
    moveEnemy();
}

//����� ������ ��� ������ ���� ������, ����� ��� ������ ������ �� ������ ����� ������� ����, ������ �� ������ ������ ���� �����
function checkKill() {
    for (var i = 0; i < enemies.length; i++) {
        if (shot.y <= enemies[i].y + 35 && shot.y >= enemies[i].y - 35 && enemies[i].killed == 0) {
            if (shot.x <= enemies[i].x + 35 && shot.x >= enemies[i].x - 35 && shot.handleShot !=-1) {
                clearInterval(shot.handleShot);
                shot.handleShot = -1;
                shot.y = hero.y;
                enemies[i].killed = 1;
                drawAll();
            }
        }
    }
}

//����� ������ �� �������� ��� ��� ������� ���� ���� ��� ��� ������ ���� �����
function MovingEnemy() {
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].x += enemies[i].side * 10
        drawAll();
        if (enemies[i].x >= 1150) {
            enemies[i].y += 80;
            enemies[i].side = -1;
        }
        else if (enemies[i].x <= 0) {
            enemies[i].y += 80;
            enemies[i].side = 1;
        }
    }
}
//����� �� ����� �� ������� �� 4/5����� �����
setInterval("MovingEnemy()", 80);

//����� ������ ��� ����� ��� �� �� ������� ����� �� �����
//����� ������ ���� �� ������ ����� ������ ������ ������: ����� �� �����
function CheckGame() {
    if (lose != true) {
        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i].killed == 1)
                counter++;
        }
        if (counter == enemies.length && win == false) {
            win = true;
            clearInterval("gameLoop()");
            clearInterval("MovingEnemy()");
            ctx.font = "100px Arial";
            ctx.fillStyle = "#fff";
            ctx.fillText("YOU WON THE GAME", 75, 400);
        }
        else
            counter = 0;
    }
}

//����� ������ ��� ��� ������ ���� ����� ������ �����
//����� ������ ����� �� ������ ����� ������ ������� ������: ����� ����
function KillHero() {
    if (lose != true && win != true) {
        for (var i = 0; i < enemies.length; i++) {
            if (hero.y <= enemies[i].y + 25 && hero.y >= enemies[i].y - 25 && enemies[i].killed == 0) {
                if (hero.x <= enemies[i].x + 25 && hero.x >= enemies[i].x - 25) {
                    lose = true;
                    clearInterval("gameLoop()");
                    clearInterval("MovingEnemy()");
                    ctx.font = "100px Arial";
                    ctx.fillStyle = "#fff";
                    ctx.fillText("Game OVER", 200, 400); 
                }
            }
        }
    }
}

//����� �� ������ �� ������ ���� �� ������� ����, ������ ���� ������� ���� 
function fasterEnemies() {
    clearInterval("MovingEnemy()");
    setInterval("MovingEnemy()", 60);
}

//������ ��, ��� ����� �� ������ - ���� ���� ���� ���� ����� ����� ����
function buttonClick() {
    document.location.reload();
}