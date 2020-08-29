import DefaultSettings from "./settings";
import { AppState } from "./types";

const DefaultAppState: AppState = {
  playerMove: DefaultSettings.startPlayer,
  pieces: {},
  selected: undefined,
  selectedMoves: {},
  historyMoves: {}
}

export default DefaultAppState
