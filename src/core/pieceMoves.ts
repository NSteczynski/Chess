import { Dictionary, Vector, Piece, PieceMove, PlayerColor, PieceTypes, MoveTypes, HistoryMove } from "./types"
import { getPositionName, getOppositeColor } from "./functions"

/**
 * Returns available moves for piece type.
 * @param piece The piece.
 * @param pieces The list of pieces.
 * @param checkAttack If true then checks piece posible attack moves. Default: false.
 * @param lastMove The last move played.
 */
const getPieceMoves = (piece: Piece, pieces: Dictionary<Piece>, checkAttack: boolean = false, lastMove?: HistoryMove, _depth: number = 0): Dictionary<PieceMove> => {
  switch (piece.type) {
    case PieceTypes.PAWN:
      return getPawnMoves(piece, pieces, checkAttack, _depth, lastMove)
    case PieceTypes.ROOK:
      return getRookMoves(piece, pieces, checkAttack, _depth)
    case PieceTypes.KNIGHT:
      return getKnightMoves(piece, pieces, checkAttack, _depth)
    case PieceTypes.BISHOP:
      return getBishopMoves(piece, pieces, checkAttack, _depth)
    case PieceTypes.QUEEN:
      return getQueenMoves(piece, pieces, checkAttack, _depth)
    case PieceTypes.KING:
      return getKingMoves(piece, pieces, checkAttack, _depth)
    default:
      return {}
  }
}

const getPawnMoves = (piece: Piece, pieces: Dictionary<Piece>, checkAttack: boolean, depth: number, lastMove?: HistoryMove): Dictionary<PieceMove> => {
  const direction = piece.color === PlayerColor.WHITE ? -1 : 1

  const left     = { x: piece.position.x - 1, y: piece.position.y }
  const right    = { x: piece.position.x + 1, y: piece.position.y }
  const leftTop  = { x: piece.position.x - 1, y: piece.position.y + direction }
  const rightTop = { x: piece.position.x + 1, y: piece.position.y + direction }
  const single   = { x: piece.position.x    , y: piece.position.y + direction }
  const double   = { x: piece.position.x    , y: piece.position.y + direction * 2 }

  const leftPiece  = pieces[getPositionName(left )]
  const rightPiece = pieces[getPositionName(right)]
  const isLeftLastMove  = leftPiece  && lastMove && leftPiece.position.x  === lastMove.position.x && leftPiece.position.y  === lastMove.position.y && leftPiece.color  === lastMove.piece.color
  const isRightLastMove = rightPiece && lastMove && rightPiece.position.x === lastMove.position.x && rightPiece.position.y === lastMove.position.y && rightPiece.color === lastMove.piece.color

  const canMoveLeft     = isLeftLastMove  && lastMove?.piece.type === PieceTypes.PAWN && !lastMove.piece.hasMoved
  const canMoveRight    = isRightLastMove && lastMove?.piece.type === PieceTypes.PAWN && !lastMove.piece.hasMoved
  const canMoveLeftTop  = pieces[getPositionName(leftTop )] != undefined ||  checkAttack
  const canMoveRightTop = pieces[getPositionName(rightTop)] != undefined ||  checkAttack
  const canMoveSingle   = pieces[getPositionName(single  )] == undefined && !checkAttack
  const canMoveDouble   = pieces[getPositionName(double  )] == undefined && canMoveSingle && !piece.hasMoved

  return [
    canMoveLeft     ? { position: leftTop , type: MoveTypes.CAPTURE, captured: leftPiece  } : undefined,
    canMoveRight    ? { position: rightTop, type: MoveTypes.CAPTURE, captured: rightPiece } : undefined,
    canMoveLeftTop  ? getSingleMove(piece, leftTop , pieces, checkAttack, depth) : undefined,
    canMoveRightTop ? getSingleMove(piece, rightTop, pieces, checkAttack, depth) : undefined,
    canMoveSingle   ? getSingleMove(piece, single  , pieces, checkAttack, depth) : undefined,
    canMoveDouble   ? getSingleMove(piece, double  , pieces, checkAttack, depth) : undefined
  ].reduce((r, move): Dictionary<PieceMove> => {
    if (move == undefined)
      return r
    if (move.position.y + direction < 0 || move.position.y + direction > 7)
      return { ...r, [getPositionName(move.position)]: { ...move, promotion: true } }
    return { ...r, [getPositionName(move.position)]: move }
  }, {})
}

