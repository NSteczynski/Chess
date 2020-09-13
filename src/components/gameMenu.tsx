import React      from "react"
import PlayerName from "@components/playerName"
import { Scoreboard, PlayerColor } from "@core/types"

const GameMenu: React.FunctionComponent<{
  hidden:       boolean
  score:        Scoreboard
  flip:         boolean
  winPlayer:    PlayerColor | undefined
  resignPlayer: PlayerColor | undefined
  onGameRematch:      () => void
  onNewGame:          () => void
  onResignCancel:     () => void
  onResign:           () => void
  onPlayerNameChange: (name: string, color: PlayerColor) => void
}> = ({ hidden, score, flip, winPlayer, resignPlayer, onGameRematch, onNewGame, onResignCancel, onResign, onPlayerNameChange }) => {
  if (hidden)
    return null

  return resignPlayer ? (
    <div className="gameMenu">
      <div className="content">
        <h2>Resignation</h2>
        <p>Are You sure You want to resign, {score[resignPlayer].name}?</p>
        <div className="actions">
          <button onClick={onResignCancel}>Cancel</button>
          <button onClick={onResign      }>Resign</button>
        </div>
      </div>
    </div>
  ) : (
    <div className="gameMenu">
      <div className="content">
        <h2>{winPlayer ? `${score[winPlayer].name} has won!` : "Game Menu"}</h2>
        <div className="score">
          <PlayerName name={score[PlayerColor.WHITE].name} flip={flip} color={PlayerColor.WHITE} onChange={!winPlayer ? onPlayerNameChange : undefined} />
          {score[PlayerColor.WHITE].value} - {score[PlayerColor.BLACK].value}
          <PlayerName name={score[PlayerColor.BLACK].name} flip={flip} color={PlayerColor.BLACK} onChange={!winPlayer ? onPlayerNameChange : undefined} />
        </div>
        <div className="actions">
          {winPlayer && <button onClick={onGameRematch}>Rematch</button>}
          <button onClick={onNewGame}>New Game</button>
        </div>
      </div>
    </div>
  )
}

export default GameMenu
