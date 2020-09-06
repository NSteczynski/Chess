import React from "react"
import { Settings, PlayerColor } from "../core/types"

const GameMenu: React.FunctionComponent<{
  onGameStart: () => void
} & Settings> = ({ hasStarted, startPlayer, score, onGameStart }) => {
  if (hasStarted)
    return null

  return (
    <div className="gameMenu">
      <div className="container">
        <h2>Game Menu</h2>
        <div className="score">
          <p><span className="white" /> {score[PlayerColor.WHITE]} - {score[PlayerColor.BLACK]} <span className="black" /></p>
        </div>
        <button onClick={onGameStart}>Start Game</button>
      </div>
    </div>
  )
}

export default GameMenu
