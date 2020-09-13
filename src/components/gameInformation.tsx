import React from "react"
import PlayerName from "./playerName"
import MovesHistory from "./movesHistory"
import { Dictionary, HistoryMove, EnumDictionary, PlayerColor, Score } from "../core/types"

const GameInformation: React.FunctionComponent<{
  score: EnumDictionary<PlayerColor, Score>
  flip: boolean
  historyMoves: Dictionary<HistoryMove>
  lastMove: HistoryMove | undefined
  isShowGameMenuDisabled: boolean
  isBackwardDisabled: boolean
  isForwardDisabled: boolean
  onHistoryMoveClick: (move: HistoryMove) => void
  onShowGameMenuClick: () => void
  onBackwardHistoryClick: () => void
  onForwardHistoryClick: () => void
}> = ({ score, flip, historyMoves, lastMove, onHistoryMoveClick, isShowGameMenuDisabled, isBackwardDisabled, isForwardDisabled, onShowGameMenuClick, onBackwardHistoryClick, onForwardHistoryClick }) => (
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
      <button onClick={onShowGameMenuClick   } disabled={isShowGameMenuDisabled}><i className="fas fa-plus" /></button>
      <button onClick={onBackwardHistoryClick} disabled={isBackwardDisabled    }><i className="fas fa-chevron-left"  /></button>
      <button onClick={onForwardHistoryClick } disabled={isForwardDisabled     }><i className="fas fa-chevron-right" /></button>
    </div>
  </div>
)

export default GameInformation
