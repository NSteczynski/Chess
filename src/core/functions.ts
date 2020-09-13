import { Dictionary, Piece, PlayerColor, PieceTypes, Vector, MoveTypes, PieceNotationName, Move } from "./types"

/** The x coordinates. */
export const xCoords = ["a", "b", "c", "d", "e", "f", "g", "h"]

/**
 * Converts position as vector to string.
 * @param position The position to be converted.
 */
export const GetPositionName = (position: Vector): string => position.x + "-" + position.y

/**
 * Returns the opposite player color.
 * @param The color that must be invented.
 */
export const GetOppositeColor = (color: PlayerColor): PlayerColor => color === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE

/**
 * Returns the last object in dictionary.
 * @param dictionary The dictionary with objects.
 */
export const GetLastObject = <T>(dictionary: Dictionary<T>): T => dictionary[Object.keys(dictionary)[Object.keys(dictionary).length - 1]]

/**
 * Creates dictionary of the pieces for player.
 * @param color The player color.
 * @param offsetY The pieces Y offset.
 * @param switchRows Determines if row of pawns and others should be switched.
 */
export const CreatePlayerPieces = (color: PlayerColor, offsetY: number, switchRows: boolean): Dictionary<Piece> => {
  const pieces: Dictionary<Piece> = {}
  const pawnY  = switchRows ? offsetY + 1 : offsetY
  const pieceY = switchRows ? offsetY     : offsetY + 1

  for (let i = 0; i < 8; ++i)
    pieces[GetPositionName({ x: i, y: pawnY })] = { color, type: PieceTypes.PAWN  , position: { x: i, y: pawnY  }}
  pieces[GetPositionName({ x: 0, y: pieceY })]  = { color, type: PieceTypes.ROOK  , position: { x: 0, y: pieceY }}
  pieces[GetPositionName({ x: 1, y: pieceY })]  = { color, type: PieceTypes.KNIGHT, position: { x: 1, y: pieceY }}
  pieces[GetPositionName({ x: 2, y: pieceY })]  = { color, type: PieceTypes.BISHOP, position: { x: 2, y: pieceY }}
  pieces[GetPositionName({ x: 3, y: pieceY })]  = { color, type: PieceTypes.QUEEN , position: { x: 3, y: pieceY }}
  pieces[GetPositionName({ x: 4, y: pieceY })]  = { color, type: PieceTypes.KING  , position: { x: 4, y: pieceY }}
  pieces[GetPositionName({ x: 5, y: pieceY })]  = { color, type: PieceTypes.BISHOP, position: { x: 5, y: pieceY }}
  pieces[GetPositionName({ x: 6, y: pieceY })]  = { color, type: PieceTypes.KNIGHT, position: { x: 6, y: pieceY }}
  pieces[GetPositionName({ x: 7, y: pieceY })]  = { color, type: PieceTypes.ROOK  , position: { x: 7, y: pieceY }}

  return pieces
}

/**
 * Returns the move notation name.
 * @param move The move history.
 */
export const GetMoveNotationName = (move: Move): string => {
  if (move.type === MoveTypes.Q_CASTLING || move.type === MoveTypes.K_CASTLING)
    return move.type
  const pieceNotationName = PieceNotationName[move.piece.type.toUpperCase() as keyof typeof PieceNotationName]
  const coords = xCoords[move.position.x] + (8 - move.position.y)
  const promotion = move.promotion && move.promotion != "waiting" ? "=" + PieceNotationName[move.promotion.toUpperCase() as keyof typeof PieceNotationName] : ""
  const check = move.isCheckmate ? "#" : move.isCheck ? "+" : ""

  if (move.piece.type === PieceTypes.PAWN && move.type === MoveTypes.CAPTURE)
    return xCoords[move.piece.position.x] + move.type + coords + promotion + check
  return pieceNotationName + move.type + coords + promotion + check
}

/**
 * Returns dictionary of the pieces before move.
 * @param move The move.
 * @param pieces The dictionary of the pieces.
 */
export const BackwardHistory = (move: Move, pieces: Dictionary<Piece>): Dictionary<Piece> => {
  const temp = { ...pieces }
  if (delete temp[GetPositionName(move.position)])
    temp[GetPositionName(move.piece.position)] = { ...move.piece }
  if (move.type === MoveTypes.Q_CASTLING && delete temp[GetPositionName({ x: 3, y: move.position.y })])
    temp[GetPositionName({ x: 0, y: move.position.y })] = { ...pieces[GetPositionName({ x: 3, y: move.position.y })], position: { x: 0, y: move.position.y }, hasMoved: false }
  if (move.type === MoveTypes.K_CASTLING && delete temp[GetPositionName({ x: 5, y: move.position.y })])
    temp[GetPositionName({ x: 7, y: move.position.y })] = { ...pieces[GetPositionName({ x: 5, y: move.position.y })], position: { x: 7, y: move.position.y }, hasMoved: false }
  if (move.captured)
    temp[GetPositionName(move.captured.position)] = { ...move.captured }
  return temp
}

/**
 * Returns dictionary of the pieces after move.
 * @param move The move.
 * @param pieces The dictionary of the pieces
 */
export const ForwardHistory = (move: Move, pieces: Dictionary<Piece>): Dictionary<Piece> => {
  const temp = { ...pieces }
  if (move.captured)
    delete temp[GetPositionName(move.captured.position)]
  if (move.type === MoveTypes.Q_CASTLING && delete temp[GetPositionName({ x: 0, y: move.position.y })])
    temp[GetPositionName({ x: 3, y: move.position.y })] = { ...pieces[GetPositionName({ x: 0, y: move.position.y })], position: { x: 3, y: move.position.y }, hasMoved: true }
  if (move.type === MoveTypes.K_CASTLING && delete temp[GetPositionName({ x: 7, y: move.position.y })])
    temp[GetPositionName({ x: 5, y: move.position.y })] = { ...pieces[GetPositionName({ x: 7, y: move.position.y })], position: { x: 5, y: move.position.y }, hasMoved: true }
  if (delete temp[GetPositionName(move.piece.position)])
    temp[GetPositionName(move.position)] = { ...move.piece, type: move.promotion && move.promotion != "waiting" ? move.promotion : move.piece.type, position: move.position, hasMoved: true }
  return temp
}
