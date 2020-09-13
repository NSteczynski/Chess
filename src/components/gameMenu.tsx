import React from "react"
import PlayerName from "./playerName"
import { Settings, PlayerColor } from "../core/types"

const GameMenu: React.FunctionComponent<{
  onNewGame: () => void
  onGameRematch: () => void
  onPlayerNameChange: (name: string, color: PlayerColor) => void
} & Settings> = ({ score, flip, winPlayer, onNewGame, onGameRematch, onPlayerNameChange }) => (
  <div className="gameMenu">
    <div className="container">
      <h2>{winPlayer ? `${score[winPlayer].name} has won!` : "Game Menu"}</h2>
      <div className="score">
        <p>
          <PlayerName name={score[PlayerColor.WHITE].name} color={PlayerColor.WHITE} flip={flip} onChange={!winPlayer ? onPlayerNameChange : undefined} />
          {score[PlayerColor.WHITE].value} - {score[PlayerColor.BLACK].value}
          <PlayerName name={score[PlayerColor.BLACK].name} color={PlayerColor.BLACK} flip={flip} onChange={!winPlayer ? onPlayerNameChange : undefined} />
        </p>
      </div>
      <div className="actions">
        {winPlayer && <button onClick={onGameRematch}>Rematch</button>}
        <button onClick={onNewGame}>New Game</button>
      </div>
    </div>
  </div>
)

export default GameMenu
