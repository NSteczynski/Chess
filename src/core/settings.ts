import { Settings, PlayerColor } from "./types"

const DefaultSettings: Settings = {
  hasStarted: false,
  startPlayer: PlayerColor.WHITE,
  score: {
    [PlayerColor.WHITE]: 0,
    [PlayerColor.BLACK]: 0
  }
}

export default DefaultSettings
