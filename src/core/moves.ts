import { Dictionary, Move, MoveTypes, Piece, PieceTypes, PlayerColor, Vector } from "./types"
import { GetOppositeColor, GetPositionName }                                   from "./functions"

let MOVE_ID = 0

/**
 * Returns available moves for piece type.
 * @param piece The piece.
 * @param pieces The list of pieces.
 * @param checkAttack If true then checks piece posible attack moves. Default: false.
 * @param lastMove The last move played.
 */
const GetPieceMoves = (piece: Piece, pieces: Dictionary<Piece>, checkAttack: boolean = false, lastMove?: Move, _depth: number = 0): Dictionary<Move> => {
  switch (piece.type) {
    case PieceTypes.PAWN:
      return GetPawnMoves(piece, pieces, checkAttack, _depth, lastMove)
    case PieceTypes.ROOK:
      return GetRookMoves(piece, pieces, checkAttack, _depth)
    case PieceTypes.KNIGHT:
      return GetKnightMoves(piece, pieces, checkAttack, _depth)
    case PieceTypes.BISHOP:
      return GetBishopMoves(piece, pieces, checkAttack, _depth)
    case PieceTypes.QUEEN:
      return GetQueenMoves(piece, pieces, checkAttack, _depth)
    case PieceTypes.KING:
      return GetKingMoves(piece, pieces, checkAttack, _depth)
    default:
      return {}
  }
}

const GetPawnMoves = (piece: Piece, pieces: Dictionary<Piece>, checkAttack: boolean, depth: number, lastMove?: Move): Dictionary<Move> => {
  const direction = piece.color === PlayerColor.WHITE ? -1 : 1

  const left     = { x: piece.position.x - 1, y: piece.position.y }
  const right    = { x: piece.position.x + 1, y: piece.position.y }
  const leftTop  = { x: piece.position.x - 1, y: piece.position.y + direction }
  const rightTop = { x: piece.position.x + 1, y: piece.position.y + direction }
  const single   = { x: piece.position.x    , y: piece.position.y + direction }
  const double   = { x: piece.position.x    , y: piece.position.y + direction * 2 }

  const leftPiece  = pieces[GetPositionName(left )]
  const rightPiece = pieces[GetPositionName(right)]
  const isLeftLastMove  = leftPiece  && lastMove && leftPiece.position.x  === lastMove.position.x && leftPiece.position.y  === lastMove.position.y && leftPiece.color  === lastMove.piece.color
  const isRightLastMove = rightPiece && lastMove && rightPiece.position.x === lastMove.position.x && rightPiece.position.y === lastMove.position.y && rightPiece.color === lastMove.piece.color

  const canMoveLeft     = isLeftLastMove  && lastMove?.piece.type === PieceTypes.PAWN && !lastMove.piece.hasMoved
  const canMoveRight    = isRightLastMove && lastMove?.piece.type === PieceTypes.PAWN && !lastMove.piece.hasMoved
  const canMoveLeftTop  = pieces[GetPositionName(leftTop )] != undefined ||  checkAttack
  const canMoveRightTop = pieces[GetPositionName(rightTop)] != undefined ||  checkAttack
  const canMoveSingle   = pieces[GetPositionName(single  )] == undefined && !checkAttack
  const canMoveDouble   = pieces[GetPositionName(double  )] == undefined && canMoveSingle && !piece.hasMoved

  return [
    canMoveLeft     ? { position: leftTop , type: MoveTypes.CAPTURE, captured: leftPiece  } : undefined,
    canMoveRight    ? { position: rightTop, type: MoveTypes.CAPTURE, captured: rightPiece } : undefined,
    canMoveLeftTop  ? GetSingleMove(piece, leftTop , pieces, checkAttack, depth) : undefined,
    canMoveRightTop ? GetSingleMove(piece, rightTop, pieces, checkAttack, depth) : undefined,
    canMoveSingle   ? GetSingleMove(piece, single  , pieces, checkAttack, depth) : undefined,
    canMoveDouble   ? GetSingleMove(piece, double  , pieces, checkAttack, depth) : undefined
  ].reduce((r, move): Dictionary<Move> => {
    if (move == undefined)
      return r
    if (move.position.y + direction < 0 || move.position.y + direction > 7)
      return { ...r, [GetPositionName(move.position)]: { ...move, promotion: "waiting" } }
    return { ...r, [GetPositionName(move.position)]: move }
  }, {})
}

