import { AppState, PlayerColor } from "./types";

const DefaultAppState: AppState = {
  playerMove: PlayerColor.WHITE,
  pieces: {},
  selected: undefined,
  selectedMoves: {},
  historyMoves: {}
}

export default DefaultAppState
