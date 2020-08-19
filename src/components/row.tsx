import React from "react"
import { Dictionary, Vector, PieceParams, MoveHistory, MoveTypes } from "../core/types"

const Row: React.FunctionComponent<{
  id: number
  pieces: Dictionary<PieceParams>
  lastMove: MoveHistory | undefined
  selectedPiecePosition: Vector | undefined
  selectedPieceMoves: Dictionary<MoveTypes>
  onCellClick: (position: Vector) => void
}> = ({ id, pieces, lastMove, selectedPiecePosition, selectedPieceMoves, onCellClick }) => {
  const cells = Array(8).fill(undefined).map((v, x) => {
    const currentPiece = pieces[`${x}-${id}`]
    const currentMove = selectedPieceMoves[`${x}-${id}`]
    const isSelected = selectedPiecePosition &&
                       x == selectedPiecePosition.x   && id == selectedPiecePosition.y  || lastMove && (
                       x == lastMove.newPosition.x    && id == lastMove.newPosition.y   ||
                       x == lastMove.piece.position.x && id == lastMove.piece.position.y)
    const type = (id + x) % 2 == 0 ? " even" : " odd"
    const className = "cell" + type + (currentMove != undefined ? " move" : "") + (isSelected ? " selected" : "")

    return (
      <div key={x} className={className} onClick={() => onCellClick({ x, y: id })}>
        {currentPiece && <span className={`piece ${currentPiece.color}`}><i className={`fas fa-chess-${currentPiece.type}`} /></span>}
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
