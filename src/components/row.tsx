import React from "react"
import PromotionMenu from "./promotionMenu"
import { getPositionName } from "../core/functions"
import { Dictionary, Vector, Piece, HistoryMove, PieceMove, PieceTypes, PlayerColor } from "../core/types"

const Row: React.FunctionComponent<{
  id: number
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
}> = ({ id, playerMove, pieces, flip, selectedPosition, selectedMoves, lastMove, promotionPiece, disabled, onCellClick, onPromotionClick }) => {
  const cells = Array(8).fill(undefined).map((v, x) => {
    const cellPosition = { x, y: flip ? 7 - id : id }
    const current = pieces[getPositionName(cellPosition)]
    const isSelected = selectedPosition && selectedPosition.x === cellPosition.x && selectedPosition.y === cellPosition.y
    const isLastMove = lastMove && (lastMove.position.x === cellPosition.x && lastMove.position.y === cellPosition.y  || lastMove.piece.position.x === cellPosition.x && lastMove.piece.position.y === cellPosition.y)
    const isMove = selectedMoves[getPositionName(cellPosition)] != undefined
    const className = "cell " + ((id + x) % 2 === 0 ? "even" : "odd") + (isMove ? " move" : "") + (isSelected || isLastMove ? " selected" : "")
    const displayPromotionMenu = promotionPiece && promotionPiece.position.x === cellPosition.x && promotionPiece.position.y === cellPosition.y
    const Type = isMove || current && !disabled && current.color === playerMove ? "a" : "div"

    return (
      <Type key={x} className={className} onClick={() => onCellClick(cellPosition)}>
        {current && <span className={`piece ${current.color}`}><i className={`fas fa-chess-${current.type}`} /></span>}
        {displayPromotionMenu && promotionPiece && <PromotionMenu flip={flip} promotionPiece={promotionPiece} onPromotionClick={onPromotionClick} />}
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
