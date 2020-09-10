import React from "react"
import {getOppositeColor} from "../core/functions"
import { PlayerColor } from "../core/types"

const PlayerName: React.FunctionComponent<{
  name: string
  color: PlayerColor
  flip: boolean
}> = ({ name, color, flip }) => {
  const [fontSize, setFontSize] = React.useState<number>(26)
  const container = React.useRef<HTMLSpanElement>(null)
  const text = React.useRef<HTMLSpanElement>(null)
  const className = "playerName " + (flip ? getOppositeColor(color) : color)

  React.useEffect(() => {
    if (text.current == undefined || container.current == undefined)
      return undefined

    const containerWidth  = container.current.getBoundingClientRect().width  - 10
    const containerHeight = container.current.getBoundingClientRect().height - 10
    const textWidth  = text.current.getBoundingClientRect().width
    const textHeight = text.current.getBoundingClientRect().height

    if (textWidth <= containerWidth && textHeight <= containerHeight)
      return undefined
    return setFontSize(fontSize - 1)
  }, [name, fontSize])

  return (
    <span ref={container} className={className}>
      <span style={{ fontSize }} ref={text}>{name}</span>
    </span>
  )
}

export default PlayerName
