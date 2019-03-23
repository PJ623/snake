class Game {
    constructor(snake, garden, fps) {
        this.snake = snake;
        this.garden = garden;
        this.hasEnded = false;
        this.userHasInputted = false;
        this.animatedGame;
        this.movementMap = {
            w: new Vector(0, -1),
            a: new Vector(-1, 0),
            s: new Vector(0, 1),
            d: new Vector(1, 0)
        }
        this.lastMove = this.movementMap["d"];
        this.apple;
        this.score = 0;
        this.scorePropertyName = "snakeHighScore";

        if (fps) {
            this.fps = 1000 / fps;
        } else {
            this.fps = 1000 / 15;
        }
    }

    detectCollision() {
        let head = this.snake.body[0];

        if (head.position.x < 0 || head.position.y < 0 || head.position.x >= this.garden.length || head.position.y >= this.garden.width) {
            this.hasEnded = true;
        }

        for (let i = 1; i < this.snake.body.length; i++) {
            if (head.position.toString() == this.snake.body[i].position.toString()) {
                this.hasEnded = true;
            }
        }

        // Snake eats apple.
        if (head.position.toString() == this.apple.position.toString()) {
            this.snake.grow();
            this.apple = null;
            this.score++;
            this.submitScore();
        }
    }

    spawnApple() {
        let randomX;
        let randomY;
        let randomVector;

        // Make sure snake doesn't take up the whole screen, lol.
        if (this.snake.body.length < (this.garden.length * this.garden.width)) {
            // Keep trying to make apple if apple hasn't been placed.
            while (this.apple == null) {
                randomX = Math.floor(Math.random() * this.garden.length);
                randomY = Math.floor(Math.random() * this.garden.width);
                randomVector = new Vector(randomX, randomY);

                if (this.garden.checkSpace(randomVector)) {
                    this.apple = new Apple(randomVector);
                    this.garden.placeEntity(this.apple);
                }
            }
        } else {
            // Stop the game if the snake gets too big!
            this.stop();
        }
    }

    turn() {
        if (!this.userHasInputted) {
            this.snake.move(this.lastMove);
        }

        this.detectCollision();

        if (!this.hasEnded) {

            for (let i = 0; i < this.snake.body.length; i++) {
                this.garden.placeEntity(this.snake.body[i]);
            }

            // Upkeep
            for (let i = 0; i < this.snake.body.length; i++) {
                this.snake.body[i].hasMoved = false;
            }

            this.userHasInputted = false;

            if (this.apple == null) {
                this.spawnApple();
            }

            this.render();
        } else {
            this.stop();
        }
    }

    render() {
        document.getElementById("canvas").innerHTML = this.garden.toString();
    }

    // Starts the game.
    play() {
        // Set up the game.
        this.hasEnded = false;
        this.score = 0;
        this.apple = null;
        this.submitScore();
        this.garden.create();
        this.snake.create();
        this.lastMove = this.movementMap["d"];
        this.isPaused = false;
        var eventListenerIsSetUp = false;

        // Start with long snake.
        this.snake.grow();
        this.snake.grow();
        this.snake.grow();
        this.snake.grow();

        // Place the snake in the garden.
        for (let i = 0; i < this.snake.body.length; i++) {
            this.garden.placeEntity(this.snake.body[i]);
        }

        // Place the apple in the garden.
        this.spawnApple();

        this.render();

        // Listen for user input.
        if (!eventListenerIsSetUp) {
            document.addEventListener("keypress", (event) => {
                let head = this.snake.body[0];

                if ((event.key == "w" || event.key == "a" || event.key == "s" || event.key == "d") && (this.hasEnded == false && head.hasMoved == false)) {

                    // Lock movement... eg. can't go up if dude just went down. Move to snake.move?
                    if (this.movementMap[event.key].toString() != this.lastMove.toString().replace("1", "-1")
                        && this.movementMap[event.key].toString() != this.lastMove.toString().replace("-1", "1")) {
                        this.snake.move(this.movementMap[event.key]);
                        this.userHasInputted = true;
                        this.lastMove = this.movementMap[event.key];
                    }
                }

                if (event.key == "r") {
                    if (this.hasEnded) {
                        this.score = 0;
                        document.getElementById("message").innerHTML = "";
                        this.submitScore();
                        this.play();
                    } else if(this.isPaused) {
                        document.getElementById("message").innerHTML = "";
                        this.play();
                    }
                }
            });
        }

        // Animate the game.
        this.animatedGame = setInterval(() => {
            this.turn();
        }, this.fps);
    }

    stop() {
        clearInterval(this.animatedGame);
        this.submitScore();
        document.getElementById("message").innerHTML = "You DIED! Press 'r' to play again.";
    }

    pause() {
        clearInterval(this.animatedGame);
        this.isPaused = true;
        document.getElementById("message").innerHTML = "Press 'r' to start the game.";
    }

    submitScore() {
        let previousHighScore = Number(localStorage.getItem(this.scorePropertyName));

        if (!previousHighScore) {
            localStorage.setItem(this.scorePropertyName, 0);
        }

        document.getElementById("score").innerHTML = this.score;

        if (this.score > previousHighScore) {
            localStorage.setItem(this.scorePropertyName, this.score);
        }

        document.getElementById("high-score").innerHTML = localStorage.getItem(this.scorePropertyName);
    }
}