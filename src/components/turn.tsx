import React from "react"
import { PlayerColor } from "../core/types"

const Turn: React.FunctionComponent<{
  turn: PlayerColor
}> = ({ turn }) => (
  <div className={`turnInfo ${turn}`}>
    <p>Current move</p>
  </div>
)

export default Turn
