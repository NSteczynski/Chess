import DefaultSettings from "./settings";
import { AppState } from "./types";

const DefaultAppState: AppState = {
  currentPlayerMove: DefaultSettings.startPlayer,
  pieces: [],
  selectedPiece: undefined,
  selectedPieceMoves: []
}

export default DefaultAppState