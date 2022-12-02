//הצהרה על משתנה הקנבס כדי להשתמש בו
var ctx; 
//הצהרה על התמונות המשמשות בקנבס
var player = new Image();
var invader = new Image();
var background = new Image();
var shoter = new Image();
//מערך המפלצות במשחק
var enemies = new Array();
//משתנים הבודקים האם המשחק נגמר או לא , ומונה המתקשר לספירת המפלצות לבדיקה האם המשחק נגמר או לא
var counter = 0;
var win = false;
var lose = false;
//תכונות המפלצות והצהרה עליהן
for (var i = 0; i < 10; i++) {
    enemies.push({
        x: i * 100 + 20 * i,
        y: 50,
        killed: 0,
        side: 1
    });
}
//תכונות השחקן והצהרה עליו
var hero = {
    y:700,
    x: 550
};
//תכונות הירייה והצהרה עליה
var shot = {
    x: hero.x + 25,
    y: hero.y,
    handleShot: -1
};
//הפעלת לולאת הבדיקות הרצה כל המשחק
gameLoop();
//הפעלת הפעולה המזיזה את האוייבים מהר יותר לאחר 15 שניות מתחילת המשחק
setTimeout("fasterEnemies()", 15000);
//מציג את התמונות על גבי הקנבס לאחר טעינת הדף
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


//מזיז את השחקן על הקנבס בהתאם למקש עליו לחץ, אם לחץ מקש שמאלי ערך האיקס ירד ב10 ולאחר מכן תודפס הדמות מחדש, אם לחץ מקש ימיני ערך האיקס יעלה בעשר, ולאחר מכן תודפס הדמות מחדש
//במידה ולחץ על מקש הרווח תודפס הירייה ותצא מאמצע השחקן 
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

//מדפיס את המפלצות על גבי הקנבס, במידה והמשחק לא נגמר ובמידה ולא הרגו את המפלצת בעבר
function moveEnemy() {
    if (lose != true && win != true) {
        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i].killed == 0)
                ctx.drawImage(invader, enemies[i].x, enemies[i].y, 50, 50);
        }
    }
}

//מדפיס את הירייה, ומחזיר אותה לשחקן ומעלים אותה במידה והגיעה לקצה הקנבס
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

//מדפיס את השחקן על גבי הקנבס
function moveHero() {
    if (lose != true && win != true) {
        checkBorders();
        ctx.drawImage(background, 0, 0, 1200, 800);
        ctx.drawImage(player, hero.x, hero.y, 50, 50);
    }
}

//פעולה המריצה פעולות בדיקה - פעולה זו רצה לאורך כל המשחק 
function gameLoop() {
    setTimeout("gameLoop()", 10);
    checkKill();
    CheckGame();
    KillHero();
}

//פעולה הבודקת האם השחקן חרג מגבולות הקנבס, ומחזירה אותו לקצה הקנבס במידת הצורך כדי שלא יחרוג ממנו
function checkBorders() {
    if (hero.x >= 1150) {
        hero.x = 1150;
    }
    else if (hero.x <= 0) {
        hero.x = 0;
    }
}

//פעולה הכוללת את כל פעולות ההדפסה של השחקן והאוייבים, כדי ליעל את שיטת ההדפסה וכדי לדאוג שכל מה שצריך להיות מודפס על גבי הקנבס יודפס
function drawAll() {
    moveHero();
    moveEnemy();
}

//פעולה הבודקת האם הירייה פגעה במפלצת, במידה וכן הפעולה מחזירה את הירייה לשחקן ומעלימה אותה, והופכת את המפלצת למפלצת שכבר נפסלה
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

//פעולה המזיזה את האוייבים מצד לצד ומורידה אותם שורה בכל פעם שהגיעו לקצה הקנבס
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
//מפעיל את פעולה זו בתדירות של 4/5עשרית שנייה
setInterval("MovingEnemy()", 80);

//פעולה הבודקת האם השחקן הרג את כל המפלצות וניצח את המשחק
//במידה והשחקן ניצח כל פעולות המשחק ייפסקו ותופיע ההודעה: ניצחת את המשחק
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

//פעולה הבודקת האם אחת המלצות נגעה בשחקן והשחקן הפסיד
//במידה והשחקן הפסיד כל פעולות המשחק ייפסקו ותופיעה ההודעה: המשחק נגמר
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

//פעולה זו מגדילה את תדירות הזמן בה המפלצות זזות, והופכת אותן למהירות יותר 
function fasterEnemies() {
    clearInterval("MovingEnemy()");
    setInterval("MovingEnemy()", 60);
}

//בפעולה זו, בעת לחיצה על הכפתור - האתר יטען מחדש ובכך המשחק יתחיל מחדש
function buttonClick() {
    document.location.reload();
}