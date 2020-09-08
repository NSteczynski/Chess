import React from "react"
import { Piece, PieceTypes } from "../core/types"

const PromotionMenu: React.FunctionComponent<{
  promotionPiece: Piece
  onPromotionClick: (piece: Piece, type: PieceTypes.ROOK | PieceTypes.BISHOP | PieceTypes.QUEEN) => void
}> = ({ promotionPiece, onPromotionClick }) => (
  <div className={`promotionMenu ${promotionPiece.color}`}>
    <a onClick={() => onPromotionClick(promotionPiece, PieceTypes.ROOK)} className={`piece ${promotionPiece.color}`}>
      <i className={`fas fa-chess-${PieceTypes.ROOK}`} />
    </a>

    <a onClick={() => onPromotionClick(promotionPiece, PieceTypes.BISHOP)} className={`piece ${promotionPiece.color}`}>
      <i className={`fas fa-chess-${PieceTypes.BISHOP}`} />
    </a>

    <a onClick={() => onPromotionClick(promotionPiece, PieceTypes.QUEEN)} className={`piece ${promotionPiece.color}`}>
      <i className={`fas fa-chess-${PieceTypes.QUEEN}`} />
    </a>
  </div>
)

export default PromotionMenu
