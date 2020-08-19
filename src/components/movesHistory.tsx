import React from "react"
import { MoveHistory } from "../core/types"
import { getMoveNotationName } from "../core/functions"

const MovesHistory: React.FunctionComponent<{
  moves: Array<MoveHistory>
}> = ({ moves }) => {
  const movesInfo = moves.map((move, index) => <span key={index}>{getMoveNotationName(move)}{move.isCheck ? "+" : ""}</span>)

  return (
    <div className="movesHistory">
      {movesInfo}
    </div>
  )
}

export default MovesHistory