const getKnightMoves = (piece: Piece, pieces: Dictionary<Piece>, checkAttack: boolean, depth: number): Dictionary<PieceMove> => {
  return [
    getSingleMove(piece, { x: piece.position.x - 1, y: piece.position.y + 2 }, pieces, checkAttack, depth),
    getSingleMove(piece, { x: piece.position.x + 1, y: piece.position.y + 2 }, pieces, checkAttack, depth),
    getSingleMove(piece, { x: piece.position.x + 2, y: piece.position.y + 1 }, pieces, checkAttack, depth),
    getSingleMove(piece, { x: piece.position.x + 2, y: piece.position.y - 1 }, pieces, checkAttack, depth),
    getSingleMove(piece, { x: piece.position.x - 1, y: piece.position.y - 2 }, pieces, checkAttack, depth),
    getSingleMove(piece, { x: piece.position.x + 1, y: piece.position.y - 2 }, pieces, checkAttack, depth),
    getSingleMove(piece, { x: piece.position.x - 2, y: piece.position.y + 1 }, pieces, checkAttack, depth),
    getSingleMove(piece, { x: piece.position.x - 2, y: piece.position.y - 1 }, pieces, checkAttack, depth),
  ].reduce((r, move): Dictionary<PieceMove> => {
    if (move == undefined)
      return r
    return { ...r, [getPositionName(move.position)]: move }
  }, {})
}

const getRookMoves = (piece: Piece, pieces: Dictionary<Piece>, checkAttack: boolean, depth: number): Dictionary<PieceMove> => {
  return {
    ...getLineMoves(piece,  0, -1, pieces, checkAttack, depth),
    ...getLineMoves(piece,  1,  0, pieces, checkAttack, depth),
    ...getLineMoves(piece,  0,  1, pieces, checkAttack, depth),
    ...getLineMoves(piece, -1,  0, pieces, checkAttack, depth)
  }
}

const getBishopMoves = (piece: Piece, pieces: Dictionary<Piece>, checkAttack: boolean, depth: number): Dictionary<PieceMove> => {
  return {
    ...getLineMoves(piece, -1, -1, pieces, checkAttack, depth),
    ...getLineMoves(piece,  1, -1, pieces, checkAttack, depth),
    ...getLineMoves(piece,  1,  1, pieces, checkAttack, depth),
    ...getLineMoves(piece, -1,  1, pieces, checkAttack, depth)
  }
}

const getQueenMoves = (piece: Piece, pieces: Dictionary<Piece>, checkAttack: boolean, depth: number): Dictionary<PieceMove> => {
  return {
    ...getRookMoves(piece, pieces, checkAttack, depth),
    ...getBishopMoves(piece, pieces, checkAttack, depth)
  }
}

const getKingMoves = (piece: Piece, pieces: Dictionary<Piece>, checkAttack: boolean, depth: number): Dictionary<PieceMove> => {
  const moves: Dictionary<PieceMove> = {}
  const oppositeColor = getOppositeColor(piece.color)
  const isKingSafe = !checkAttack && !isPositionAttacked(piece.position, oppositeColor, pieces)
  const qSideCastlingPosition = { x: 2, y: piece.position.y }
  const kSideCastlingPosition = { x: 6, y: piece.position.y }
  const qSideRook = pieces[getPositionName({ x: 0, y: piece.position.y })]
  const kSideRook = pieces[getPositionName({ x: 7, y: piece.position.y })]
  const isQLineClear = pieces[getPositionName({ x: 1, y: piece.position.y })] == undefined && pieces[getPositionName({ x: 2, y: piece.position.y })] == undefined && pieces[getPositionName({ x: 3, y: piece.position.y })] == undefined
  const isKLineClear = pieces[getPositionName({ x: 5, y: piece.position.y })] == undefined && pieces[getPositionName({ x: 6, y: piece.position.y })] == undefined
  const canKingMoveQ = isKingSafe && !isPositionAttacked({ x: 2, y: piece.position.y }, oppositeColor, pieces) && !isPositionAttacked({ x: 3, y: piece.position.y }, oppositeColor, pieces)
  const canKingMoveK = isKingSafe && !isPositionAttacked({ x: 5, y: piece.position.y }, oppositeColor, pieces) && !isPositionAttacked({ x: 6, y: piece.position.y }, oppositeColor, pieces)
  if (!piece.hasMoved && qSideRook && !qSideRook.hasMoved && isQLineClear && canKingMoveQ)
    moves[getPositionName(qSideCastlingPosition)] = { position: qSideCastlingPosition, type: MoveTypes.Q_CASTLING }
  if (!piece.hasMoved && kSideRook && !kSideRook.hasMoved && isKLineClear && canKingMoveK)
    moves[getPositionName(kSideCastlingPosition)] = { position: kSideCastlingPosition, type: MoveTypes.K_CASTLING }

  return [
    getSingleMove(piece, { x: piece.position.x - 1, y: piece.position.y - 1 }, pieces, depth > 1, depth),
    getSingleMove(piece, { x: piece.position.x + 1, y: piece.position.y - 1 }, pieces, depth > 1, depth),
    getSingleMove(piece, { x: piece.position.x + 1, y: piece.position.y + 1 }, pieces, depth > 1, depth),
    getSingleMove(piece, { x: piece.position.x - 1, y: piece.position.y + 1 }, pieces, depth > 1, depth),

    getSingleMove(piece, { x: piece.position.x    , y: piece.position.y - 1 }, pieces, depth > 1, depth),
    getSingleMove(piece, { x: piece.position.x - 1, y: piece.position.y     }, pieces, depth > 1, depth),
    getSingleMove(piece, { x: piece.position.x    , y: piece.position.y + 1 }, pieces, depth > 1, depth),
    getSingleMove(piece, { x: piece.position.x + 1, y: piece.position.y     }, pieces, depth > 1, depth)
  ].reduce((r, move): Dictionary<PieceMove> => {
    if (move == undefined || depth < 1 && isPositionAttacked(move.position, oppositeColor, pieces, depth))
      return r
    return { ...r, [getPositionName(move.position)]: move }
  }, moves)
}

