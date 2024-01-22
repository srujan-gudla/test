var p5Inst = new p5(null, 'sketch');

window.preload = function () {
  initMobileControls(p5Inst);

  p5Inst._predefinedSpriteAnimations = {};
  p5Inst._pauseSpriteAnimationsByDefault = false;
  var animationListJSON = {"orderedKeys":[],"propsByKey":{}};
  var orderedKeys = animationListJSON.orderedKeys;
  var allAnimationsSingleFrame = false;
  orderedKeys.forEach(function (key) {
    var props = animationListJSON.propsByKey[key];
    var frameCount = allAnimationsSingleFrame ? 1 : props.frameCount;
    var image = loadImage(props.rootRelativePath, function () {
      var spriteSheet = loadSpriteSheet(
          image,
          props.frameSize.x,
          props.frameSize.y,
          frameCount
      );
      p5Inst._predefinedSpriteAnimations[props.name] = loadAnimation(spriteSheet);
      p5Inst._predefinedSpriteAnimations[props.name].looping = props.looping;
      p5Inst._predefinedSpriteAnimations[props.name].frameDelay = props.frameDelay;
    });
  });

  function wrappedExportedCode(stage) {
    if (stage === 'preload') {
      if (setup !== window.setup) {
        window.setup = setup;
      } else {
        return;
      }
    }
// -----

// Create the ball, playerPaddle, and computerPaddle as sprite objects
var ball = createSprite(200, 200, 10, 10);
var playerPaddle = createSprite(380, 200, 10, 70);
var computerPaddle = createSprite(10, 200, 10, 70);

// Variable to store different states of the game
var gameState = "serve";
// Variables to store scores
var playerScore = 0;
var compScore = 0;

var isRunning = false;
var startTime = 0;
var elapsedTime = 0;
var speedIncreaseFactor = 1;
var count=0;

var initialSpeed = 0;
ball.setVelocity(initialSpeed, initialSpeed);

function setup() {
  createCanvas(400, 400);
}
function draw() {
  //add colour to the screen
  background("turquoise");

  // Add colors to the objects
  ball.shapeColor = "white";
  playerPaddle.shapeColor = "black";
  computerPaddle.shapeColor = "red";

  // Place info text in the center
  if (gameState === "serve") {
    textSize(18);
    text("Press Space to Serve", 120, 180);
  }
  textSize(18);
  text(compScore, 180, 20);
  text(playerScore, 213, 20);

  // Making the player paddle move with the mouse's y position
  playerPaddle.y = World.mouseY;

  // AI for the computer paddle
  // Make the computer paddle move with the ball's y position
  computerPaddle.y = ball.y;

  // Draw a line at the center
  for (var i = 0; i < 400; i = i + 20) {
    line(200, i, 200, i + 10);
    stroke("white");
  }

  // Creating edge boundaries
  // Making the ball bounce with the top and bottom edges
  createEdgeSprites();
  ball.bounceOff(topEdge);
  ball.bounceOff(bottomEdge);
  ball.bounceOff(playerPaddle);
  ball.bounceOff(computerPaddle);

  // Serve the ball when space is pressed
  if (keyDown("space") && gameState === "serve") {
    serve();
    gameState = "play";
    isRunning = !isRunning;
     startTime = millis();
  }

  // Reset the ball to the center if it crosses the screen
  if (ball.x > 400 || ball.x < 0) {
    if (ball.x < 0) {
      playerScore = playerScore + 1;
    }
    if (ball.x > 400) {
      compScore = compScore + 1;
    }
    reset();
    isRunning = false;
    gameState = "serve";
    
  }

  if (playerScore === 5 || compScore === 5) {
    gameState = "over";
    textSize(18);
    text("Game over", 150, 150);
    text("Press R to restart", 135, 250);
  }
  if (playerScore === 5) {
    text("You Win", 168, 180);
  }
  if (compScore === 5) {
    text("Better luck next time :)", 115, 180);
  }
  if (keyDown("r") && gameState === "over") {
    gameState = "serve";
    compScore = 0;
    playerScore = 0;
    isRunning = false;
    elapsedTime = 0;
  }
 
  if (isRunning) {
    // Calculate elapsed time only if the stopwatch is running
    elapsedTime = (millis() - startTime) / 1000;
  } else {
    startTime = millis();
  }

  // Display the elapsed time
  if (gameState !== "over") {
    text("Time: " + elapsedTime.toFixed(2),500,500);
  }

  // Update elapsed time
  elapsedTime = millis() - startTime;

  // Check if 20 seconds have passed
  if (elapsedTime >= 120000 && compScore < 5 && playerScore < 5) {
    playSound("./retro_game_alert_3.mp3")
    // Increase the speed
    ball.setVelocity(ball.velocity.x * speedIncreaseFactor, ball.velocity.y * speedIncreaseFactor);
    count=count+1;
    // Increase the speed increase factor by 1.1x
    speedIncreaseFactor *= 1.1;
      gameState="over";
      // Reset the stopwatch
    startTime = millis();

  }
  if(count===5){
    gameState = "over";
    text("You Win :)", 168, 180);
  }
  drawSprites();
}

function serve() {
  ball.velocityX = 3;
  ball.velocityY = 4;
}

function reset() {
  ball.x = 200;
  ball.y = 200;
  ball.velocityX = 0;
  ball.velocityY = 0;
  startTime = millis();
  isRunning = false;
}


// -----
    try { window.draw = draw; } catch (e) {}
    switch (stage) {
      case 'preload':
        if (preload !== window.preload) { preload(); }
        break;
      case 'setup':
        if (setup !== window.setup) { setup(); }
        break;
    }
  }
  window.wrappedExportedCode = wrappedExportedCode;
  wrappedExportedCode('preload');
};

window.setup = function () {
  window.wrappedExportedCode('setup');
};
