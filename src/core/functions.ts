import { PieceTypes, HistoryMove, MoveTypes, PieceNotationName, Vector } from "./types"

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

  if (move.piece.type === PieceTypes.PAWN && move.type === MoveTypes.CAPTURE)
    return xCoords[move.piece.position.x] + move.type + coords
  return pieceNotationName + move.type + coords
}

/**
 * Returns the position as name.
 * @param position The position.
 */
export const getPositionName = (position: Vector): string => {
  return position.x + "-" + position.y
}
