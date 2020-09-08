import React from "react"
import MovesHistory from "./movesHistory"
import { Dictionary, HistoryMove } from "../core/types"

const GameInformation: React.FunctionComponent<{
  historyMoves: Dictionary<HistoryMove>
  lastMove: HistoryMove | undefined
  isBackwardDisabled: boolean
  isForwardDisabled: boolean
  onHistoryMoveClick: (move: HistoryMove) => void
  onBackwardHistoryClick: () => void
  onForwardHistoryClick: () => void
}> = ({ historyMoves, lastMove, onHistoryMoveClick, isBackwardDisabled, isForwardDisabled, onBackwardHistoryClick, onForwardHistoryClick }) => (
  <div className="gameInformation">
    <MovesHistory
      moves={historyMoves}
      lastMove={lastMove}
      onHistoryMoveClick={onHistoryMoveClick}
    />
    <div className="actions">
      <button onClick={onBackwardHistoryClick} disabled={isBackwardDisabled}><i className="fas fa-chevron-left" ></i></button>
      <button onClick={onForwardHistoryClick } disabled={isForwardDisabled }><i className="fas fa-chevron-right"></i></button>
    </div>
  </div>
)

export default GameInformation
