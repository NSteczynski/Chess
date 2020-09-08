import { PieceTypes, HistoryMove, MoveTypes, PieceNotationName, Vector, PlayerColor, Dictionary } from "./types"

/** The x coordinates. */
export const xCoords = ["a", "b", "c", "d", "e", "f", "g", "h"]

/**
 * Returns the move notation name.
 * @param move The move history.
 */
export const getMoveNotationName = (move: HistoryMove): string => {
  if (move.type === MoveTypes.Q_CASTLING || move.type === MoveTypes.K_CASTLING)
    return move.type
  const pieceNotationName = PieceNotationName[move.piece.type.toUpperCase() as keyof typeof PieceNotationName]
  const coords = xCoords[move.position.x] + (8 - move.position.y)
  const promotion = move.promotion ? "=" + PieceNotationName[move.promotion.toUpperCase() as keyof typeof PieceNotationName] : ""
  const check = move.isCheckmate ? "#" : move.isCheck ? "+" : ""

  if (move.piece.type === PieceTypes.PAWN && move.type === MoveTypes.CAPTURE)
    return xCoords[move.piece.position.x] + move.type + coords + promotion + check
  return pieceNotationName + move.type + coords + promotion + check
}

/**
 * Returns the position as name.
 * @param position The position.
 */
export const getPositionName = (position: Vector): string => {
  return position.x + "-" + position.y
}

/**
 * Returns the opposite color.
 * @param color The color that must be switched.
 */
export const getOppositeColor = (color: PlayerColor): PlayerColor => {
  return color === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE
}

/**
 * Returns the last object in dictionary.
 * @param dictionary The dictionary wich objects.
 */
export const getLastObject = <T>(dictionary: Dictionary<T>): T => {
  return dictionary[Object.keys(dictionary)[Object.keys(dictionary).length - 1]]
}
