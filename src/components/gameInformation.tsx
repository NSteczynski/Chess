import React      from "react"
import PlayerName from "@components/playerName"
import { Dictionary, Move, Scoreboard, PlayerColor } from "@core/types"
import { GetMoveNotationName }                       from "@core/functions"

const GameInformation: React.FunctionComponent<{
  score:                  Scoreboard
  flip:                   boolean
  history:                Dictionary<Move>
  lastMove:               Move | undefined
  isShowGameMenuDisabled: boolean
  isResignationDisabled:  boolean
  isBackwardDisabled:     boolean
  isForwardDisabled:      boolean
  onHistoryMoveClick:     (move: Move) => void
  onShowGameMenuClick:    () => void
  onResignationClick:     () => void
  onBackwardHistoryClick: () => void
  onForwardHistoryClick:  () => void
}> = ({ score, flip, history, lastMove, isShowGameMenuDisabled, isResignationDisabled, isBackwardDisabled, isForwardDisabled, onHistoryMoveClick, onShowGameMenuClick, onResignationClick, onBackwardHistoryClick, onForwardHistoryClick}) => {
  const historyMoves = Object.keys(history).map(key => {
    const className = lastMove && history[key].id === lastMove.id ? "active" : ""
    return (
      <a key={key} className={className} onClick={() => onHistoryMoveClick(history[key])}>
        {GetMoveNotationName(history[key])}
      </a>
    )
  })

  return (
    <div className="gameInformation">
      <div className="score">
        <PlayerName name={score[PlayerColor.WHITE].name} flip={flip} color={PlayerColor.WHITE} />
        {score[PlayerColor.WHITE].value} - {score[PlayerColor.BLACK].value}
        <PlayerName name={score[PlayerColor.BLACK].name} flip={flip} color={PlayerColor.BLACK} />
      </div>
      <div className="history">
        <div className="moves">
          {historyMoves}
        </div>
      </div>
      <div className="actions">
      <button onClick={onShowGameMenuClick   } disabled={isShowGameMenuDisabled}><i className="fas fa-plus"          /></button>
      <button onClick={onResignationClick    } disabled={isResignationDisabled }><i className="fas fa-flag"          /></button>
      <button onClick={onBackwardHistoryClick} disabled={isBackwardDisabled    }><i className="fas fa-chevron-left"  /></button>
      <button onClick={onForwardHistoryClick } disabled={isForwardDisabled     }><i className="fas fa-chevron-right" /></button>
      </div>
    </div>
  )
}

export default GameInformation
