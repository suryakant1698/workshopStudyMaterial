// For any enquiry you are invited to visit si lab
// Shobhit Garg
// CSE
// 9536331752
// Apoorva
// CSE
// 7011588761
// Akshat Kumar Srivastava
// IT 
// 7379308109
// Avinash Singh
// IT
// 7500813655



(function (window, document) {
  'use strict';

  //Check whether the browser is Safari and this returns 19 (>0) in Safari
  var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
  //Check whether the browser is Internet Explorer
  var isIE = false || !!document.documentMode;

  function Game (elementID) {
    //Define the game variable
    var game = this;
    //Define the canvas variable and access the HTML canvas tag and setting the width and height of the canvas
    var canvas = document.getElementById(elementID);

    game.ctx = canvas.getContext('2d');
    game.screenWidth = canvas.scrollWidth;
    game.screenHeight = canvas.scrollHeight;
    //Initializing the score variable to 0
    game.score = 0;
    //Landing page of the game
    game.drawWelcomePage();

    //Checking the keyboard input from the USER
    game.keydownHandler = function (event) {
      //ENTER KeyCode is 13
      if (event.keyCode === 13) {
        //Calling the start method of game object
        game.start();
      }
      //Removing the event Listener
      window.removeEventListener("keydown", game.keydownHandler, false);
    };
    //Adding the event Listener
    window.addEventListener("keydown", game.keydownHandler, false);
  }
  // Definition of the drawWelcomePage
  Game.prototype.drawWelcomePage = function () {
    //Clearing the canvas for the welcome page
    this.clearScreen();
    //Setting the font property of the canvas
    this.ctx.font = "25pt Arial";
    //Draw filled text on the canvas
    this.ctx.fillText("Press enter to start...", 100, 100);
  };

  //Definition of start function
  Game.prototype.start = function () {
    //Passing the current reference to game variable
    var game = this;
    //Creating a new object of the BIRD using the game reference
    var bird = new Bird(game);
    //Creating the Gaps for the bird to pass
    var gaps = [250, 400, 550, 700, 850].map(function (xPos) {
      return new Gap(game, xPos);
    });
    //Number of gaps destroyed
    gaps.destroied = 0;

    //Calling the  function tick in every 20 milliseconds
    game.intervalID = setInterval(tick, 20);
    //Initial game score
    game.score = 0;
    //Definition of tick function
    function tick () {
      //Initializing the gaps passed to 0
      gaps.passed = 0;
      //Calling the clearScreen method
      game.clearScreen();
      //Calling the fly method of the bird
      bird.fly();
      //Checking the gaps for the bird to pass throught
      gaps.forEach(function (gap) {
        if (bird.isAtScreenCenter()) {
          //Moving the gaps towards the bird
          gap.move();
        }
        if (gap.xPos + gap.width / 2 <= 0) {
          gaps.shift();
          gaps.destroied++;
          //pushing the new gaps object
          gaps.push(new Gap(game, gaps[gaps.length - 1].xPos + 150));
        }

        if (gap.xPos + gap.width / 2 < bird.xPos - bird.width / 2) {
          //increasing the points on passing the gap successfully
          gaps.passed++;
        }

        if (gap.collisionWith(bird)) {
          //calling gameover if the gap collides with the bird
          game.gameover();
        }
      });
      //updating the score with every passing gaps
      if (gaps.passed + gaps.destroied > game.score) {
        game.scoreSound.play();
        game.score = gaps.passed + gaps.destroied;
      }
      //Calling the render function
      render();
    } 

    //Definition of the render function
    function render () {
      //Setting the font property
      game.ctx.font = "15pt Arial";
      //Draw filled text on the canvas
      game.ctx.fillText("Score: " + game.score, 10, 20);  
      //Rendering the bird on the canvas
      bird.render();
      //Rendering the gaps
      gaps.forEach(function (gap) {
        gap.render(); //rendering each gap
      });

    }
  };
  //Definition of the gameover function
  Game.prototype.gameover = function () {
    //Clearing the interval of game loop
    clearInterval(this.intervalID);
    //Saving the canvas properties for the further use
    this.ctx.save();
    //Setting the font property
    this.ctx.font = "40pt Arial";
    //Writting the text on the canvas
    this.ctx.fillText("GAME OVER", 75, 100);
    //Setting the font 
    this.ctx.font = "15pt Arial";
    this.ctx.fillText("Press enter to play again!", 130, 150);
    //Restoring the initial canvas properties for the next round
    this.ctx.restore();
    //Keydown EventListener
    window.addEventListener("keydown", this.keydownHandler, false);
  };

  //Definition of the clearScreen function
  Game.prototype.clearScreen = function () {
    //using the inbuilt clearRect function for clearing the canvas
    this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
  };

  //Sound which is used after the point is earned by the player
  Game.prototype.scoreSound = new Audio();
  //initially making the autoplay false
  Game.prototype.scoreSound.autoplay = false;
  //checking for the browser and accordingly setting the sound
  Game.prototype.scoreSound.src = isSafari || isIE ? "sounds/score.mp3" : "sounds/score.ogg";

  //Definition of Gap function
  function Gap (game, xPos) {
    this.game = game;
    this.xPos = xPos;
    this.yPos = Math.floor(Math.random() * (game.screenHeight - this.height)) + this.height / 2;
    this.xSpeed = 1.5;
  }
  //setting the Gap height and width of the Gap
  Gap.prototype.height = 70;
  Gap.prototype.width = 50;

  Gap.prototype.render = function () {
    //Sets the source image to the new image
    this.game.ctx.globalCompositeOperation = "destination--over";
    //Drawing the image of lower pipe
    this.game.ctx.drawImage(this.pipeImage, (this.xPos - this.width / 2), (this.yPos + (this.height / 2)), 50, 154);
    this.game.ctx.save();
    //Setting the scale of the game canvas
    this.game.ctx.scale(1, -1);
    //Drawing the image upper pipe
    this.game.ctx.drawImage(this.pipeImage, (this.xPos - this.width / 2), -(this.yPos - (this.height / 2)), 50, 154);
    this.game.ctx.restore();
  };
  //definition of the move method
  Gap.prototype.move = function () {
    //
    this.xPos -= this.xSpeed;
  };

  Gap.prototype.collisionWith = function (thing) {
    if (thing.xPos - thing.width / 2 > this.xPos + this.width / 2 || thing.xPos + thing.width / 2 < this.xPos - this.width / 2) {
      return false;
    }
    else if ((thing.yPos - thing.height / 2 > this.yPos - this.height / 2) && (thing.yPos + thing.height / 2 < this.yPos + this.height / 2)) {
      return false;
    }
    else {
      return true;
    }
  };
  //creating an instance of the pipe image
  Gap.prototype.pipeImage = new Image();
  //adding the event listener and setting it to true for game start
  Gap.prototype.pipeImage.addEventListener("load", function () {
    Gap.ready = true;
  });
  Gap.prototype.pipeImage.src = "images/pipe.png";
  //Bird function to initialize the value of the Bird
  function Bird (game) {
    this.game = game;
    this.xPos = this.width / 2;//setting the x coordinate to width/2
    this.yPos = game.screenHeight / 2;//setting the y coordinate
    this.xSpeed = 1.5;//setting the speed of the bird in x direction
    this.ySpeed = 0;//setting the speed of the bird in y direction

    //Key Handler for bird movement
    this.keydownHandler = function (event) {
      if (event.keyCode === 13) {
        //setting the speed of the bird
        this.ySpeed = 5;
        //play the sound on bird movement
        this.sound.play();
      }
    }.bind(this); //binding to the instance of Bird with this 
    //Adding the event listener
    window.addEventListener("keydown", this.keydownHandler, false);
  }
  //defining the width and height of the bird
  Bird.prototype.width = 30;
  Bird.prototype.height = 21;
  //Defination of the Bird render method
  Bird.prototype.render = function () {
    //Set the source image to the new image
    this.game.ctx.globalCompositeOperation = "destination-over";
    //Draw image of the bird
    this.game.ctx.drawImage(this.image, this.xPos - this.width / 2, this.yPos - this.height / 2, this.width, this.height);
  };
  //definition of fly method
  Bird.prototype.fly = function () {
    //changing the coordinates of the bird as it flies
    this.xPos = this.xPos + this.xSpeed;
    this.yPos = this.yPos - this.ySpeed;

    //changing the x coordinate and x Speed of the bird
    if (this.xPos + this.width / 2 > this.game.screenWidth / 2) {
      this.xPos = this.game.screenWidth / 2 - this.width / 2;
      this.xSpeed = 0;
    }

    //changing the y coordinate and y Speed of the bird
    if (this.yPos - this.height / 2 <= 0) {
      this.yPos = this.height / 2;
      this.ySpeed = 0;
    }

    //if the bird collides with the canvas the call the die function
    if (this.yPos + this.height / 2 >= this.game.screenHeight) {
      this.yPos = this.game.screenHeight - this.height / 2;
      this.die();
    }
    //decreasing the speed of the bird in y direction for gravity
    this.ySpeed -= 0.5;
  };
  //checking position of bird whether is at centre 
  Bird.prototype.isAtScreenCenter = function () {
    return this.xPos + this.width / 2 === this.game.screenWidth / 2;
  };
  //gameover function
  Bird.prototype.die = function () {
    //removing the eventlistner  
    window.removeEventListener("keydown", this.keydownHandler, false);
    //Calling the function Gameover
    this.game.gameover();
  };

  //Making the prototype of the audio
  Bird.prototype.sound = new Audio();
  //Setting the autoplay property to false
  Bird.prototype.sound.autoplay = false;
  //Checking whether the browser is Safari or Internet Explorer
  //If the browser is safari then mp3 sound wil be played 
  //otherwise in case of internet explorer .ogg sound will be played
  Bird.prototype.sound.src = isSafari || isIE ? "sounds/fly.mp3" : "sounds/fly.ogg";
  //making object of the image
  Bird.prototype.image = new Image();
  //Adding listener to the object
  Bird.prototype.image.addEventListener("load", function () {
    //Setting the bird to ready when screen is loaded
    Bird.ready = true;
  });

  //Setting the image of the bird
  Bird.prototype.image.src = "images/bird.png";
  //Creating object of Game and passing the canvas ID
  new Game("playground");
})(window, window.document);

/*
 
*/
