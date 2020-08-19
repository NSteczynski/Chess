import { PieceTypes, MoveHistory, MoveTypes, PieceNotationName } from "./types"

/** The x coordinates. */
export const xCoords = ["a", "b", "c", "d", "e", "f", "g", "h"]

/**
 * Returns the move notation name.
 * @param move The move history.
 */
export const getMoveNotationName = (move: MoveHistory): string => {
  if (move.type === MoveTypes.Q_CASTLING || move.type === MoveTypes.K_CASTLING)
    return move.type
  const pieceNotationName = PieceNotationName[move.piece.type.toUpperCase() as keyof typeof PieceNotationName]
  const coords = xCoords[move.newPosition.x] + move.newPosition.y

  if (move.piece.type === PieceTypes.PAWN && move.type === MoveTypes.CAPTURE)
    return xCoords[move.piece.position.x] + move.type + coords
  return pieceNotationName + move.type + coords
}
