import React from "react"
import Piece from "./piece"
import { Dictionary, PieceParams, Vector, PlayerColor, PieceTypes } from "../core/types"

const Board: React.FunctionComponent<{
  pieces: Dictionary<PieceParams>
  moves: Dictionary<boolean>
  selectedPiece: Vector | undefined
  onPieceClick: (postion: Vector, color: PlayerColor, type: PieceTypes) => void
  onMoveClick: (position: Vector) => void
  onCellClick: () => void
}> = ({ pieces, moves, selectedPiece, onPieceClick, onMoveClick, onCellClick }) => {
  const board: Array<JSX.Element> = []

  for (let y = 0; y < 8; ++y) {
    const row: Array<JSX.Element> = []

    for (let x = 0; x < 8; ++x) {
      const piece = pieces[`${x}-${y}`]
      const move = moves[`${x}-${y}`]
      const className = "cell" + ((y + x) % 2 === 0 ? " even" : " odd") + (move ? " move" : "") + (selectedPiece && selectedPiece.x === x && selectedPiece.y === y ? " selected" : "")

      row.push(
        <div key={`cell-${x}`} className={className} onClick={() => move ? onMoveClick({ x, y }) : !piece && onCellClick()}>
          {piece && <Piece {...piece} onClick={onPieceClick} />}
        </div>
      )
    }

    board.push(
      <div key={`row-${y}`} className="row">
        {row}
      </div>
    )
  }

  return (
    <div className="board">
      {board}
    </div>
  )
}

export default Board
