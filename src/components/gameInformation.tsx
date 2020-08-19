import React from "react"
import MovesHistory from "./movesHistory"
import { MoveHistory } from "../core/types"

const GameInformation: React.FunctionComponent<{
  movesHistory: Array<MoveHistory>
}> = ({ movesHistory }) => (
  <div className="gameInformation">
    <MovesHistory moves={movesHistory} />
  </div>
)

export default GameInformation
