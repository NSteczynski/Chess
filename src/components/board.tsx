import React from "react"
import Row from "./row"
import { Dictionary, Vector, PieceParams, MoveHistory, MoveTypes } from "../core/types"

const Board: React.FunctionComponent<{
  pieces: Dictionary<PieceParams>
  lastMove: MoveHistory | undefined
  selectedPiecePosition: Vector | undefined
  selectedPieceMoves: Dictionary<MoveTypes>
  onCellClick: (position: Vector) => void
}> = ({ pieces, lastMove, selectedPiecePosition, selectedPieceMoves, onCellClick }) => {
  const rows = Array(8).fill(undefined).map((v, y) => (
    <Row
      key={y}
      id={y}
      pieces={pieces}
      lastMove={lastMove}
      selectedPiecePosition={selectedPiecePosition}
      selectedPieceMoves={selectedPieceMoves}
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
