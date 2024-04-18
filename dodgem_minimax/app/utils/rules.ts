import { START } from "../constants/start"
import { ISelected, IStartSelected } from "../page"
import { Board } from "./board"

export const canMoveWhite = ({
  startSelected,
  endSelected,
  map,
  index,
}: {
  startSelected: IStartSelected,
  endSelected: ISelected,
  map: number[],
  index: number
}) => {
  return !startSelected.isSelected && !endSelected.isSelected && (map[index] === 1 && startSelected.isWhiteMoved || map[index] === -1 && !startSelected.isWhiteMoved)
}

export const canSelectEnd = ({
  startSelected,
  index: nextIndex,
}: {
  startSelected: IStartSelected,
  index: number
}) => {
  const nextIndexMoves = []
  const nextIndex_1 = (startSelected.index as number) + 1
  const nextIndex_2 = startSelected.isWhiteMoved ? (startSelected.index as number) - 1 : -1
  const nextIndex_3 = !startSelected.isWhiteMoved ? (startSelected.index as number) + 3 : -1
  const nextIndex_4 = (startSelected.index as number) - 3
  nextIndexMoves.push(nextIndex_1, nextIndex_2, nextIndex_3, nextIndex_4)

  nextIndexMoves.filter((item) => {
    return item >= 0 && item <= 8
  })

  return startSelected.isSelected && nextIndex !== startSelected.index && nextIndex !== startSelected.index && nextIndexMoves.includes(nextIndex)
}

export const checkWinner = (map: number[]) => {
  let countBlack = 0
  let countWhite = 0

  map.forEach((item) => {
    if(item === -1) countBlack++
    else if(item === 1) countWhite++
  })

  if(countBlack === 0) return "Black"
  else if(countWhite === 0) return "White"
  else return ""
}

// Computer
const isWhiteWin = (board: Board) => {
  board.getMap().forEach((item) => {
    if(item === 1) return false
  })
  return true
}

const isBlackWin = (board: Board) => {
  board.getMap().forEach((item) => {
    if(item === -1) return false
  })
  return true
}

const isGameOver = ({moves, board}: {moves: Board[], board: Board}) => {
  return !moves.length || isBlackWin(board) || isWhiteWin(board)
}

const generateBoardNodesComputerMoves = (board: Board): Board[] => {
  const nextBoards: Board[] = []
  const whiteIndexes = board.getWhiteIndexes()
  const blackIndexes = board.getBlackIndexes()

  if(board.getIsWhiteMoved()) {
    whiteIndexes.forEach((index) => {
      const tempNextMoves = []
      if(![2, 5, 8].includes(index)) tempNextMoves.push(index + 1)
      if(![0, 3, 6].includes(index)) tempNextMoves.push(index - 1)
      tempNextMoves.push(index - 3)

      const tempFilteredMoves =  tempNextMoves.filter((item) => {
        return [-3, -2, -1].includes(item) || item >= 0 && item <= 8 && !whiteIndexes.includes(item) && !blackIndexes.includes(item)
      })

      // Create next boards
      tempFilteredMoves.forEach((item) => {
        const newBoard = new Board({
          map: board.swapMap(index, item),
          isWhiteMoved: false // Definitely white -> black
        })
        nextBoards.push(newBoard)
      })
    })
  }
  else { 
    blackIndexes.forEach((index) => {
      const tempNextMoves = []
      if(![2, 5, 8].includes(index)) tempNextMoves.push(index + 1)
      tempNextMoves.push(index + 3)
      tempNextMoves.push(index - 3)

      const tempFilteredMoves =  tempNextMoves.filter((item) => {
        return [9, 10, 11].includes(item) || item >= 0 && item <= 8 && !blackIndexes.includes(item) && !whiteIndexes.includes(item)
      })

      tempFilteredMoves.forEach((item) => {
        const newBoard = new Board({
          map: board.swapMap(index, item),
          isWhiteMoved: true // Definitely black -> white
        })
        nextBoards.push(newBoard)
      })
    })
  }

  return nextBoards
}

const generateTreeNodes = (rootBoard: Board) => { // Use BFS
  const queue = [rootBoard]
  const isVisited: {[key: string]: boolean} = {} 

  while(queue.length) {
    const temp = queue.shift()
    
    if(!temp) break;

    // if(!temp.getChildren().length) {
    //   temp.eval()
    // }

    const nextBoards = generateBoardNodesComputerMoves(temp)

    nextBoards.forEach(nextBoard => {
      if(!isVisited[`${nextBoard.getMap()}`]) {
        isVisited[`${nextBoard.getMap()}`] = true
        queue.push(nextBoard)
        temp.addChild(nextBoard)
      }
    })
  }
}


// Print maps of boards
const bfsTraversal = (rootBoard: Board) => {
  const queue = [rootBoard]

  while(queue.length) {
    const temp = queue.shift()

    if(!temp) break;

    console.log(temp.getMap());
    
    const children = temp.getChildren()
    children.forEach(child => {
      queue.push(child)
    })
  }
}

// Functions calculate values (overall value with class) of tree Nodes
const maxVal = (u: Board, h: number): number => { // u is current white's position
  // Check is end of game (on leafs of the tree)
  const moves = generateBoardNodesComputerMoves(u)
  // console.log(moves);
  if(isGameOver({moves, board: u})) {
    return u.eval()
  }
  else {
    const listV = moves.map(v => minVal(v, h - 1))
    return Math.max(...listV)
  }
}

const minVal = (v: Board, h: number): number => { // v is current white's position
  const moves = generateBoardNodesComputerMoves(v)
  // console.log(moves);
  if(isGameOver({moves, board: v})) {
    return v.eval()
  }
  else {
    const listU = moves.map(u => maxVal(u, h - 1))
    return Math.min(...listU)
  }
}

const miniMax = (u: Board): Board | null => { // u is white, v is black
  let val = -Infinity
  let nextMove: Board | null = null
  let h = 10 // deep of tree

  const moves = generateBoardNodesComputerMoves(u)
  // console.log(moves)

  moves.forEach(w => {
    // console.log(w.getOverallValue());
    const min = minVal(w, h - 1)
    if(val <= min) {
      val = min
      nextMove = w
    }
  })

  return nextMove
}


export const computerMove = (map?: number[]) => {
  const rootBoard = new Board({ map: map || START, isWhiteMoved: true })
  // generateTreeNodes(rootBoard)
  
  
  // MiniMax strategy
  const nextMove = miniMax(rootBoard)
  nextMove && console.log("Eval: ", nextMove.eval());

  return nextMove
}