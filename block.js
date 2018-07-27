class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Bounds {
    constructor(x1, y1, x2, y2) {
        this.topLeft = new Point(x1, y1);
        this.bottomRight = new Point(x2, y2);
    }
}

class Workspace {
    constructor(x1, y1, x2, y2) {
        //List of scripts
        this.scripts = [];

        //Bounds of workspace
        this.bounds = new Bounds(x1, y1, x2, y2);
    }

    createBlock() {
        let block = new Block(0, 0, 0, 0, 0);
        //if not near other blocks
        //create new script
        //else
        //add to nearest script / nearest block
        this.scripts.push(new BlockScript());
    }
}

class BlockScript {
    constructor() {
        this.head = null;
        this.tail = null;
        this.bounds = new Bounds(0, 0, 0, 0);
    }

    updateBounds() {
        let runner = this.head;
        let x1, y1, x2, y2;
        while (runner.next) {
            let tl = runner.topLeft;
            let br = runner.bottomRight;
            if (tl.x < x1) x1 = tl.x;
            if (tl.y < y1) y1 = tl.y;
            if (br.x > x2) y2 = br.x;
            if (br.y > y2) y2 = br.y;
        }

        this.bounds = new Bounds(x1, y1, x2, y2);
    }

    addToEnd(block) {
        block.previous = this.tail;
        if (this.tail) {
            this.tail.next = block;
        } else {
            this.head = block; 
        }

        this.tail = block;
        updateBounds();
    }

    addToStart(block) {
        block.next = this.head;
        if (this.head) {
            this.head.previous = block;
        } else {
            this.tail = block;
        }

        this.head = block;
        updateBounds();
    }

    //Left is returned. The original script is right
    split(block) {
        let runner = this.head;
        let i = 0;
        while (runner != block) {
            if (runner == this.tail) {
                alert("Block is not in script");
                return null;
            }

            runner = runner.next;
            i++;
        }

        let left = $.extend(this);
        let leftRunner = left.head;
        for (; i > 1; i--) {
            leftRunner = leftRunner.next;
        }

        //left
        leftRunner.next = null;
        //right
        runner.previous = null;
        this.head = runner;

        return left;
    }
}

class Block {
    constructor(value, x1, y1, x2, y2) {
        //The next block in the script
        this.next = null;

        //The previous block in the script
        this.previous = null;

        //The position in the workspace
        this.bounds = new Bounds(x1, y1, x2, y2);

        //Temp value going to be function later
        this.value = value;
    }
}

$(function () {
    let w = new Workspace();
    w.createBlock();


    let bs = new BlockScript();
    let b = new Block(3);

    bs.addToStart(new Block(1));
    bs.addToEnd(new Block(2));
    bs.addToEnd(b);
    bs.addToEnd(new Block(4));
    bs.addToStart(new Block(0));

    console.log(bs);

    let bs2 = bs.split(b);
});