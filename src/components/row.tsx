import React from "react"
import { Dictionary, Vector, PieceParams } from "../core/types"

const Row: React.FunctionComponent<{
  id: number
  pieces: Dictionary<PieceParams>
  selectedPiecePosition: Vector | undefined
  selectedPieceMoves: Dictionary<boolean>
  onCellClick: (position: Vector) => void
}> = ({ id, pieces, selectedPiecePosition, selectedPieceMoves, onCellClick }) => {
  const cells = Array(8).fill(undefined).map((v, x) => {
    const currentPiece = pieces[`${x}-${id}`]
    const currentMove = selectedPieceMoves[`${x}-${id}`]
    const isSelected = { x, y: id } == selectedPiecePosition
    const type = (id + x) % 2 == 0 ? " even" : " odd"
    const className = "cell" + type + (currentMove ? " move" : "") + (isSelected ? " selected" : "")

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
