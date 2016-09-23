(function gameSetup() {
    'use strict';

    var shipElem = document.getElementById('ship');

    // Create your "ship" object and any other variables you might need...
    var ship = {
      self: shipElem,
      velocity: 0,
      angle: 0
    };

    ship.self.style.left = '700px'; //start position
    ship.self.style.top = '350px';

    ship.self.style.transition = 'transform .2s, box-shadow .7s, ease-in';
    ship.self.style.boxShadow = '0 5px 6px -12px #ffbb66';




    var allAsteroids = [];
    shipElem.addEventListener('asteroidDetected', function (event) {
      allAsteroids.push(event.detail);
      // console.clear();
      // console.log("allAsteroids:");
      // console.log(allAsteroids);
      // console.log("AllAsteroids for loop: ");

      for (var i = 0; i < allAsteroids.length; i++){
        allAsteroids[i].style.transition = "opacity 1s";
        // aside['key' + i].style.transition = 'all .2s';
      }
        // You can detect when a new asteroid appears with this event.
        // The new asteroid's HTML element will be in:  event.detail

        // What might you need/want to do in here?

    });

    /**
     * Use this function to handle when a key is pressed. Which key? Use the
     * event.keyCode property to know:
     *
     * 37 = left
     * 38 = up
     * 39 = right
     * 40 = down
     *
     * @param  {Event} event   The "keyup" event object with a bunch of data in it
     * @return {void}          In other words, no need to return anything
     */
    function handleKeys(event) {
        console.log(event.keyCode);
        switch (event.keyCode) {
          case 38: //up
            if (ship.velocity <= 5){
              ship.velocity += 1;  //increase ship velocity if less than 20
            }
            break;
          case 40: //down
            if (ship.velocity > 0){
              ship.velocity += -1; // decrease ship velocity if faster than zero
            }
            break;
          case 39: //right
            ship.angle += 10;
            break;
          case 37: //left
            ship.angle += -10;
          default:
            break;
        }
        // Implement me!
        switch (ship.velocity) {
          case 0:
            ship.self.style.boxShadow = '0 5px 6px -12px #ffbb66';
            break;
          case 1:
            ship.self.style.boxShadow = '0 14px 8px -11px #ffbb66';
            break;
          case 2:
            ship.self.style.boxShadow = '0 14px 9px -11px #ffbb66';
            break;
          case 3:
            ship.self.style.boxShadow = '0 14px 10px -10px #ffbb66';
            break;
          case 4:
            ship.self.style.boxShadow = '0 15px 11px -9px #ffbb66';
            break;
          case 5:
            ship.self.style.boxShadow = '0 15px 13px -8px #ffbb66';
            break;
          case 6:
            ship.self.style.boxShadow = '0 18px 15px -7px #ff6600';
            break;
          default:
            ship.self.style.boxShadow = '0 5px 6px -12px #ffbb66';
            break;

        }
        console.log("velocity: " + ship.velocity);
        console.log(ship.self.style.boxShadow);
    }
    document.querySelector('body').addEventListener('keyup', handleKeys);

    /**
     * This is the primary "game loop"... in traditional game development, things
     * happen in a loop like this. This function will execute every 20 milliseconds
     * in order to do various things. For example, this is when all game entities
     * (ships, etc) should be moved, and also when things like hit detection happen.
     *
     * @return {void}
     */
    function gameLoop() {
        // This function for getting ship movement is given to you (at the bottom).
        // NOTE: you will need to change these arguments to match your ship object!
        // What does this function return? What will be in the `move` variable?
        // Read the documentation!


        var move = getShipMovement(ship.velocity, ship.angle);

        var movementX = parseInt(ship.self.style.left) + move.left;
        var movementY = parseInt(ship.self.style.top) - move.top;

        movementX = movementX + 'px';
        movementY = movementY + 'px';

        // Move the ship here!
        ship.self.style.left = movementX;
        ship.self.style.top = movementY;

        ship.self.style.transform = 'rotate(' + ship.angle + 'deg)';


        // Time to check for any collisions (see below)...

        checkForCollisions();
    }

    /**
     * This function checks for any collisions between asteroids and the ship.
     * If a collision is detected, the crash method should be called with the
     * asteroid that was hit:
     *    crash(someAsteroidElement);
     *
     * You can get the bounding box of an element using:
     *    someElement.getBoundingClientRect();
     *
     * A bounding box is an object with top, left, width, and height properties
     * that you can use to detect whether one box is on top of another.
     *
     * @return void
     */

    function checkForCollisions() {
      var shipLBound = ship.self.getBoundingClientRect().left;
      var shipRBound = ship.self.getBoundingClientRect().right;
      var shipTBound = ship.self.getBoundingClientRect().top;
      var shipBBound = ship.self.getBoundingClientRect().bottom;
      var asteroidLBound, asteroidRBound, asteroidTBound, asteroidBBound;

      for (var i = 0; i < allAsteroids.length; i++){
        asteroidLBound = allAsteroids[i].getBoundingClientRect().left;
        asteroidRBound = allAsteroids[i].getBoundingClientRect().right;
        asteroidTBound = allAsteroids[i].getBoundingClientRect().top;
        asteroidBBound = allAsteroids[i].getBoundingClientRect().bottom;
        if (shipLBound <= asteroidRBound &&
            shipRBound >= asteroidLBound &&
            shipTBound <= asteroidBBound &&
            shipBBound >= asteroidTBound) {
          crash(allAsteroids[i]);
          allAsteroids[i].style.opacity = 0;
        }

      }

      var shipWidth = ship.self.getBoundingClientRect().width;
      var shipHeight = ship.self.getBoundingClientRect().height;
      var screenWidth = document.documentElement.clientWidth;
      var screenHeight = document.documentElement.clientHeight;

      if (shipRBound < 0){
        ship.self.style.left = screenWidth + 'px';
      }
      if (shipLBound >= screenWidth){
        ship.self.style.left = 0 + 'px';
      }
      if (shipBBound < 0){
        ship.self.style.top = screenHeight + 'px';
      }
      if (shipTBound > screenHeight){
        ship.self.style.top = 0 + 'px';
      }

    }


    /**
     * This event handler will execute when a crash occurs
     *
     * return {void}
     */
    document.querySelector('main').addEventListener('crash', function () {
        console.log('A crash occurred!');
        ship.velocity = 0;
        ship.self.style.boxShadow = '0 5px 6px -12px #ffbb66';
        // What might you need/want to do in here?

    });



    /** ************************************************************************
     *             These functions and code are given to you.
     *
     *                   !!! DO NOT EDIT BELOW HERE !!!
     ** ************************************************************************/

     var loopHandle = setInterval(gameLoop, 20);

     /**
      * Executes the code required when a crash has occurred. You should call
      * this function when a collision has been detected with the asteroid that
      * was hit as the only argument.
      *
      * @param  {HTMLElement} asteroidHit The HTML element of the hit asteroid
      * @return {void}
      */
    function crash(asteroidHit) {
        document.querySelector('body').removeEventListener('keyup', handleKeys);
        asteroidHit.classList.add('hit');
        document.querySelector('#ship').classList.add('crash');

        var event = new CustomEvent('crash', { detail: asteroidHit });
        document.querySelector('main').dispatchEvent(event);
    }

    /**
     * Get the change in ship position (movement) given the current velocity
     * and angle the ship is pointing.
     *
     * @param  {Number} velocity The current speed of the ship (no units)
     * @param  {Number} angle    The angle the ship is pointing (no units)
     * @return {Object}          The amount to move the ship by with regard to left and top position (object with two properties)
     */
    function getShipMovement(velocity, angle) {
        return {
            left: (velocity * Math.sin(angle * Math.PI / 180)),
            top: (velocity * Math.cos(angle * Math.PI / 180))
        };
    }

})();
