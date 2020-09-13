
/** The dictionary with string as key. */
export type Dictionary<T> = { [name: string]: T }

/** The dictionary with enum as key. */
export type EnumDictionary<T extends string | symbol | number, U> = { [K in T]: U }

/** The game scoreboard. */
export type Scoreboard = EnumDictionary<PlayerColor, Score>

/** The vector 2D. */
export interface Vector {
  /** The parameter x. */
  x: number
  /** The parameter y. */
  y: number
}

/** The score. */
export interface Score {
  /** The player name of the score. */
  name: string
  /** The score value. */
  value: number
}

/** The game settings. */
export interface GameSettings {
  /** The position of coordinates sytem. */
  coordsPosition: CoordsPosition
  /** Determines if game menu should be showed. */
  showGameMenu: boolean
  /** Determines if coordinates system should be showed. */
  showCoords: boolean
  /** Determines if player colors should be flipped. */
  flip: boolean
}

/** The game state. */
export interface GameState {
  /** The player color that has current move. */
  playerMove: PlayerColor
  /** The dictionary of the selected piece moves. */
  selectedMoves: Dictionary<Move>
  /** The history of the moves. */
  history: Dictionary<Move>
  /** The dictionary of the pieces. */
  pieces: Dictionary<Piece>
  /** The last move. */
  lastMove?: Move
  /** The piece that is selected. */
  selected?: Piece
  /** The player that has won. */
  winPlayer?: PlayerColor
  /** The player that want to resign. */
  resignPlayer?: PlayerColor
}

/** The player piece. */
export interface Piece {
  /** The piece color. */
  color: PlayerColor
  /** The piece type. */
  type: PieceTypes
  /** The piece position. */
  position: Vector
  /** Determines if piece has moved from the start. */
  hasMoved?: boolean
}

/** The player move. */
export interface Move {
  /** The move id. */
  id: number
  /** The move type. */
  type: MoveTypes
  /** The piece that has moved. */
  piece: Piece
  /** The position where piece has moved. */
  position: Vector
  /** The piece that has been captured. */
  captured?: Piece
  /** The piece promotion on move. */
  promotion?: PieceTypes.ROOK | PieceTypes.BISHOP | PieceTypes.QUEEN | "waiting"
  /** Determines if move provides check. */
  isCheck?: boolean
  /** Determines if move provides checkmate. */
  isCheckmate?: boolean
}

/** The player color. */
export enum PlayerColor {
  WHITE = "white",
  BLACK = "black"
}

/** The position of coordinates sytem. */
export enum CoordsPosition {
  OUTSIDE = "outside",
  INSIDE  = "inside"
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
  MOVE       = "",
  CAPTURE    = "x",
  K_CASTLING = "0-0",
  Q_CASTLING = "0-0-0",
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
