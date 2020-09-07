import React from "react"
import MovesHistory from "./movesHistory"
import { Dictionary, HistoryMove } from "../core/types"

const GameInformation: React.FunctionComponent<{
  historyMoves: Dictionary<HistoryMove>
  lastMove: HistoryMove | undefined
  onHistoryMoveClick: (move: HistoryMove) => void
}> = ({ historyMoves, lastMove, onHistoryMoveClick }) => (
  <div className="gameInformation">
    <MovesHistory
      moves={historyMoves}
      lastMove={lastMove}
      onHistoryMoveClick={onHistoryMoveClick}
    />
  </div>
)

export default GameInformation
