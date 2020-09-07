import React from "react"
import PromotionMenu from "./promotionMenu"
import { getPositionName } from "../core/functions"
import { Dictionary, Vector, Piece, HistoryMove, PieceMove, PieceTypes } from "../core/types"

const Row: React.FunctionComponent<{
  id: number
  pieces: Dictionary<Piece>
  selectedPosition: Vector | undefined
  selectedMoves: Dictionary<PieceMove>
  lastMove: HistoryMove | undefined
  promotionPiece: Piece | undefined
  onCellClick: (position: Vector) => void
  onPromotionClick: (piece: Piece, type: PieceTypes.ROOK | PieceTypes.BISHOP | PieceTypes.QUEEN) => void
}> = ({ id, pieces, selectedPosition, selectedMoves, lastMove, promotionPiece, onCellClick, onPromotionClick }) => {
  const cells = Array(8).fill(undefined).map((v, x) => {
    const current = pieces[getPositionName({ x, y: id })]
    const isSelected = selectedPosition && selectedPosition.x === x && selectedPosition.y === id
    const isLastMove = lastMove && (lastMove.position.x === x && lastMove.position.y === id  || lastMove.piece.position.x === x && lastMove.piece.position.y === id)
    const isMove = selectedMoves[getPositionName({ x, y: id })] != undefined
    const className = "cell " + ((id + x) % 2 === 0 ? "even" : "odd") + (isMove ? " move" : "") + (isSelected || isLastMove ? " selected" : "")
    const displayPromotionMenu = promotionPiece && promotionPiece.position.x === x && promotionPiece.position.y === id
    const Type = isMove || current ? "button" : "div"

    return (
      <Type key={x} className={className} onClick={() => onCellClick({ x, y: id })}>
        {current && <span className={`piece ${current.color}`}><i className={`fas fa-chess-${current.type}`} /></span>}
        {displayPromotionMenu && promotionPiece && <PromotionMenu promotionPiece={promotionPiece} onPromotionClick={onPromotionClick} />}
      </Type>
    )
  })

  return (
    <div className="row">
      {cells}
    </div>
  )
}

export default Row
