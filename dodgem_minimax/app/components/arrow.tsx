import { IStartSelected } from "../page";

interface ArrowProps {
  direction: 'top' | 'right',
  map: number[],
  setMap: React.Dispatch<React.SetStateAction<number[]>>,
  startSelected: IStartSelected,
  setStartSelected: React.Dispatch<React.SetStateAction<IStartSelected>>,
  setIsComputerMove: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function Arrow({ direction, map, setMap, startSelected, setStartSelected, setIsComputerMove }: ArrowProps) {
  const handleClick = () => {
    if(direction === 'top' && startSelected.isWhiteMoved) {
      if(startSelected.isSelected && startSelected.index !== null && [0, 1, 2].includes(startSelected.index)) {
        map[startSelected.index] = 0
        setMap(map)
        setStartSelected({
          index: null,
          isSelected: false,
          isWhiteMoved: false
        })
      }
    } else {
      if(direction === 'right' && !startSelected.isWhiteMoved) {
        if(startSelected.isSelected && startSelected.index !== null && [2, 5, 8].includes(startSelected.index)) {
          map[startSelected.index] = 0
          setMap(map)
          setIsComputerMove(true)
          setStartSelected({
            index: null,
            isSelected: false,
            isWhiteMoved: true
          })
        }
      }
    }
  }

  return (
    <div onClick={handleClick} className={`absolute ${direction === 'right' ? '-right-12 bottom-1/2 translate-y-1/2' : '-top-12 left-1/2 -translate-x-1/2 -rotate-90'}`}>
      <div className="text-3xl text-rose-500 font-extrabold cursor-pointer transition hover:scale-125">-&gt;</div>
    </div>
  )
}
