const container = document.querySelector(".container");
const scoreCard = document.querySelector(".score-card");
const bird = document.querySelector(".bird");
const birdIMG = document.querySelector(".bird img");
const ground = document.querySelector(".ground");

const gameOverDialog = document.querySelector(".game-over-dialog");
const playAgainBtn = document.querySelector(".play-again");
const finalScore = document.querySelector(".score");
gameOverDialog.showModal();
gameOverDialog.close();




let obstacles = [];
let collision = false;
const gravity = 3;
const obstacleSpeed = 7;
const jumpDistance = 80;
const obstacleSpawnInterval = 500;
let birdY = 0;
const verticalGap = 200;
const groundY = ground.getBoundingClientRect().top;
const groundHeight = ground.getBoundingClientRect().height;
const containerHeight = container.getBoundingClientRect().height;
const screenHeight = containerHeight - groundHeight;
const containerWidth = container.getBoundingClientRect().width;
const minHeight = 100;
const maxHeight = screenHeight - (minHeight + verticalGap);
let score = 0;
let shoudUpdateScore = true;
const points = 1;
let jump = false;
let letsJump = null;
const jumpSpeed = jumpDistance/10;
const jumpSound = new Audio("./assets/jump.mp3");
const gameOverSound = new Audio("./assets/game-over.mp3");
const pointScoreSound  = new Audio("./assets/point.wav");

window.addEventListener("keydown", (ev) => {
    ev.preventDefault();
   if (collision) return;
   if (ev.code === "Space" || ev.keyCode === 32) {
    jump = true;
    letsJump = jumpBird(bird,jumpDistance,jumpSpeed);
    jumpSound.currentTime=0;
    jumpSound.play();
   }
})


playAgainBtn.addEventListener("click",playAgain)









//functions



function playAgain(){
   gameOverDialog.close();
   restartGame();
}

function restartGame(){
   score = 0;
   upDateScore(0);
   obstacles.forEach((obstacle)=>{
      container.removeChild(obstacle.top);
      container.removeChild(obstacle.bottom);
   });
   obstacles = [];
   birdY = 0;
   setBirdY(bird,0);
   collision = false;
   shoudUpdateScore = true;
   startGame();
}


function upDateScore(points){
   // pointScoreSound.pause();
   // pointScoreSound.currentTime = 0;
   // pointScoreSound.play();
   score+=points;
   scoreCard.innerText = `${score}`;
}

function moveUp(bird, distance) {
   if (birdY <= 0) return;
   birdY -= distance;
   setBirdY(bird, birdY);
}

function pullBirdDown(bird, distance) {
   const heightOfBird = bird.getBoundingClientRect().height;
   if (birdY + heightOfBird >= groundY) {
      return;
   }
   setBirdY(bird, birdY);
   birdY += distance;
}


function setBirdY(bird, y) {
   bird.style.top = `${y}px`;
}



function getRandomHeight(min, max) {
   return Math.random() * (max - min) + min;
}


function putObstacle(container) {

   const obstacleTop = document.createElement("div");
   const obstacleBottom = document.createElement("div");
   obstacleBottom.classList.add("obstacle");
   obstacleBottom.classList.add("obstacle-bottom");
   obstacleTop.classList.add("obstacle");
   obstacleTop.classList.add("obstacle-top");

   const height = getRandomHeight(minHeight, maxHeight);
   obstacleBottom.style.height = `${height}px`;

   obstacleBottom.style.top = `${groundY - height}px`;
   obstacleTop.style.top = "0px";
   obstacleTop.style.height = `${screenHeight - (height + verticalGap)}px`;



   const obstacle = { top: obstacleTop, bottom: obstacleBottom, x: 0 };
   container.appendChild(obstacleTop);
   container.appendChild(obstacleBottom);
   obstacles.push(obstacle);
}



function setObstacleX(obstacle, x) {
   obstacle.top.style.right = `${x}px`;
   obstacle.bottom.style.right = `${x}px`;
}


function setObstacleHeight(obstacle) {
   obstacle.top.style.height = `${getRandomHeight(minHeight, maxHeight)}px`;
   obstacle.bottom.style.height = `${getRandomHeight(minHeight, maxHeight)}px`;

}

function checkCollison(bird, obstacle) {
   if (!obstacle) return false;
   const birdHeight = bird.getBoundingClientRect().height;
   const birdWidth = bird.getBoundingClientRect().width;
   const birdLeft = bird.getBoundingClientRect().left;
   const obstacleLeft = obstacle.top.getBoundingClientRect().left;
   const obstacleTopHeight = obstacle.top.getBoundingClientRect().height;
   const obstacleBottomTop = obstacle.bottom.getBoundingClientRect().top;
   if(birdY+birdHeight>=groundY) return true;
   if (obstacleLeft >= birdLeft && obstacleLeft <= birdLeft + birdWidth) {
      if (birdY <= obstacleTopHeight || birdY >= obstacleBottomTop - birdHeight) return true;
       if(shoudUpdateScore){
         upDateScore(points);
         shoudUpdateScore = false;
         setTimeout(()=>shoudUpdateScore = true,obstacleSpawnInterval);
       }
   }
   return false;
}

function moveObstacle(obstacle, distance) {

   let obstacleX = obstacle.x;

   const obstacleWidth = obstacle.top.getBoundingClientRect().width;

   if (obstacleX >= containerWidth + obstacleWidth) {
      container?.removeChild(obstacle.top);
      container?.removeChild(obstacle.bottom);
      obstacles.shift();
      return;
   }


   obstacleX += distance;

   obstacle.x = obstacleX;
   setObstacleX(obstacle, obstacleX);
}

function jumpBird(bird,totalDistance,speed){
   let distance = 0;
   function letsJump(){
      if(distance>=totalDistance){
         jump = false;
         return;
      }
      moveUp(bird,speed);
      distance+=speed;
     
   }

   return letsJump;
}


function startGame(){
   const intervalID = setInterval(() => {
      if (collision) {
         return clearInterval(intervalID);
      }
      putObstacle(container);
   }, obstacleSpawnInterval);
   
   function gameLoop() {
      obstacles.forEach((obstacle)=>{
         if(checkCollison(bird,obstacle)){
            collision = true;
            return;
         }
      })
      if(collision){
         finalScore.innerHTML = `${score}`;
         jumpSound.pause();
         gameOverSound.play();
         gameOverDialog.showModal();
         return;
      }
     
      if(jump){
         letsJump();
      }
        pullBirdDown(bird, gravity);
      obstacles?.forEach((obstacle) => {
         moveObstacle(obstacle, obstacleSpeed);
      })
      requestAnimationFrame(gameLoop);
   }
   
   requestAnimationFrame(gameLoop);
}

startGame();




