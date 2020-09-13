import { Scoreboard, GameSettings, GameState, PlayerColor, CoordsPosition } from "@core/types"

/** The default scoreboard. */
export const DefaultScoreboard: Scoreboard = {
  [PlayerColor.WHITE]: {
    name: "Player1",
    value: 0
  },
  [PlayerColor.BLACK] : {
    name: "Player2",
    value: 0
  }
}

/** The default game settings. */
export const DefaultGameSettings: GameSettings = {
  coordsPosition: CoordsPosition.INSIDE,
  showGameMenu:   true,
  showCoords:     true,
  flip:           false
}

/** The default game state. */
export const DefaultGameState: GameState = {
  playerMove:    PlayerColor.WHITE,
  selectedMoves: {},
  history:       {},
  pieces:        {}
}
