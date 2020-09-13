/** The dictionary with string as key. */
export type Dictionary<T> = { [name: string]: T }

/** The dictionary with enum as key. */
export type EnumDictionary<T extends string | symbol | number, U> = { [K in T]: U }

/** The vector 2D. */
export interface Vector {
  /** The parameter x. */
  x: number
  /** The parameter y. */
  y: number
}

/** The game settings. */
export interface Settings {
  /** Determines if players should change colors. */
  flip: boolean
  /** The game score. */
  score: EnumDictionary<PlayerColor, Score>
  /** Determines if game menu should be visible. */
  showGameMenu: boolean
  /** The player that has won. */
  winPlayer?: PlayerColor
}

/** The game score. */
export interface Score {
  /** The player name of the score. */
  name: string
  /** The score value. */
  value: number
}

/** The app state. */
export interface AppState {
  /** Determines which player has move. */
  playerMove: PlayerColor
  /** The dictionary of the pieces. */
  pieces: Dictionary<Piece>
  /** The dictionary of the selected piece possible moves. */
  selectedMoves: Dictionary<PieceMove>
  /** The history of the moves. */
  historyMoves: Dictionary<HistoryMove>
  /** The selected piece. */
  selected?: Piece
  /** The last move played. */
  lastMove?: HistoryMove
  /** The piece that will be promoted. */
  promotionPiece?: Piece
}

/** The piece. */
export interface Piece {
  /** The piece color. */
  color: PlayerColor
  /** The piece type. */
  type: PieceTypes
  /** The piece position. */
  position: Vector
  /** Determines if the piece has moved from the start. */
  hasMoved?: boolean
}

/** The piece move. */
export interface PieceMove {
  /** The move type. */
  type: MoveTypes
  /** The move position. */
  position: Vector
  /** The piece that has been captured in move. */
  captured?: Piece
  /** Determines if piece should promote. Only works if piece.type is PieceTypes.PAWN. */
  promotion?: boolean
}

/** The history move. */
export interface HistoryMove {
  /** The move id. */
  id: number
  /** The move type. */
  type: MoveTypes
  /** The piece that has moved. */
  piece: Piece
  /** The position where piece has moved. */
  position: Vector
  /** The piece that has been captured in move. */
  captured?: Piece
  /** Determines if move provides the check. */
  isCheck?: boolean
  /** Determines if move ends game. */
  isCheckmate?: boolean
  /** The piece promotion. */
  promotion?: PieceTypes.ROOK | PieceTypes.BISHOP | PieceTypes.QUEEN
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
