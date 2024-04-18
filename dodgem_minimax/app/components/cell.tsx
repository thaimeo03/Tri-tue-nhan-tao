'use client'

import { Dispatch, SetStateAction, useEffect } from "react";
import { ISelected, IStartSelected } from "../page";
import { canMoveWhite, canSelectEnd } from "../utils/rules";

interface CellProps {
  index: number
  map: number[]
  setMap: Dispatch<SetStateAction<number[]>>
  startSelected: IStartSelected
  setStartSelected: Dispatch<SetStateAction<IStartSelected>>
  endSelected: ISelected
  setEndSelected: Dispatch<SetStateAction<ISelected>>
  setIsComputerMove: Dispatch<SetStateAction<boolean>>
}

export default function Cell({ index, map, setMap, startSelected, setStartSelected, endSelected, setEndSelected, setIsComputerMove }: CellProps) {
  const handleStartSelected = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    if(canMoveWhite({map, startSelected, endSelected, index})) {
      setStartSelected({
        index: index,
        isSelected: true,
        isWhiteMoved: startSelected.isWhiteMoved
      })
    }
    else {
      if(startSelected.isSelected) {
        setStartSelected({
          index: null,
          isSelected: false,
          isWhiteMoved: startSelected.isWhiteMoved
        })
      }
    }
  }

  const handleSelectEnd = () => {
    if(canSelectEnd({startSelected, index})) {
      setEndSelected({
        index: index,
        isSelected: true
      })
    }
  }

  useEffect(() => {   
    if(startSelected.isSelected && endSelected.isSelected) {
      const newMap = [...map]
      if(startSelected.index !== null && endSelected.index !== null) {
        if(map[startSelected.index] === 1) {
          newMap[endSelected.index] = 1
        } 
        else if(map[startSelected.index] === -1) {
          newMap[endSelected.index] = -1
        }
        newMap[startSelected.index] = 0

        setEndSelected({
          index: null,
          isSelected: false
        })
        setStartSelected({
          index: null,
          isSelected: false,
          isWhiteMoved: !startSelected.isWhiteMoved
        })
        setMap(newMap)
        setIsComputerMove(true)
      }
    }
  }, [startSelected, setStartSelected, endSelected, setEndSelected, setMap, index, map, setIsComputerMove])

  return (
    <div
      className={`relative col-span-3 border border-pink-500`}
      onClick={handleSelectEnd}
    >
      {
        map[index] !== 0 ? (
          <div onClick={handleStartSelected} 
            className={`absolute w-full h-full cursor-pointer transition-all 
            ${startSelected.isSelected && index === startSelected.index && 'bg-slate-700 bg-opacity-65'}`}>

            <div className="grid place-items-center h-full">
              <div className={`w-[90px] h-[90px] rounded-full ${map[index] === 1 ? 'bg-white' : 'bg-black'}`}></div>
            </div>
          </div>
        ) : null
      }
    </div>
  )
}
