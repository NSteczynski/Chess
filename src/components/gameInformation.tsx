import React from "react"
import MovesHistory from "./movesHistory"
import { Dictionary, HistoryMove } from "../core/types"

const GameInformation: React.FunctionComponent<{
  historyMoves: Dictionary<HistoryMove>
}> = ({ historyMoves }) => (
  <div className="gameInformation">
    <MovesHistory moves={historyMoves} />
  </div>
)

export default GameInformation
