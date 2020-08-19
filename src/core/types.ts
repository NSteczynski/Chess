/** The dictionary with string as key. */
export type Dictionary<T> = { [name: string]: T }

/** The game settings. */
export interface Settings {
  /** If true then game is started. */
  hasStarted: boolean
  /** Determines which player starts the game. */
  startPlayer: PlayerColor
}

/** The app state. */
export interface AppState {
  /** The player color that has current move. */
  currentPlayerMove: PlayerColor
  /** The array list of pieces. */
  pieces: Array<PieceParams>
  /** The current selected piece. */
  selectedPiece: PieceParams | undefined
  /** The selected piece available moves. */
  selectedPieceMoves: Array<Vector>
  /** The history of moves. */
  movesHistory: Array<MoveHistory>
}

/** The vector 2D. */
export interface Vector {
  /** The parameter x. */
  x: number
  /** The parameter y. */
  y: number
}

/** The move history. */
export interface MoveHistory {
  /** The new position. */
  newPosition: Vector
  /** The moved piece. */
  piece: PieceParams
  /** The captured piece. */
  capturedPiece: PieceParams | undefined
  /** The move type. */
  type: MoveTypes
}

/** The piece parameters. */
export interface PieceParams {
  /** The piece color. */
  color: PlayerColor
  /** The piece type. */
  type: PieceTypes
  /** The piece position. */
  position: Vector
}

/** The pawn piece parameters. */
export interface PawnParams extends PieceParams {
  /** If true then piece has moved. */
  hasMoved: boolean
}

/** The player color. */
export enum PlayerColor {
  WHITE = "white",
  BLACK = "black"
}

/** The piece types. */
export enum PieceTypes {
  PAWN   = "pawn",
  KNIGHT = "knight",
  BISHOP = "bishop",
  ROOK   = "rook",
  QUEEN  = "queen",
  KING   = "king"
}

/** The moves types. */
export enum MoveTypes {
  MOVE    = "",
  CAPTURE = "x"
}

/** The piece type algebraic notation name. */
export enum PieceNotationName {
  PAWN   = "",
  KNIGHT = "N",
  BISHOP = "B",
  ROOK   = "R",
  QUEEN  = "Q",
  KING   = "K",
}
