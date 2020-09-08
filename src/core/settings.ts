import { Settings, PlayerColor } from "./types"

const DefaultSettings: Settings = {
  startPlayer: PlayerColor.BLACK,
  flip: true,
  score: {
    [PlayerColor.WHITE]: 0,
    [PlayerColor.BLACK]: 0
  }
}

export default DefaultSettings
