import { Dictionary, Vector, PieceParams, PieceTypes, PlayerColor, PieceMove, MoveTypes } from "./types"

/**
 * Returns available moves for piece type.
 * @param position The piece position.
 * @param color The player color.
 * @param type The piece type.
 * @param pieces The piece list.
 * @param checkAttack If true then checks piece posible attack moves. Default: false.
 */
const getPieceMoves = (position: Vector, color: PlayerColor, type: PieceTypes, pieces: Dictionary<PieceParams>, checkAttack: boolean = false): Array<PieceMove> => {
  switch (type) {
    case PieceTypes.PAWN:
      return getPawnMoves(position, color, pieces, checkAttack)
    case PieceTypes.ROOK:
      return getRookMoves(position, color, pieces, checkAttack)
    case PieceTypes.KNIGHT:
      return getKnightMoves(position, color, pieces, checkAttack)
    case PieceTypes.BISHOP:
      return getBishopMoves(position, color, pieces, checkAttack)
    case PieceTypes.QUEEN:
      return getQueenMoves(position, color, pieces, checkAttack)
    case PieceTypes.KING:
      return getKingMoves(position, color, pieces, checkAttack)
    default:
      return []
  }
}

const getPawnMoves = (position: Vector, color: PlayerColor, pieces: Dictionary<PieceParams>, checkAttack: boolean): Array<PieceMove> => {
  const direction = color === PlayerColor.WHITE ? -1 : 1
  const hasMoved = pieces[`${position.x}-${position.y}`]?.hasMoved

  const canMoveLeft   =  pieces[`${position.x - 1}-${position.y + direction    }`] ||  checkAttack
  const canMoveRight  =  pieces[`${position.x + 1}-${position.y + direction    }`] ||  checkAttack
  const canSingleMove = !pieces[`${position.x    }-${position.y + direction    }`] && !checkAttack
  const canDoubleMove = !pieces[`${position.x    }-${position.y + direction * 2}`] && !hasMoved && canSingleMove

  return [
    canMoveLeft   && getSingleMove(position, color, -1, direction    , pieces, checkAttack),
    canMoveRight  && getSingleMove(position, color,  1, direction    , pieces, checkAttack),
    canSingleMove && getSingleMove(position, color,  0, direction    , pieces, checkAttack),
    canDoubleMove && getSingleMove(position, color,  0, direction * 2, pieces, checkAttack)
  ].filter(move => move) as Array<PieceMove>
}

const getKnightMoves = (position: Vector, color: PlayerColor, pieces: Dictionary<PieceParams>, checkAttack: boolean): Array<PieceMove> => {
    return [
    getSingleMove(position, color, -1,  2, pieces, checkAttack),
    getSingleMove(position, color,  1,  2, pieces, checkAttack),
    getSingleMove(position, color,  2,  1, pieces, checkAttack),
    getSingleMove(position, color,  2, -1, pieces, checkAttack),
    getSingleMove(position, color, -1, -2, pieces, checkAttack),
    getSingleMove(position, color,  1, -2, pieces, checkAttack),
    getSingleMove(position, color, -2,  1, pieces, checkAttack),
    getSingleMove(position, color, -2, -1, pieces, checkAttack),
  ].filter(move => move) as Array<PieceMove>
}

const getRookMoves = (position: Vector, color: PlayerColor, pieces: Dictionary<PieceParams>, checkAttack: boolean): Array<PieceMove> => {
  return [
    ...getLineMoves(position, color,  0, -1, pieces, checkAttack),
    ...getLineMoves(position, color,  1,  0, pieces, checkAttack),
    ...getLineMoves(position, color,  0,  1, pieces, checkAttack),
    ...getLineMoves(position, color, -1,  0, pieces, checkAttack)
  ]
}

const getBishopMoves = (position: Vector, color: PlayerColor, pieces: Dictionary<PieceParams>, checkAttack: boolean): Array<PieceMove> => {
  return [
    ...getLineMoves(position, color, -1, -1, pieces, checkAttack),
    ...getLineMoves(position, color,  1, -1, pieces, checkAttack),
    ...getLineMoves(position, color,  1,  1, pieces, checkAttack),
    ...getLineMoves(position, color, -1,  1, pieces, checkAttack)
  ]
}

const getQueenMoves = (position: Vector, color: PlayerColor, pieces: Dictionary<PieceParams>, checkAttack: boolean): Array<PieceMove> => {
  return [
    ...getRookMoves(position, color, pieces, checkAttack),
    ...getBishopMoves(position, color, pieces, checkAttack)
  ]
}

