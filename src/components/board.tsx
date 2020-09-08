import React from "react"
import Row from "./row"
import { Dictionary, Vector, Piece, HistoryMove, PieceMove, PieceTypes, PlayerColor } from "../core/types"

const Board: React.FunctionComponent<{
  playerMove: PlayerColor
  pieces: Dictionary<Piece>
  flip: boolean
  selectedPosition: Vector | undefined
  selectedMoves: Dictionary<PieceMove>
  lastMove: HistoryMove | undefined
  promotionPiece: Piece | undefined
  disabled: boolean
  onCellClick: (position: Vector) => void
  onPromotionClick: (piece: Piece, type: PieceTypes.ROOK | PieceTypes.BISHOP | PieceTypes.QUEEN) => void
}> = ({ playerMove, pieces, flip, selectedPosition, selectedMoves, lastMove, promotionPiece, disabled, onCellClick, onPromotionClick }) => {
  const rows = Array(8).fill(undefined).map((v, y) => (
    <Row
      key={y}
      id={y}
      playerMove={playerMove}
      pieces={pieces}
      flip={flip}
      selectedPosition={selectedPosition}
      selectedMoves={selectedMoves}
      lastMove={lastMove}
      promotionPiece={promotionPiece}
      disabled={disabled}
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
