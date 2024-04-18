class BoatNode {
  value: number[];
  cost: number; // g(v) function
  totalCost: number; // f(v) function
  parent?: BoatNode;

  constructor(value: number[], cost: number, totalCost: number,parent?: BoatNode) {
    this.value = value;
    this.cost = cost;
    this.parent = parent;
    this.totalCost = totalCost
  }
}

class Game {
  private L: BoatNode[] = [new BoatNode([3, 3, 1], 0, 0)];
  private step = [[0, 1], [1, 0], [1, 1], [0, 2], [2, 0]];
  private visit: {[key: string]: boolean} = {}; // Can use map or dictionary (i used dictionary instead)
  private goalState: BoatNode | undefined;

  constructor() {
    this.visit[`${this.L[0].value}`] = true;
  }

  private conditionOppSide(u: BoatNode): boolean {
    const oppSide: number[] = [3 - u.value[0], 3 - u.value[1]]
    return (oppSide[0] >= oppSide[1] || oppSide[0] === 0 || oppSide[0] === 3) && (u.value[0] >= u.value[1] || u.value[0] === 0 || u.value[0] === 3)
  }

  private conditionStartSide(u: BoatNode, r: number[]): BoatNode | null {
    if(u.value[0] >= r[0] && u.value[1] >= r[1]) {
      const newNode = [u.value[0] - r[0], u.value[1] - r[1], 0]
      const newState = new BoatNode(newNode, u.cost + 1, 0, u); // g(v) = k(u, v) + 1 = cost of parent + 1
      const isOppSide = this.conditionOppSide(newState)
      return isOppSide ? newState : null
    }
    return null
  }

  private conditionEndSide(u: BoatNode, r: number[]): BoatNode | null {
    if(u.value[0] + r[0] <= 3 && u.value[1] + r[1] <= 3) {
      const newNode = [u.value[0] + r[0], u.value[1] + r[1], 1];
      const newState = new BoatNode(newNode, u.cost + 1, 0, u) // g(v) = k(u, v) + 1 = cost of parent + 1
      const isOppSide = this.conditionOppSide(newState)
      return isOppSide ? newState : null
    }
    return null
  }

  private generatePossibleMoves(u: BoatNode): BoatNode[] {
    const v: BoatNode[] = [];
    if(u.value[2] === 1) {
      this.step.forEach((r) => {
        const newBoatNode = this.conditionStartSide(u, r);
        if(newBoatNode) {
          v.push(newBoatNode);
        }
      });
    }
    else {
      this.step.forEach((r) => {
        const newBoatNode = this.conditionEndSide(u, r);
        if(newBoatNode) {
          v.push(newBoatNode);
        }
      });
    }

    return this.handleF(v);
  }

  private handleH(boatNodes: BoatNode[]): number[] {
    return boatNodes.map(boatNode => boatNode.value[0] + boatNode.value[1])
  }

  private handleF(boatNodes: BoatNode[]): BoatNode[] {
    const h = this.handleH(boatNodes);
    for(let i = 0; i < boatNodes.length; i++) {
      boatNodes[i].totalCost = boatNodes[i].cost + h[i];
    }
    // h.forEach(e => console.log(e))
    // arr.forEach(e => console.log(e.cost))
    return boatNodes
  }

  private updateQueue(v: BoatNode[]): void {
    for(const x of v) {
      if(!this.visit[`${x.value}`]) {
        this.L.push(x)
        this.visit[`${x.value}`] = true
      }
    }
    // Sort L by cost
    this.L.sort((a, b) => a.totalCost - b.totalCost);
    console.log(this.L.map(boatNode => {
      return {
        boatNode: boatNode.value,
        cost: boatNode.cost,
        totalCost: boatNode.totalCost
      }
    }))
  }

  private reconstructPath(goalState: BoatNode | undefined): void {
    if(goalState) {
      console.log("Win");
      const path: BoatNode[] = [];
      let current: BoatNode | undefined = goalState;
      while(current) {
        path.push(current);
        current = current.parent;
      }
      for(let i = path.length - 1; i >= 0; i--) {
        console.log(path[i].value);
      }
    } else {
      console.log("No solution");
    }
  }

  public aStar(): void {
    while(this.L.length > 0) {
      const u = this.L.shift();
      if(!u) continue;
      if(u.value[0] === 0 && u.value[1] === 0 && u.value[2] === 0) {
        this.goalState = u;
        break;
      }
      const v = this.generatePossibleMoves(u);
      this.updateQueue(v);
    }
    this.reconstructPath(this.goalState);
  }
}

const game = new Game();
game.aStar();