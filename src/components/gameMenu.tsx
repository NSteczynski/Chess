import React from "react"
import PlayerName from "./playerName"
import { Settings, PlayerColor } from "../core/types"

const GameMenu: React.FunctionComponent<{
  onNewGame: () => void
  onGameRematch: () => void
} & Settings> = ({ score, flip, winPlayer, onNewGame, onGameRematch }) => (
  <div className="gameMenu">
    <div className="container">
      <h2>{winPlayer ? `${score[winPlayer].name} has won!` : "Game Menu"}</h2>
      <div className="score">
        <p>
          <PlayerName name={score[PlayerColor.WHITE].name} color={PlayerColor.WHITE} flip={flip} />
          {score[PlayerColor.WHITE].value} - {score[PlayerColor.BLACK].value}
          <PlayerName name={score[PlayerColor.BLACK].name} color={PlayerColor.BLACK} flip={flip} />
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
