import React from "react"
import { Dictionary, HistoryMove } from "../core/types"
import { getMoveNotationName } from "../core/functions"

const MovesHistory: React.FunctionComponent<{
  moves: Dictionary<HistoryMove>
}> = ({ moves }) => {
  const movesInfo = Object.keys(moves).map(key => <span key={key}>{getMoveNotationName(moves[key])}{moves[key].isCheck ? "+" : ""}</span>)

  return (
    <div className="movesHistory">
      {movesInfo}
    </div>
  )
}

export default MovesHistory
