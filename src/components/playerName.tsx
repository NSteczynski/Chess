import React from "react"
import {getOppositeColor} from "../core/functions"
import { PlayerColor } from "../core/types"

const PlayerName: React.FunctionComponent<{
  name: string
  color: PlayerColor
  flip: boolean
}> = ({ name, color, flip }) => {
  const [fontSize, setFontSize] = React.useState<number>(0)
  const container = React.useRef<HTMLSpanElement>(null)
  const className = "playerName " + (flip ? getOppositeColor(color) : color)

  React.useEffect(() => {
    window.addEventListener("resize", () => setFontSize(changeFontSize()))
    return window.removeEventListener("resize", () => setFontSize(changeFontSize()))
  }, [])

  React.useEffect(() => {
    return setFontSize(changeFontSize())
  }, [name, fontSize])

  const changeFontSize = (initial: number = 1, isMax?: boolean): number => {
    if (container.current == undefined || isMax)
      return initial

    const wrapper   = document.createElement("span")
    const localSpan = document.createElement("span")
    const localText = document.createTextNode(name)

    wrapper.style.position = "absolute"
    wrapper.style.opacity  = "0"
    wrapper.style.width    = "100%"
    wrapper.style.height   = "100%"
    wrapper.style.padding  = "10px"
    localSpan.style.fontSize  = initial + "px"
    localSpan.style.wordBreak = "break-word"

    localSpan.append(localText)
    wrapper.append(localSpan)
    container.current.append(wrapper)

    const containerWidth  = wrapper.getBoundingClientRect().width
    const containerHeight = wrapper.getBoundingClientRect().height
    const textElementWidth  = localSpan.getBoundingClientRect().width
    const textElementHeight = localSpan.getBoundingClientRect().height

    wrapper.remove()
    localText.remove()
    localSpan.remove()

    if (textElementWidth > containerWidth || textElementHeight > containerHeight || initial > 28)
      return changeFontSize(initial - 1, true)
    return changeFontSize(initial + 1)
  }

  return (
    <span ref={container} className={className}>
      <span style={{ fontSize }}>{name}</span>
    </span>
  )
}

export default PlayerName
