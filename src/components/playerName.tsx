import React from "react"
import { PlayerColor }      from "@core/types"
import { GetOppositeColor } from "@core/functions"

const PlayerName: React.FunctionComponent<{
  name:  string
  flip:  boolean
  color: PlayerColor
  onChange?: (name: string, color: PlayerColor) => void
}> = ({ name, flip, color, onChange }) => {
  const [fontSize, setFontSize] = React.useState<number>(0)
  const container = React.useRef<HTMLSpanElement>(null)
  const className = "playerName " + (flip ? GetOppositeColor(color) : color)

  React.useEffect(() => {
    window.addEventListener("resize", () => setFontSize(changeFontSize(fontSize)))
    return window.removeEventListener("resize", () => setFontSize(changeFontSize(fontSize)))
  }, [])

  React.useEffect(() => {
    return setFontSize(changeFontSize(fontSize))
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
      {onChange == undefined ? <span style={{ fontSize }}>{name}</span> : <input type="text" style={{ fontSize }} value={name} onChange={event => onChange(event.currentTarget.value, color)} />}
    </span>
  )
}

export default PlayerName
