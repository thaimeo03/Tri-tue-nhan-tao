export class Board {
  private map: number[]
  // private whiteValues: number[] = [30, 35, 40, 15, 20, 25, 0,  5, 10]
  private blackValues: number[] = [-10, -25, -40, -5, -20, -35, 0, -15, -30]
  private overallValue: number = 0
  private children: Board[] = []
  private isWhiteMoved: boolean

  constructor({map, isWhiteMoved}: {map: number[], isWhiteMoved: boolean}) {
    this.map = map
    this.isWhiteMoved = isWhiteMoved
  }

  getChildren() {
    return this.children
  }

  getIsWhiteMoved() {
    return this.isWhiteMoved
  }

  getWhiteIndexes() {
    const indexes: number[] = []
    this.map.forEach((value, index) => {
      if(value === 1) {
        indexes.push(index)
      }
    })
    return indexes
  }

  getBlackIndexes() {
    const indexes: number[] = []
    this.map.forEach((value, index) => {
      if(value === -1) {
        indexes.push(index)
      }
    })
    return indexes
  }

  // getOverallValue() {
  //   return this.overallValue
  // }

  // setOverallValue(value: number) {
  //   this.overallValue = value
  // }

  // calculateAndSetOverallValue() {
  //   if(this.isWhiteMoved) {
  //     let overallWhiteValue = 0
  //     const whiteIndexes = this.getWhiteIndexes()
  //     whiteIndexes.forEach((index) => {
  //       overallWhiteValue += this.getWhiteValue(index)
  //     })
  //     // this.setOverallValue(overallWhiteValue)
  //     return overallWhiteValue
  //   } else {
  //     let overallBlackValue = 0
  //     const blackIndexes = this.getBlackIndexes()
  //     blackIndexes.forEach((index) => {
  //       overallBlackValue += this.getBlackValue(index)
  //     })
  //     // this.setOverallValue(overallBlackValue)
  //     return overallBlackValue
  //   }
  // }

  // eval() {
  //   let overallBlackValue = 0
  //   const blackIndexes = this.getBlackIndexes()
  //   blackIndexes.forEach((index) => {
  //     overallBlackValue += this.getBlackValue(index)
  //   })
  //   // this.setOverallValue(overallBlackValue)
  //   return overallBlackValue
  // }

  eval() {
    // Calculate overall values base on position of blacks and whites
    let overallBlackValue = 0
    const blackIndexes = this.getBlackIndexes()
    // if(blackIndexes.length === 1) overallBlackValue += -50
    blackIndexes.forEach((index) => {
      overallBlackValue += this.getBlackValue(index)
      
      if(this.map[index+3] && this.map[index+3] === 1 && ![6, 7, 8].includes(index)) {
        overallBlackValue += -40 // Direct impact
      }
      if(this.map[index+6] && this.map[index+6] === 1 && [0, 1, 2].includes(index)) {
        overallBlackValue += -30 // Indirect impact
      }
    })
    
    let overallWhiteValue = 0
    const whiteIndexes = this.getWhiteIndexes()

    whiteIndexes.forEach((index) => {
      // overallWhiteValue += this.getWhiteValue(index)

      if(this.map[index-1] && this.map[index-1] === -1 && ![0, 3, 6].includes(index)) {
        overallWhiteValue += 40 // Direct impact
      }
      if(this.map[index-2] && this.map[index-2] === -1 && [2, 5, 8].includes(index)) {
        overallWhiteValue += 30 // Indirect impact
      }
    })

    return overallBlackValue + overallWhiteValue
  }

  getMap() {
    return this.map
  }

  // getWhiteValue(index: number) {
  //   return this.whiteValues[index]
  // }

  getBlackValue(index: number) {
    return this.blackValues[index]
  }

  swapMap(index1: number, index2: number) {
    const newMap = [...this.map]
    if(![-3, -2, -1].includes(index2) && ![9, 10, 11].includes(index2)) {
      const temp = newMap[index1]
      newMap[index1] = newMap[index2]
      newMap[index2] = temp
    }
    else {
      newMap[index1] = 0
    }

    return newMap
  }

  addChild(board: Board) {
    this.children.push(board)
  }
}