const getSingleMove = (piece: Piece, newPosition: Vector, pieces: Dictionary<Piece>, checkAttack: boolean, depth: number): PieceMove | undefined => {
  const canMoveX = newPosition.x <= 7 && newPosition.x >= 0
  const canMoveY = newPosition.y <= 7 && newPosition.y >= 0
  const captured = pieces[getPositionName(newPosition)]
  const moveType = captured ? MoveTypes.CAPTURE : MoveTypes.MOVE

  if (!checkAttack && isKingAttackedAfterMove(piece, newPosition, pieces, depth))
    return undefined
  if (!canMoveX || !canMoveY || captured && captured.color === piece.color)
    return undefined
  return { position: newPosition, type: moveType, captured }
}

const getLineMoves = (piece: Piece, changeX: number, changeY: number, pieces: Dictionary<Piece>, checkAttack: boolean, depth: number): Dictionary<PieceMove> => {
  const moves: Dictionary<PieceMove> = {}
  const numberOfMovesX = changeX > 0 ? 7 - piece.position.x : changeX < 0 ? piece.position.x : undefined
  const numberOfMovesY = changeY > 0 ? 7 - piece.position.y : changeY < 0 ? piece.position.y : undefined
  const numberOfMoves = numberOfMovesX == undefined ? numberOfMovesY : numberOfMovesY == undefined ? numberOfMovesX : numberOfMovesX < numberOfMovesY ? numberOfMovesX : numberOfMovesY
  if (numberOfMoves == undefined)
    return moves

  for (let i = 1; i <= numberOfMoves; ++i) {
    const currPosition = { x: piece.position.x + i       * changeX, y: piece.position.y + i       * changeY }
    const prevPosition = { x: piece.position.x + (i - 1) * changeX, y: piece.position.y + (i - 1) * changeY }
    const currPiece = pieces[getPositionName(currPosition)]
    const prevPiece = pieces[getPositionName(prevPosition)]
    const moveType  = currPiece ? MoveTypes.CAPTURE : MoveTypes.MOVE

    if (currPiece && currPiece.color === piece.color || prevPiece && prevPiece.color !== piece.color)
      break
    if (!checkAttack && isKingAttackedAfterMove(piece, currPosition, pieces, depth))
      continue
    moves[getPositionName(currPosition)] = { position: currPosition, type: moveType, captured: currPiece }
  }

  return moves
}

/**
 * Returns true if position is attacked by provided PlayerColor.
 * @param position The position to be checked.
 * @param color The PlayerColor that attack.
 * @param pieces The dictionary of pieces.
 * @param depth The current depth in searching,
 */
export const isPositionAttacked = (position: Vector, color: PlayerColor, pieces: Dictionary<Piece>, _depth: number = -1): boolean => {
  return !!Object.keys(pieces).find(key => {
    const current = pieces[key]
    if (current.color !== color)
      return false
    return getPieceMoves(current, pieces, true, undefined, _depth + 1)[getPositionName(position)]
  })
}

const isKingAttackedAfterMove = (piece: Piece, newPosition: Vector, pieces: Dictionary<Piece>, depth: number): boolean => {
  const king = pieces[Object.keys(pieces).find(key => pieces[key].type === PieceTypes.KING && pieces[key].color === piece.color) as string]
  const oppositeColor = getOppositeColor(king.color)
  const tempPieces = { ...pieces }
  if (delete tempPieces[getPositionName(piece.position)])
    tempPieces[getPositionName(newPosition)] = piece
  if (piece.type === PieceTypes.KING)
    return isPositionAttacked(newPosition, oppositeColor, tempPieces, depth + 1)
  return isPositionAttacked(king.position, oppositeColor, tempPieces, depth)
}

export default getPieceMoves
