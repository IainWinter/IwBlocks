var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var Bounds = /** @class */ (function () {
    function Bounds(x1, y1, x2, y2) {
        this.min = new Point(x1, y1);
        this.max = new Point(x2, y2);
    }
    Bounds.prototype.fits = function (other) {
        return (this.min.x < other.min.x && this.max.x > other.max.x) &&
            (this.min.y < other.min.y && this.max.y > other.max.y);
    };
    return Bounds;
}());
var Workspace = /** @class */ (function () {
    function Workspace(bounds) {
        this.bounds = bounds;
        this.scripts = [];
    }
    Workspace.prototype.dropBlock = function (block) {
        var blockContained = this.bounds.fits(block.bounds);
        if (blockContained) {
            var script = new BlockScript();
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
    };
    return Workspace;
}());
var BlockScript = /** @class */ (function () {
    function BlockScript() {
        this.head = null;
        this.tail = null;
        this.bounds = new Bounds(0, 0, 0, 0);
    }
    BlockScript.prototype.copy = function () {
        var blockScript = new BlockScript();
        blockScript.head = this.head;
        blockScript.tail = this.tail;
        blockScript.bounds = this.bounds;
        return blockScript;
    };
    BlockScript.prototype.reCalcBounds = function () {
        var runner = this.head;
        var min = this.head.bounds.min;
        var max = this.head.bounds.max;
        var minX, minY, maxX, maxY;
        while (runner.next != null) {
            min = runner.bounds.min;
            max = runner.bounds.max;
            if (min.x < minX)
                minX = min.x;
            if (min.y < minY)
                minY = min.y;
            if (max.x > maxX)
                maxX = max.x;
            if (max.x > maxY)
                maxY = max.y;
        }
        this.bounds.min = min;
        this.bounds.max = max;
    };
    BlockScript.prototype.addToEnd = function (block) {
        block.previous = this.tail;
        if (this.tail != null) {
            this.tail.next = block;
        }
        else {
            this.head = block;
        }
        this.tail = block;
        this.reCalcBounds();
    };
    BlockScript.prototype.addToStart = function (block) {
        block.next = this.head;
        if (this.head) {
            this.head.previous = block;
        }
        else {
            this.tail = block;
        }
        this.head = block;
        this.reCalcBounds();
    };
    //insert
    BlockScript.prototype.split = function (block) {
        var runner = this.head;
        var i = 0;
        while (runner != block) {
            if (runner == this.tail) {
                //Block is not in script
                return null;
            }
            runner = runner.next;
            i++;
        }
        var left = this.copy();
        var leftRunner = left.head;
        for (; i > 1; i--) {
            leftRunner = leftRunner.next;
        }
        //sevor connections
        //left
        leftRunner.next = null;
        //right
        runner.previous = null;
        this.head = runner;
        return left;
    };
    return BlockScript;
}());
var Block = /** @class */ (function () {
    function Block(value, bounds) {
        this.next = null;
        this.previous = null;
        this["function"] = value;
        this.bounds = bounds;
        var display = document.createElement("div");
        display.style.position = "absolute";
        display.style.top = bounds.min.x + "px";
        display.style.left = bounds.min.y + "px";
        display.style.width = bounds.max.x + "px";
        display.style.height = bounds.max.y + "px";
        display.style.backgroundColor = "#ccc";
        var page = document.getElementById("page");
        page.appendChild(display);
    }
    return Block;
}());
function test() {
    var workspaceBounds = new Bounds(0, 0, 500, 500);
    var workspace = new Workspace(workspaceBounds);
    var block1 = new Block("Test block 1", new Bounds(10, 10, 100, 20));
    var block2 = new Block("Test block 2", new Bounds(200, 200, 200, 40));
    workspace.dropBlock(block1);
    workspace.dropBlock(block2);
}
test();
