import React         from "react"
import PromotionMenu from "@components/promotionMenu"
import { Dictionary, Vector, Move, Piece, PlayerColor, PieceTypes } from "@core/types"
import { GetPositionName, xCoords as GetXCoords }                   from "@core/functions"

const Board: React.FunctionComponent<{
  playerMove:       PlayerColor
  pieces:           Dictionary<Piece>
  flip:             boolean
  lastMove:         Move | undefined
  selectedPosition: Vector | undefined
  selectedMoves:    Dictionary<Move>
  disabled:         boolean
  onPromotionClick: (piece: Piece, type: PieceTypes.ROOK | PieceTypes.BISHOP | PieceTypes.QUEEN) => void
  onClick:          (position: Vector) => void
}> = ({ playerMove, pieces, flip, lastMove, selectedPosition, selectedMoves, disabled, onPromotionClick, onClick}) => (
  <div className="board">
    {Array(8).fill(undefined).map((i, y) => (
      <div key={y} className="row">
        {Array(8).fill(undefined).map((j, x) => {
          const position: Vector     = { x, y: flip ? 7 - y : y }
          const displayPromotionMenu = lastMove && lastMove.promotion == "waiting" && lastMove.position.x === position.x && lastMove.position.y === position.y
          const piece      = pieces[GetPositionName(position)]
          const isSelected = selectedPosition && selectedPosition.x === position.x && selectedPosition.y === position.y
          const isLastMove = lastMove && (lastMove.position.x === position.x && lastMove.position.y === position.y || lastMove.piece.position.x === position.x && lastMove.piece.position.y === position.y)
          const isMove     = selectedMoves[GetPositionName(position)]
          const xCoords    = y === 7 ? GetXCoords[x] : undefined
          const yCoords    = x === 0 ? 7 - y + 1     : undefined
          const className  = "cell " + ((x + y) % 2 === 0 ? "even" : "odd") + (isMove ? " move" : "") + (isSelected || isLastMove ? " selected" : "")
          const Type       = isMove || piece && !disabled && piece.color === playerMove ? "a": "div"

          return (
            <Type key={x} className={className} onClick={() => onClick(position)}>
              {piece && <span className={`piece ${piece.color}`}><i className={`fas fa-chess-${piece.type}`} /></span>}
              {displayPromotionMenu && lastMove && <PromotionMenu flip={flip} promotionPiece={piece} onPromotionClick={onPromotionClick} />}
              {xCoords != undefined && <span className="xCoords">{xCoords}</span>}
              {yCoords != undefined && <span className="yCoords">{yCoords}</span>}
            </Type>
          )
        })}
      </div>
    ))}
  </div>
)

export default Board
