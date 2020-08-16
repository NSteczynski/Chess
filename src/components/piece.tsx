import React from "react"
import { PieceParams, Vector, PlayerColor, PieceTypes } from "../core/types"

const Piece: React.FunctionComponent<{
  onClick: (position: Vector, color: PlayerColor, type: PieceTypes) => void
} & PieceParams> = ({ id, color, type, position, onClick }) => {
  return <span className={`piece ${color}`} onClick={() => onClick(position, color, type)}><i className={`fas fa-chess-${type}`} /></span>
}

export default Piece
