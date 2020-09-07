import React from "react"
import { Dictionary, HistoryMove } from "../core/types"
import { getMoveNotationName } from "../core/functions"

const MovesHistory: React.FunctionComponent<{
  moves: Dictionary<HistoryMove>
  lastMove: HistoryMove | undefined
  onHistoryMoveClick: (move: HistoryMove) => void
}> = ({ moves, lastMove, onHistoryMoveClick }) => {
  const movesInfo = Object.keys(moves).map(key => {
    const className = lastMove && moves[key].id == lastMove.id ? "active" : ""
    return (
      <span key={key} className={className} onClick={() => onHistoryMoveClick(moves[key])}>
        {getMoveNotationName(moves[key])}
      </span>
    )
  })

  return (
    <div className="movesHistory">
      {movesInfo}
    </div>
  )
}

export default MovesHistory
