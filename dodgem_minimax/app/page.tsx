'use client'
import { useEffect, useState } from "react";
import Cell from "./components/cell";
import { START } from "./constants/start";
import Arrow from "./components/arrow";
import { checkWinner, computerMove } from "./utils/rules";
import { Board } from "./utils/board";

export interface ISelected {
  index: number | null
  isSelected: boolean
}

export interface IStartSelected extends ISelected {
  isWhiteMoved: boolean
}


export default function Home() {
  const [map, setMap] = useState(START)
  const [startSelected, setStartSelected] = useState<IStartSelected>({
    index: null, 
    isSelected: false,
    isWhiteMoved: true
  })
  const [endSelected, setEndSelected] = useState<ISelected>({
    index: null,
    isSelected: false
  })

  const [isComputerMove, setIsComputerMove] = useState(true) 

  const [winner, setWinner] = useState<string>("")

  useEffect(() => {
    setWinner(checkWinner(map))
  }, [map])

  const handleReset = () => {
    setMap(START)
    setStartSelected({
      index: null,
      isSelected: false,
      isWhiteMoved: true
    })
    setEndSelected({
      index: null,
      isSelected: false
    })
    // setCountWhite(0)
    // setCountBlack(0)
    setWinner("")
    setIsComputerMove(true)
  }

  // Computer
  useEffect(() => {
    const handleMove = (nextBoard: Board) => {
      setMap(nextBoard.getMap())
      setStartSelected({
        index: null,
        isSelected: false,
        isWhiteMoved: false
      })
      setIsComputerMove(false)
    }
    
    if(isComputerMove) {
      const nextBoard = computerMove(map)
      console.log(nextBoard)
      if(nextBoard) {
        setTimeout(() => handleMove(nextBoard), 500)
      }
    }
  }, [isComputerMove, map, endSelected, setMap])

  return (
    <main className="h-screen grid place-items-center">
      <div className={`absolute font-bold left-1/4 top-1/2 -translate-y-1/2`}>
        <button onClick={handleReset} type="button" className="px-4 py-2 border rounded-md hover:bg-rose-500 transition hover:scale-110">Reset</button>
      </div>

      <div className="relative w-[350px] h-[350px] bg-slate-400">
        <Arrow direction="top" map={map} setMap={setMap} startSelected={startSelected} setStartSelected={setStartSelected} setIsComputerMove={setIsComputerMove}/>
        <Arrow direction="right" map={map} setMap={setMap} startSelected={startSelected} setStartSelected={setStartSelected} setIsComputerMove={setIsComputerMove}/>

        <div className="h-full grid grid-cols-9">
          {
            map.map((_, index) => <Cell key={index} index={index} 
             map={map} setMap={setMap}
             startSelected={startSelected}
             setStartSelected={setStartSelected}
             endSelected={endSelected}
             setEndSelected={setEndSelected}
             setIsComputerMove={setIsComputerMove}
            />)
          }
        </div>

        {/* <div className="absolute top-0 -left-20 bottom-1/2 translate-y-1/2 flex items-center">
          <div>
            Black: {countBlack}
          </div>
        </div> */}

        {/* <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <div>
            White: {countWhite}
          </div>
        </div> */}
      </div>

      {
        winner && (
          <div className={`absolute text-red-600 text-3xl font-bold right-[10%] top-1/2 -translate-y-1/2`}>{winner} Winner</div>
        )
      }
    </main>
  );
}
