class Entity {
    constructor(vector) {
        if(vector){
            this.position = vector;
        } else {
            this.position = new Vector(0,0);
        }
        this.previousPosition = null;
        this.hasMoved = false;
    }
}

class Snake {
    constructor(spawnPoint) {

        if(!spawnPoint){
            spawnPoint = new Vector(0,0);
        }

        this.head = class Head extends Entity {
            constructor(spawnPoint) {
                super(spawnPoint);
                this.key  = "H"; //&#9673;
            }
        }

        this.extension = class Extension extends Entity {
            constructor(spawnPoint) {
                super(spawnPoint);
                this.key = "E"; // &#9724;
            }

            follow(entity) {
                let previousPosition = this.position;
                let newPosition = entity.previousPosition;
                this.position = newPosition;
                this.previousPosition = previousPosition;
            };
        }

        // Form the snake.
        this.body = [new this.head(spawnPoint)];
    }

    grow() {
        let head = this.body[0];
        let tail = this.body[this.body.length-1];
        if(tail.previousPosition == null){
            this.body.push(new this.extension(new Vector(tail.position.x - 1, tail.position.y)));
        } else {
            this.body.push(new this.extension(tail.previousPosition));
        }
        console.log(this.body);
    }

    // use hasMoved. Tick, then reset
    // Lock movement... eg. can't go up if dude just went down
    move(vector) {
        let head = this.body[0];

        let previousPosition = head.position;
        head.previousPosition = previousPosition;

        head.position = new Vector(head.position.x + vector.x, head.position.y + vector.y);
        head.hasMoved = true;

        // Get extensions to follow.
        for(let i = 1; i < this.body.length; i++){
            this.body[i].follow(this.body[i-1]);
            this.body[i].hasMoved = true;
        }
    }
}

// Make list of apples to be checked against...
// Spawn apples randomly
class Apple extends Entity {
    constructor(spawnPoint) {
        super(spawnPoint);
        this.key = "A";
    }
}