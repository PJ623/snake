class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    addVector(vector) {
        return new Vector(this.x+=vector.x, this.y+=vector.y);
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
        this.clearLayout;

        for (let i = 0; i < width; i++) {
            this.layout.push(new Array(length));
        }

        this.clearLayout = this.layout;
    }

    // Returns true if space is free.
    checkSpace(vector) {
        console.log("Space being checked:", vector.toString(), this.layout[vector.y][vector.x]);
        if(this.layout[vector.y][vector.x]){
            return false;
        } else {
            return true;
        }
        //return false;
    }

    clear() {
        console.log("CLEAR");
        this.layout = this.clearLayout;
    }

    placeEntity(entity) {
        if(entity.previousPosition != null){
            this.layout[entity.previousPosition.y][entity.previousPosition.x] = null;
        }
        this.layout[entity.position.y][entity.position.x] = entity;

        // for debugging
        if(entity instanceof Apple){
            console.log(entity);
        }
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