const getKingMoves = (position: Vector, color: PlayerColor, pieces: Dictionary<PieceParams>, checkAttack: boolean): Array<PieceMove> => {
  const oppositeColor = color === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE
  const hasKingMoved = pieces[`${position.x}-${position.y}`]?.hasMoved
  const isKingUnderAttack = !checkAttack && isPositionAttacked(position, oppositeColor, pieces)
  const qSideRookKey = Object.keys(pieces).find(key => pieces[key].color === color && pieces[key].type === PieceTypes.ROOK && pieces[key].position.x === 0)
  const kSideRookKey = Object.keys(pieces).find(key => pieces[key].color === color && pieces[key].type === PieceTypes.ROOK && pieces[key].position.x === 7)
  const qSideRook = qSideRookKey && pieces[qSideRookKey]
  const kSideRook = kSideRookKey && pieces[kSideRookKey]
  const qSideCastlingPosition = { x: 2, y: position.y }
  const kSideCastlingPosition = { x: 6, y: position.y }
  const canQSideCastling = !checkAttack && !hasKingMoved && !isKingUnderAttack && qSideRook && !qSideRook.hasMoved &&
                           !isPositionAttacked({ x: 2, y: position.y }, oppositeColor, pieces) &&
                           !isPositionAttacked({ x: 3, y: position.y }, oppositeColor, pieces) &&
                           !pieces[`1-${position.y}`] && !pieces[`2-${position.y}`] && !pieces[`3-${position.y}`]
  const canKSideCastling = !checkAttack && !hasKingMoved && !isKingUnderAttack && kSideRook && !kSideRook.hasMoved &&
                           !isPositionAttacked({ x: 5, y: position.y }, oppositeColor, pieces) &&
                           !isPositionAttacked({ x: 6, y: position.y }, oppositeColor, pieces) &&
                           !pieces[`5-${position.y}`] && !pieces[`6-${position.y}`]

  return [
    canQSideCastling && { position: qSideCastlingPosition, type: MoveTypes.Q_CASTLING },
    canKSideCastling && { position: kSideCastlingPosition, type: MoveTypes.K_CASTLING },

    getSingleMove(position, color, -1, -1, pieces, checkAttack),
    getSingleMove(position, color,  1, -1, pieces, checkAttack),
    getSingleMove(position, color,  1,  1, pieces, checkAttack),
    getSingleMove(position, color, -1,  1, pieces, checkAttack),

    getSingleMove(position, color,  0, -1, pieces, checkAttack),
    getSingleMove(position, color, -1,  0, pieces, checkAttack),
    getSingleMove(position, color,  0,  1, pieces, checkAttack),
    getSingleMove(position, color,  1,  0, pieces, checkAttack),
  ].filter(move => {
    if (!move)
      return false
    if (checkAttack)
      return true
    return !isPositionAttacked(move.position, oppositeColor, pieces)
  }) as Array<PieceMove>
}

const getSingleMove = (position: Vector, color: PlayerColor, changeX: number, changeY: number, pieces: Dictionary<PieceParams>, checkAttack: boolean): PieceMove | undefined => {
  const canMoveX = changeX > 0 ? 7 - position.x - changeX >= 0 : changeX < 0 ? position.x + changeX >= 0 : true
  const canMoveY = changeY > 0 ? 7 - position.y - changeY >= 0 : changeY < 0 ? position.y + changeY >= 0 : true

  const currentPiece = pieces[`${position.x + changeX}-${position.y + changeY}`]
  const movePosition = { x: position.x + changeX, y: position.y + changeY }
  const moveType = currentPiece ? MoveTypes.CAPTURE : MoveTypes.MOVE

  if (!canMoveX || !canMoveY || !checkAttack && currentPiece?.color === color)
    return undefined
  return { position: movePosition, type: moveType }
}

const getLineMoves = (position: Vector, color: PlayerColor, changeX: number, changeY: number, pieces: Dictionary<PieceParams>, checkAttack: boolean): Array<PieceMove> => {
  const moves: Array<PieceMove> = []
  const numberOfMovesX = changeX > 0 ? 7 - position.x : changeX < 0 ? position.x : undefined
  const numberOfMovesY = changeY > 0 ? 7 - position.y : changeY < 0 ? position.y : undefined
  const numberOfMoves = numberOfMovesX == undefined ? numberOfMovesY : numberOfMovesY == undefined ? numberOfMovesX : numberOfMovesX < numberOfMovesY ? numberOfMovesX : numberOfMovesY
  if (!numberOfMoves)
    return moves

  for (let i = 1; i <= numberOfMoves; ++i) {
    const currentPiece = pieces[`${position.x + i * changeX}-${position.y + i * changeY}`]
    const prevPiece = pieces[`${position.x + (i - 1) * changeX}-${position.y + (i - 1) * changeY}`]
    const movePosition = { x: position.x + i * changeX, y: position.y + i * changeY }
    const moveType = currentPiece ? MoveTypes.CAPTURE : MoveTypes.MOVE

    if (!checkAttack && currentPiece?.color === color || prevPiece && prevPiece.color !== color) break
    moves.push({ position: movePosition, type: moveType })
  }

  return moves
}

export const isPositionAttacked = (position: Vector, color: PlayerColor, pieces: Dictionary<PieceParams>): boolean => {
  return !!Object.keys(pieces).find(key => {
    const piece = pieces[key]
    if (piece.color !== color)
      return false

    const pieceMoves = getPieceMoves(piece.position, piece.color, piece.type, pieces, true)
    return pieceMoves.find(move => move.position.x === position.x && move.position.y === position.y)
  })
}

export default getPieceMoves