const GetKnightMoves = (piece: Piece, pieces: Dictionary<Piece>, checkAttack: boolean, depth: number): Dictionary<Move> => {
  return [
    GetSingleMove(piece, { x: piece.position.x - 1, y: piece.position.y + 2 }, pieces, checkAttack, depth),
    GetSingleMove(piece, { x: piece.position.x + 1, y: piece.position.y + 2 }, pieces, checkAttack, depth),
    GetSingleMove(piece, { x: piece.position.x + 2, y: piece.position.y + 1 }, pieces, checkAttack, depth),
    GetSingleMove(piece, { x: piece.position.x + 2, y: piece.position.y - 1 }, pieces, checkAttack, depth),
    GetSingleMove(piece, { x: piece.position.x - 1, y: piece.position.y - 2 }, pieces, checkAttack, depth),
    GetSingleMove(piece, { x: piece.position.x + 1, y: piece.position.y - 2 }, pieces, checkAttack, depth),
    GetSingleMove(piece, { x: piece.position.x - 2, y: piece.position.y + 1 }, pieces, checkAttack, depth),
    GetSingleMove(piece, { x: piece.position.x - 2, y: piece.position.y - 1 }, pieces, checkAttack, depth),
  ].reduce((r, move): Dictionary<Move> => {
    if (move == undefined)
      return r
    return { ...r, [GetPositionName(move.position)]: move }
  }, {})
}

const GetRookMoves = (piece: Piece, pieces: Dictionary<Piece>, checkAttack: boolean, depth: number): Dictionary<Move> => {
  return {
    ...GetLineMoves(piece,  0, -1, pieces, checkAttack, depth),
    ...GetLineMoves(piece,  1,  0, pieces, checkAttack, depth),
    ...GetLineMoves(piece,  0,  1, pieces, checkAttack, depth),
    ...GetLineMoves(piece, -1,  0, pieces, checkAttack, depth)
  }
}

const GetBishopMoves = (piece: Piece, pieces: Dictionary<Piece>, checkAttack: boolean, depth: number): Dictionary<Move> => {
  return {
    ...GetLineMoves(piece, -1, -1, pieces, checkAttack, depth),
    ...GetLineMoves(piece,  1, -1, pieces, checkAttack, depth),
    ...GetLineMoves(piece,  1,  1, pieces, checkAttack, depth),
    ...GetLineMoves(piece, -1,  1, pieces, checkAttack, depth)
  }
}

const GetQueenMoves = (piece: Piece, pieces: Dictionary<Piece>, checkAttack: boolean, depth: number): Dictionary<Move> => {
  return {
    ...GetRookMoves(piece, pieces, checkAttack, depth),
    ...GetBishopMoves(piece, pieces, checkAttack, depth)
  }
}

const GetKingMoves = (piece: Piece, pieces: Dictionary<Piece>, checkAttack: boolean, depth: number): Dictionary<Move> => {
  const moves: Dictionary<Move> = {}
  const oppositeColor = GetOppositeColor(piece.color)
  const isKingSafe = !checkAttack && !isPositionAttacked(piece.position, oppositeColor, pieces)
  const qSideCastlingPosition = { x: 2, y: piece.position.y }
  const kSideCastlingPosition = { x: 6, y: piece.position.y }
  const qSideRook = pieces[GetPositionName({ x: 0, y: piece.position.y })]
  const kSideRook = pieces[GetPositionName({ x: 7, y: piece.position.y })]
  const isQLineClear = pieces[GetPositionName({ x: 1, y: piece.position.y })] == undefined && pieces[GetPositionName({ x: 2, y: piece.position.y })] == undefined && pieces[GetPositionName({ x: 3, y: piece.position.y })] == undefined
  const isKLineClear = pieces[GetPositionName({ x: 5, y: piece.position.y })] == undefined && pieces[GetPositionName({ x: 6, y: piece.position.y })] == undefined
  const canKingMoveQ = isKingSafe && !isPositionAttacked({ x: 2, y: piece.position.y }, oppositeColor, pieces) && !isPositionAttacked({ x: 3, y: piece.position.y }, oppositeColor, pieces)
  const canKingMoveK = isKingSafe && !isPositionAttacked({ x: 5, y: piece.position.y }, oppositeColor, pieces) && !isPositionAttacked({ x: 6, y: piece.position.y }, oppositeColor, pieces)
  if (!piece.hasMoved && qSideRook && !qSideRook.hasMoved && isQLineClear && canKingMoveQ)
    moves[GetPositionName(qSideCastlingPosition)] = { id: MOVE_ID++, piece, position: qSideCastlingPosition, type: MoveTypes.Q_CASTLING }
  if (!piece.hasMoved && kSideRook && !kSideRook.hasMoved && isKLineClear && canKingMoveK)
    moves[GetPositionName(kSideCastlingPosition)] = { id: MOVE_ID++, piece, position: kSideCastlingPosition, type: MoveTypes.K_CASTLING }

  return [
    GetSingleMove(piece, { x: piece.position.x - 1, y: piece.position.y - 1 }, pieces, depth > 1, depth),
    GetSingleMove(piece, { x: piece.position.x + 1, y: piece.position.y - 1 }, pieces, depth > 1, depth),
    GetSingleMove(piece, { x: piece.position.x + 1, y: piece.position.y + 1 }, pieces, depth > 1, depth),
    GetSingleMove(piece, { x: piece.position.x - 1, y: piece.position.y + 1 }, pieces, depth > 1, depth),

    GetSingleMove(piece, { x: piece.position.x    , y: piece.position.y - 1 }, pieces, depth > 1, depth),
    GetSingleMove(piece, { x: piece.position.x - 1, y: piece.position.y     }, pieces, depth > 1, depth),
    GetSingleMove(piece, { x: piece.position.x    , y: piece.position.y + 1 }, pieces, depth > 1, depth),
    GetSingleMove(piece, { x: piece.position.x + 1, y: piece.position.y     }, pieces, depth > 1, depth)
  ].reduce((r, move): Dictionary<Move> => {
    if (move == undefined || depth < 1 && isPositionAttacked(move.position, oppositeColor, pieces, depth))
      return r
    return { ...r, [GetPositionName(move.position)]: move }
  }, moves)
}

