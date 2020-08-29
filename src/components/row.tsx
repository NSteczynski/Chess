import React from "react"
import { Dictionary, Vector, Piece, HistoryMove, PieceMove } from "../core/types"
import {getPositionName} from "../core/functions"

const Row: React.FunctionComponent<{
  id: number
  pieces: Dictionary<Piece>
  selectedPosition: Vector | undefined
  selectedMoves: Dictionary<PieceMove>
  lastMove: HistoryMove | undefined
  onCellClick: (position: Vector) => void
}> = ({ id, pieces, selectedPosition, selectedMoves, lastMove, onCellClick }) => {
  const cells = Array(8).fill(undefined).map((v, x) => {
    const current = pieces[getPositionName({ x, y: id })]
    const isSelected = selectedPosition && selectedPosition.x === x && selectedPosition.y === id
    const isLastMove = lastMove && (lastMove.position.x === x && lastMove.position.y === id  || lastMove.piece.position.x === x && lastMove.piece.position.y === id)
    const type = (id + x) % 2 === 0 ? "even" : "odd"
    const className = "cell " + type + (selectedMoves[getPositionName({ x, y: id })] != undefined ? " move" : "") + (isSelected || isLastMove ? " selected" : "")

    return (
      <div key={x} className={className} onClick={() => onCellClick({ x, y: id })}>
        {current && <span className={`piece ${current.color}`}><i className={`fas fa-chess-${current.type}`} /></span>}
      </div>
    )
  })

  return (
    <div className="row">
      {cells}
    </div>
  )
}

export default Row
