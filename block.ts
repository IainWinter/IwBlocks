class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Bounds {
    public min: Point;
    public max: Point;

    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.min = new Point(x1, y1);
        this.max = new Point(x2, y2);
    }

    public fits(other: Bounds): boolean {
        return (this.min.x < other.min.x && this.max.x > other.max.x) &&
               (this.min.y < other.min.y && this.max.y > other.max.y);
    }
}

class Workspace {
    private bounds: Bounds;
    private scripts: BlockScript[];

    constructor(bounds: Bounds) {
        this.bounds = bounds;
        this.scripts = [];
    }

    public dropBlock(block: Block):boolean {
        let blockContained = this.bounds.fits(block.bounds);
        if(blockContained) {
            for(let i = 0; i < this.scripts.length; i++) {
                let script = this.scripts[i];
                if(script.bounds.fits(block.bounds)) {
                    
                }
            }

            let script = new BlockScript();
            script.addToStart(block);

            this.scripts.push(script);
        }

        return blockContained;
        //check if is in bounds
            //if is check if near blockscript
                //if is check which block is it is near and add it to the script
            //if not create new blockscript and add block to it
            //return true
        //if not return false
    }
}

class BlockScript {
    public head: Block;
    public tail: Block;
    public bounds: Bounds;

    constructor() {
        this.head = null;
        this.tail = null;
        this.bounds = new Bounds(0, 0, 0, 0);
    }

    public copy(): BlockScript {
        let blockScript = new BlockScript();
        blockScript.head = this.head;
        blockScript.tail = this.tail;
        blockScript.bounds = this.bounds;
        return blockScript;
    }

    private reCalcBounds() {
         let runner = this.head;
         let min = this.head.bounds.min; 
         let max = this.head.bounds.max;
         let minX: number, 
             minY: number, 
             maxX: number, 
             maxY: number;
         while(runner.next != null) {
             min = runner.bounds.min;
             max = runner.bounds.max;
             if (min.x < minX) minX = min.x;
             if (min.y < minY) minY = min.y;
             if (max.x > maxX) maxX = max.x;
             if (max.x > maxY) maxY = max.y;
         }

         this.bounds.min = min;
         this.bounds.max = max;
    }

    public addToEnd(block: Block) {
        block.previous = this.tail;
        if(this.tail != null) {
            this.tail.next = block;
        } else {
            this.head = block;
        }

        this.tail = block;
        this.reCalcBounds();
    }

    public addToStart(block: Block) {
        block.next = this.head;
        if(this.head) {
            this.head.previous = block;
        } else {
            this.tail = block;
        }

        this.head = block;
        this.reCalcBounds();
    }

    //insert

    public split(block): BlockScript {
        let runner = this.head;
        let i = 0;
        while(runner != block) {
            if(runner == this.tail) {
                //Block is not in script
                return null;
            }

            runner = runner.next;
            i++;
        }

        let left = this.copy();
        let leftRunner = left.head;
        for(; i > 1; i--) {
            leftRunner = leftRunner.next;
        }

        //sevor connections
        
        //left
        leftRunner.next = null;
        //right
        runner.previous = null;
        this.head = runner;

        return left;
    }
}

class Block {
    public next: Block;
    public previous: Block;
    public bounds: Bounds;

    public domElement: HTMLDivElement;
    public function: any;

    constructor(value: any, bounds: Bounds) {
        this.next = null;
        this.previous = null;
        this.function = value;
        this.bounds = bounds;

        let display = document.createElement("div");
        display.style.position = "absolute";
        display.style.top = bounds.min.x + "px";
        display.style.left = bounds.min.y + "px";
        display.style.width = bounds.max.x + "px";
        display.style.height = bounds.max.y + "px";
        display.style.backgroundColor = "#ccc";

        let page: HTMLElement = document.getElementById("page");
        page.appendChild(display);
    }
}

function test() {
    let workspaceBounds = new Bounds(0, 0, 500, 500);
    let workspace = new Workspace(workspaceBounds);

    let block1 = new Block("Test block 1", new Bounds(10, 10, 100, 20));
    let block2 = new Block("Test block 2", new Bounds(200, 200, 200, 40));

    workspace.dropBlock(block1);
    workspace.dropBlock(block2);
}

test();