const GetSingleMove = (piece: Piece, newPosition: Vector, pieces: Dictionary<Piece>, checkAttack: boolean, depth: number): Move | undefined => {
  const canMoveX = newPosition.x <= 7 && newPosition.x >= 0
  const canMoveY = newPosition.y <= 7 && newPosition.y >= 0
  const captured = pieces[GetPositionName(newPosition)]
  const moveType = captured ? MoveTypes.CAPTURE : MoveTypes.MOVE

  if (!checkAttack && isKingAttackedAfterMove(piece, newPosition, pieces, depth))
    return undefined
  if (!canMoveX || !canMoveY || captured && captured.color === piece.color)
    return undefined
  return { id: MOVE_ID++, piece, position: newPosition, type: moveType, captured }
}

const GetLineMoves = (piece: Piece, changeX: number, changeY: number, pieces: Dictionary<Piece>, checkAttack: boolean, depth: number): Dictionary<Move> => {
  const moves: Dictionary<Move> = {}
  const numberOfMovesX = changeX > 0 ? 7 - piece.position.x : changeX < 0 ? piece.position.x : undefined
  const numberOfMovesY = changeY > 0 ? 7 - piece.position.y : changeY < 0 ? piece.position.y : undefined
  const numberOfMoves = numberOfMovesX == undefined ? numberOfMovesY : numberOfMovesY == undefined ? numberOfMovesX : numberOfMovesX < numberOfMovesY ? numberOfMovesX : numberOfMovesY
  if (numberOfMoves == undefined)
    return moves

  for (let i = 1; i <= numberOfMoves; ++i) {
    const currPosition = { x: piece.position.x + i       * changeX, y: piece.position.y + i       * changeY }
    const prevPosition = { x: piece.position.x + (i - 1) * changeX, y: piece.position.y + (i - 1) * changeY }
    const currPiece = pieces[GetPositionName(currPosition)]
    const prevPiece = pieces[GetPositionName(prevPosition)]
    const moveType  = currPiece ? MoveTypes.CAPTURE : MoveTypes.MOVE

    if (currPiece && currPiece.color === piece.color || prevPiece && prevPiece.color !== piece.color)
      break
    if (!checkAttack && isKingAttackedAfterMove(piece, currPosition, pieces, depth))
      continue
    moves[GetPositionName(currPosition)] = { id: MOVE_ID++, piece, position: currPosition, type: moveType, captured: currPiece }
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
    return GetPieceMoves(current, pieces, true, undefined, _depth + 1)[GetPositionName(position)]
  })
}

const isKingAttackedAfterMove = (piece: Piece, newPosition: Vector, pieces: Dictionary<Piece>, depth: number): boolean => {
  const king = pieces[Object.keys(pieces).find(key => pieces[key].type === PieceTypes.KING && pieces[key].color === piece.color) as string]
  const oppositeColor = GetOppositeColor(king.color)
  const tempPieces = { ...pieces }
  if (delete tempPieces[GetPositionName(piece.position)])
    tempPieces[GetPositionName(newPosition)] = piece
  if (piece.type === PieceTypes.KING)
    return isPositionAttacked(newPosition, oppositeColor, tempPieces, depth + 1)
  return isPositionAttacked(king.position, oppositeColor, tempPieces, depth)
}

export default GetPieceMoves
