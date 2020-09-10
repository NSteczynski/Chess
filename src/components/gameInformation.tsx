import React from "react"
import PlayerName from "./playerName"
import MovesHistory from "./movesHistory"
import { Dictionary, HistoryMove, EnumDictionary, PlayerColor, Score } from "../core/types"

const GameInformation: React.FunctionComponent<{
  score: EnumDictionary<PlayerColor, Score>
  flip: boolean
  historyMoves: Dictionary<HistoryMove>
  lastMove: HistoryMove | undefined
  isBackwardDisabled: boolean
  isForwardDisabled: boolean
  onHistoryMoveClick: (move: HistoryMove) => void
  onBackwardHistoryClick: () => void
  onForwardHistoryClick: () => void
}> = ({ score, flip, historyMoves, lastMove, onHistoryMoveClick, isBackwardDisabled, isForwardDisabled, onBackwardHistoryClick, onForwardHistoryClick }) => (
  <div className="gameInformation">
    <div className="score">
      <p>
        <PlayerName name={score[PlayerColor.WHITE].name} color={PlayerColor.WHITE} flip={flip} />
        {score[PlayerColor.WHITE].value} - {score[PlayerColor.BLACK].value}
        <PlayerName name={score[PlayerColor.BLACK].name} color={PlayerColor.BLACK} flip={flip} />
      </p>
    </div>
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
