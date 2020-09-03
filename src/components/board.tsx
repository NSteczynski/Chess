import React from "react"
import Row from "./row"
import { Dictionary, Vector, Piece, HistoryMove, PieceMove, PieceTypes } from "../core/types"

const Board: React.FunctionComponent<{
  pieces: Dictionary<Piece>
  selectedPosition: Vector | undefined
  selectedMoves: Dictionary<PieceMove>
  lastMove: HistoryMove | undefined
  promotionPiece: Piece | undefined
  onCellClick: (position: Vector) => void
  onPromotionClick: (piece: Piece, type: PieceTypes.ROOK | PieceTypes.BISHOP | PieceTypes.QUEEN) => void
}> = ({ pieces, selectedPosition, selectedMoves, lastMove, promotionPiece, onCellClick, onPromotionClick }) => {
  const rows = Array(8).fill(undefined).map((v, y) => (
    <Row
      key={y}
      id={y}
      pieces={pieces}
      selectedPosition={selectedPosition}
      selectedMoves={selectedMoves}
      lastMove={lastMove}
      promotionPiece={promotionPiece}
      onCellClick={onCellClick}
      onPromotionClick={onPromotionClick}
    />
  ))

  return (
    <div className="board">
      {rows}
    </div>
  )
}

export default Board
