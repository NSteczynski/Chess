import React from "react"
import Row from "./row"
import { Dictionary, Vector, Piece, HistoryMove, PieceMove } from "../core/types"

const Board: React.FunctionComponent<{
  pieces: Dictionary<Piece>
  selectedPosition: Vector | undefined
  selectedMoves: Dictionary<PieceMove>
  lastMove: HistoryMove | undefined
  onCellClick: (position: Vector) => void
}> = ({ pieces, selectedPosition, selectedMoves, lastMove, onCellClick }) => {
  const rows = Array(8).fill(undefined).map((v, y) => (
    <Row
      key={y}
      id={y}
      pieces={pieces}
      selectedPosition={selectedPosition}
      selectedMoves={selectedMoves}
      lastMove={lastMove}
      onCellClick={onCellClick}
    />
  ))

  return (
    <div className="board">
      {rows}
    </div>
  )
}

export default Board
