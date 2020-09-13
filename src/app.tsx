import React from "react"
import Game  from "@components/game"
import { DefaultScoreboard, DefaultGameSettings } from "@core/defaults"
import { Scoreboard, GameSettings, PlayerColor }  from "@core/types"

const App: React.FunctionComponent<{}> = () => {
  const [scoreboard, setScoreboard] = React.useState<Scoreboard  >(DefaultScoreboard)
  const [settings  , setSettings  ] = React.useState<GameSettings>(DefaultGameSettings)

  const onSettingsChange   = (name: keyof GameSettings, value: GameSettings[keyof GameSettings]): void => setSettings(prevState => ({ ...prevState, [name]: value }))
  const setPlayerScore     = (color: PlayerColor, value: number): void => setScoreboard(prevState => ({ ...prevState, [color]: { ...prevState[color], value }}))
  const onPlayerNameChange = (name: string, color: PlayerColor): void => setScoreboard(prevState => ({ ...prevState, [color]: { ...prevState[color], name }}))

  return <Game
    scoreboard = {scoreboard}
    settings   = {settings}
    onSettingsChange   = {onSettingsChange}
    setPlayerScore     = {setPlayerScore}
    onPlayerNameChange = {onPlayerNameChange}
  />
}

export default App
