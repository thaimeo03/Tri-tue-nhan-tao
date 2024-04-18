var BoatNode = /** @class */ (function () {
    function BoatNode(value, parent) {
        this.value = value;
        this.parent = parent;
    }
    return BoatNode;
}());
var Game = /** @class */ (function () {
    function Game() {
        this.L = [new BoatNode([3, 3, 1])];
        this.step = [[0, 1], [1, 0], [1, 1], [0, 2], [2, 0]];
        this.visit = {}; // Can use map or dictionary (i used dictionary instead)
        this.visit["".concat(this.L[0].value)] = true;
    }
    Game.prototype.conditionOppSide = function (u) {
        var oppSide = [3 - u.value[0], 3 - u.value[1]];
        return (oppSide[0] >= oppSide[1] || oppSide[0] === 0 || oppSide[0] === 3) && (u.value[0] >= u.value[1] || u.value[0] === 0 || u.value[0] === 3);
    };
    Game.prototype.conditionStartSide = function (u, r) {
        if (u.value[0] >= r[0] && u.value[1] >= r[1]) {
            var newNode = [u.value[0] - r[0], u.value[1] - r[1], 0];
            var newState = new BoatNode(newNode, u); // g(v) = k(u, v) + 1 = cost of parent + 1
            var isOppSide = this.conditionOppSide(newState);
            return isOppSide ? newState : null;
        }
        return null;
    };
    Game.prototype.conditionEndSide = function (u, r) {
        if (u.value[0] + r[0] <= 3 && u.value[1] + r[1] <= 3) {
            var newNode = [u.value[0] + r[0], u.value[1] + r[1], 1];
            var newState = new BoatNode(newNode, u); // g(v) = k(u, v) + 1 = cost of parent + 1
            var isOppSide = this.conditionOppSide(newState);
            return isOppSide ? newState : null;
        }
        return null;
    };
    Game.prototype.generatePossibleMoves = function (u) {
        var _this = this;
        var v = [];
        if (u.value[2] === 1) {
            this.step.forEach(function (r) {
                var newBoatNode = _this.conditionStartSide(u, r);
                if (newBoatNode) {
                    v.push(newBoatNode);
                }
            });
        }
        else {
            this.step.forEach(function (r) {
                var newBoatNode = _this.conditionEndSide(u, r);
                if (newBoatNode) {
                    v.push(newBoatNode);
                }
            });
        }
        return v;
    };
    Game.prototype.updateStack = function (v) {
        for (var _i = 0, v_1 = v; _i < v_1.length; _i++) {
            var x = v_1[_i];
            if (!this.visit["".concat(x.value)]) {
                this.L.push(x);
                this.visit["".concat(x.value)] = true;
            }
        }
        // Sort L by cost
        // this.L.sort((a, b) => a.totalCost - b.totalCost);
        console.log(this.L.map(function (boatNode) {
            return {
                boatNode: boatNode.value,
            };
        }));
    };
    Game.prototype.reconstructPath = function (goalState) {
        if (goalState) {
            console.log("Win");
            var path = [];
            var current = goalState;
            while (current) {
                path.push(current);
                current = current.parent;
            }
            for (var i = path.length - 1; i >= 0; i--) {
                console.log(path[i].value);
            }
        }
        else {
            console.log("No solution");
        }
    };
    Game.prototype.dfs = function () {
        while (this.L.length > 0) {
            var u = this.L.pop(); // First in last out
            if (!u)
                continue;
            if (u.value[0] === 0 && u.value[1] === 0 && u.value[2] === 0) {
                this.goalState = u;
                break;
            }
            var v = this.generatePossibleMoves(u);
            this.updateStack(v);
        }
        this.reconstructPath(this.goalState);
    };
    return Game;
}());
var game = new Game();
game.dfs();
