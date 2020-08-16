/** The dictionary with string as key. */
export type Dictionary<T> = { [name: string]: T }

/** The dictionary with enum (string | number values) as key. */
export type EnumDictionary<K extends string | symbol | number, T> = { [P in K]: T }

/** The game settings. */
export interface Settings {
  /** If true then game is started. */
  isStarted: boolean
  /** Determines which player move is. */
  playerMove: PlayerColor
}

/** The vector 2D. */
export interface Vector {
  /** The parameter x. */
  x: number
  /** The parameter y. */
  y: number
}

/** The piece parameters. */
export interface PieceParams {
  /** The piece id. */
  id: number
  /** The piece color. */
  color: PlayerColor
  /** The piece type. */
  type: PieceTypes
  /** The piece position. */
  position: Vector
  /** If true then piece is destroyed. */
  isDestroyed?: boolean
}

/** The pawn piece parameters. */
export interface PawnParams extends PieceParams {
  /** If true then piece can only move 1 position. */
  movedFromStart: boolean
}

/** The player color. */
export enum PlayerColor {
  WHITE = "white",
  BLACK = "black"
}

export enum PieceTypes {
  PAWN = "pawn",
  KNIGHT = "knight",
  BISHOP = "bishop",
  ROOK = "rook",
  QUEEN = "queen",
  KING = "king"
}
