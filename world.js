class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    addVector(vector) {
        return new Vector(this.x += vector.x, this.y += vector.y);
    }

    toString() {
        return "(" + this.x + ", " + this.y + ")";
    }
}

class Garden {
    // Length is x, width is y
    constructor(length, width) {
        this.length = length;
        this.width = width;
        this.layout = [];
    }

    // Returns true if space is free.
    checkSpace(vector) {
        if (this.layout[vector.y][vector.x]) {
            return false;
        } else {
            return true;
        }
    }

    create() {
        this.layout = [];
        for (let i = 0; i < this.width; i++) {
            this.layout.push(new Array(this.length));
        }
    }

    placeEntity(entity) {
        if (entity.previousPosition != null) {
            this.layout[entity.previousPosition.y][entity.previousPosition.x] = null;
        }
        this.layout[entity.position.y][entity.position.x] = entity;
    }

    toString() {
        let str = "";

        for (let i = 0; i < this.layout.length; i++) {
            for (let j = 0; j < this.layout[i].length; j++) {
                if (this.layout[i][j] == null) {
                    str += "&nbsp;";
                } else {
                    str += this.layout[i][j].key;
                }
            }
            str += "<br>";
        }

        return str;
    }
}

