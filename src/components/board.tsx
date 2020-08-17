import React from "react"
import Row from "./row"
import { Dictionary, Vector, PieceParams } from "../core/types"

const Board: React.FunctionComponent<{
  pieces: Dictionary<PieceParams>
  selectedPiecePosition: Vector | undefined
  selectedPieceMoves: Dictionary<boolean>
  onCellClick: (position: Vector) => void
}> = ({ pieces, selectedPiecePosition, selectedPieceMoves, onCellClick }) => {
  const rows = Array(8).fill(undefined).map((v, y) => (
    <Row
      key={y}
      id={y}
      pieces={pieces}
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
