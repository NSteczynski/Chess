import { Dictionary, Vector, PieceParams, PawnParams, PieceTypes, PlayerColor } from "./types"

/**
 * Returns available moves for piece type.
 * @param position The piece position.
 * @param color The player color.
 * @param type The piece type.
 * @param pieces The piece list.
 */
const getPieceMoves = (position: Vector, color: PlayerColor, type: PieceTypes, pieces: Dictionary<PieceParams>): Array<Vector> => {
  switch (type) {
    case PieceTypes.PAWN:
      return getPawnMoves(position, color, pieces)
    case PieceTypes.ROOK:
      return getRookMoves(position, color, pieces)
    case PieceTypes.KNIGHT:
      return getKnightMoves(position, color, pieces)
    case PieceTypes.BISHOP:
      return getBishopMoves(position, color, pieces)
    case PieceTypes.QUEEN:
      return getQueenMoves(position, color, pieces)
    case PieceTypes.KING:
      return getKingMoves(position, color, pieces)
    default:
      return []
  }
}

const getPawnMoves = (position: Vector, color: PlayerColor, pieces: Dictionary<PieceParams>): Array<Vector> => {
  const direction = color === PlayerColor.WHITE ? -1 : 1
  const hasMoved = (pieces[`${position.x}-${position.y}`] as PawnParams)?.hasMoved

  const canMoveLeft   = pieces[`${position.x - 1}-${position.y + direction}`]
  const canMoveRight  = pieces[`${position.x + 1}-${position.y + direction}`]
  const canSingleMove = !pieces[`${position.x    }-${position.y + direction}`]
  const canDoubleMove = canSingleMove && !hasMoved && !pieces[`${position.x}-${position.y + direction * 2}`]

  return [
    canMoveLeft   && getSingleMove(position, color, -1, direction    , pieces),
    canMoveRight  && getSingleMove(position, color,  1, direction    , pieces),
    canSingleMove && getSingleMove(position, color,  0, direction    , pieces),
    canDoubleMove && getSingleMove(position, color,  0, direction * 2, pieces)
  ].filter(move => move) as Array<Vector>
}

const getKnightMoves = (position: Vector, color: PlayerColor, pieces: Dictionary<PieceParams>): Array<Vector> => {
    return [
    getSingleMove(position, color, -1,  2, pieces),
    getSingleMove(position, color,  1,  2, pieces),
    getSingleMove(position, color,  2,  1, pieces),
    getSingleMove(position, color,  2, -1, pieces),
    getSingleMove(position, color, -1, -2, pieces),
    getSingleMove(position, color,  1, -2, pieces),
    getSingleMove(position, color, -2,  1, pieces),
    getSingleMove(position, color, -2, -1, pieces),
  ].filter(move => move) as Array<Vector>
}

const getRookMoves = (position: Vector, color: PlayerColor, pieces: Dictionary<PieceParams>): Array<Vector> => {
  return [
    ...getLineMoves(position, color,  0, -1, pieces),
    ...getLineMoves(position, color,  1,  0, pieces),
    ...getLineMoves(position, color,  0,  1, pieces),
    ...getLineMoves(position, color, -1,  0, pieces)
  ]
}

const getBishopMoves = (position: Vector, color: PlayerColor, pieces: Dictionary<PieceParams>): Array<Vector> => {
  return [
    ...getLineMoves(position, color, -1, -1, pieces),
    ...getLineMoves(position, color,  1, -1, pieces),
    ...getLineMoves(position, color,  1,  1, pieces),
    ...getLineMoves(position, color, -1,  1, pieces)
  ]
}

const getQueenMoves = (position: Vector, color: PlayerColor, pieces: Dictionary<PieceParams>): Array<Vector> => {
  return [
    ...getRookMoves(position, color, pieces),
    ...getBishopMoves(position, color, pieces)
  ]
}

const getKingMoves = (position: Vector, color: PlayerColor, pieces: Dictionary<PieceParams>): Array<Vector> => {
  return [
    getSingleMove(position, color, -1, -1, pieces),
    getSingleMove(position, color,  1, -1, pieces),
    getSingleMove(position, color,  1,  1, pieces),
    getSingleMove(position, color, -1,  1, pieces),

    getSingleMove(position, color,  0, -1, pieces),
    getSingleMove(position, color, -1,  0, pieces),
    getSingleMove(position, color,  0,  1, pieces),
    getSingleMove(position, color,  1,  0, pieces),
  ].filter(move => move) as Array<Vector>
}

const getSingleMove = (position: Vector, color: PlayerColor, changeX: number, changeY: number, pieces: Dictionary<PieceParams>): Vector | undefined => {
  const canMoveX = changeX > 0 ? 7 - position.x - changeX >= 0 : changeX < 0 ? position.x + changeX >= 0 : true
  const canMoveY = changeY > 0 ? 7 - position.y - changeY >= 0 : changeY < 0 ? position.y + changeY >= 0 : true
  if (!canMoveX || !canMoveY || pieces[`${position.x + changeX}-${position.y + changeY}`]?.color === color)
    return undefined
  return { x: position.x + changeX, y: position.y + changeY }
}

const getLineMoves = (position: Vector, color: PlayerColor, changeX: number, changeY: number, pieces: Dictionary<PieceParams>): Array<Vector> => {
  const moves: Array<Vector> = []
  const numberOfMovesX = changeX > 0 ? 7 - position.x : changeX < 0 ? position.x : undefined
  const numberOfMovesY = changeY > 0 ? 7 - position.y : changeY < 0 ? position.y : undefined
  const numberOfMoves = numberOfMovesX == undefined ? numberOfMovesY : numberOfMovesY == undefined ? numberOfMovesX : numberOfMovesX < numberOfMovesY ? numberOfMovesX : numberOfMovesY
  if (!numberOfMoves)
    return moves

  for (let i = 1; i <= numberOfMoves; ++i) {
    const currentPiece = pieces[`${position.x + i * changeX}-${position.y + i * changeY}`]
    const prevPiece = pieces[`${position.x + (i - 1) * changeX}-${position.y + (i - 1) * changeY}`]

    if (currentPiece?.color === color || prevPiece && prevPiece.color !== color) break
    moves.push({ x: position.x + i * changeX, y: position.y + i * changeY })
  }

  return moves
}

export default getPieceMoves
