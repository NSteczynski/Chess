import { Settings, PlayerColor } from "./types"

const DefaultSettings: Settings = {
  flip: false,
  score: {
    [PlayerColor.WHITE]: { name: "Player1", value: 0 },
    [PlayerColor.BLACK]: { name: "Player2", value: 0 }
  },
  showGameMenu: true
}

export default DefaultSettings
