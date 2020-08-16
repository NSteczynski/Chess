import React from "react"
import Turn from "./components/turn"
import Board from "./components/board"
import DefaultSettings from "./core/settings"
import { PlayerColor, Dictionary, Settings, PieceParams, PawnParams, PieceTypes, Vector } from "./core/types"

const App: React.FunctionComponent<{}> = () => {
  const [settings, setSettings] = React.useState<Settings>(DefaultSettings)
  const [pieces, setPieces] = React.useState<Array<PieceParams>>([])
  const [selectedPiece, setSelectedPiece] = React.useState<PieceParams | undefined>(undefined)
  const [moves, setMoves] = React.useState<Dictionary<boolean>>({})
  const boardPieces: Dictionary<PieceParams> = pieces.reduce((r, piece): Dictionary<PieceParams> => ({ ...r, [`${piece.position.x}-${piece.position.y}`]: piece }), {})

  React.useEffect(() => {
    if (!settings.isStarted)
      return undefined
    const playerWhite = createPlayerPieces(PlayerColor.WHITE, 6, false)
    const playerBlack = createPlayerPieces(PlayerColor.BLACK, 0, true)
    setPieces([...playerWhite, ...playerBlack])
  }, [settings.isStarted])

  const createPlayerPieces = (color: PlayerColor, offsetY: number, switchRows: boolean): Array<PieceParams> => {
    const pieces: Array<PieceParams> = []
    const pawnY  = switchRows ? offsetY + 1 : offsetY
    const pieceY = switchRows ? offsetY     : offsetY + 1
    let __PIECE_ID__ = 0

    for (let i = 0; i < 8; ++i)
      pieces.push({ id: __PIECE_ID__++, color, type: PieceTypes.PAWN, position: { x: i, y: pawnY  }, movedFromStart: false} as PawnParams)
    pieces.push({ id: __PIECE_ID__++, color, type: PieceTypes.ROOK  , position: { x: 0, y: pieceY }})
    pieces.push({ id: __PIECE_ID__++, color, type: PieceTypes.KNIGHT, position: { x: 1, y: pieceY }})
    pieces.push({ id: __PIECE_ID__++, color, type: PieceTypes.BISHOP, position: { x: 2, y: pieceY }})
    pieces.push({ id: __PIECE_ID__++, color, type: PieceTypes.QUEEN , position: { x: 3, y: pieceY }})
    pieces.push({ id: __PIECE_ID__++, color, type: PieceTypes.KING  , position: { x: 4, y: pieceY }})
    pieces.push({ id: __PIECE_ID__++, color, type: PieceTypes.BISHOP, position: { x: 5, y: pieceY }})
    pieces.push({ id: __PIECE_ID__++, color, type: PieceTypes.KNIGHT, position: { x: 6, y: pieceY }})
    pieces.push({ id: __PIECE_ID__++, color, type: PieceTypes.ROOK  , position: { x: 7, y: pieceY }})

    return pieces
  }

  const onPieceClick = (position: Vector, color: PlayerColor, type: PieceTypes): void => {
    if (color != settings.playerMove)
      return undefined
    const moves = getPieceMoves(position, color, type)
    setSelectedPiece(boardPieces[`${position.x}-${position.y}`])
    setMoves(moves.reduce((r, move) => ({ ...r, [`${move.x}-${move.y}`]: true }), {}))
  }

  const onMoveClick = (position: Vector): void => {
    if (selectedPiece == undefined)
      return undefined

    const pieceOnPosition = boardPieces[`${position.x}-${position.y}`]
    const newPieces = pieces.map(piece => {
      if (piece.id != selectedPiece.id || piece.color != selectedPiece.color)
        return piece
      if (piece.type === PieceTypes.PAWN)
        return { ...piece, position, movedFromStart: true }
      return { ...piece, position }
    }).filter(piece => !pieceOnPosition || piece != pieceOnPosition)

    setPieces(newPieces)
    setSelectedPiece(undefined)
    setMoves({})
    setSettings({ ...settings, playerMove: settings.playerMove == PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE })
  }

  const onCellClick = (): void => {
    setSelectedPiece(undefined)
    setMoves({})
  }

  const getPieceMoves = (position: Vector, color: PlayerColor, type: PieceTypes): Array<Vector> => {
    if (type === PieceTypes.PAWN)
      return getPawnMoves(position, color)
    if (type === PieceTypes.ROOK)
      return getRookMoves(position, color)
    if (type === PieceTypes.KNIGHT)
      return getKnightMoves(position, color)
    if (type === PieceTypes.BISHOP)
      return getBishopMoves(position, color)
    if (type === PieceTypes.QUEEN)
      return getQueenMoves(position, color)
    if (type === PieceTypes.KING)
      return getKingMoves(position, color)
    return []
  }

  const getPawnMoves = (position: Vector, color: PlayerColor): Array<Vector> => {
    const moves: Array<Vector> = []

    const movedFromStart = (boardPieces[`${position.x}-${position.y}`] as PawnParams)?.movedFromStart
    const numberOfMoves = movedFromStart ? 1 : 2
    /** TODO: Dynamic direction depending on which color is on top and which on bottom. */
    const direction = color === PlayerColor.WHITE ? -1 : 1
    for (let i = 1; i <= numberOfMoves; ++i)
      if (position.y + i * direction <= 7 && position.y + i * direction >= 0)
        moves.push({ x: position.x, y: position.y + i * direction })

    return moves
  }

  const getRookMoves = (position: Vector, color: PlayerColor): Array<Vector> => {
    return [...getLineMoves(position, color, 0, -1), ...getLineMoves(position, color, 1, 0), ...getLineMoves(position, color, 0, 1), ...getLineMoves(position, color, -1, 0)]
  }

  const getKnightMoves = (position: Vector, color: PlayerColor): Array<Vector> => {
    const moves: Array<Vector> = []

    if (position.x - 1 >= 0 && position.y + 2 >= 0 && boardPieces[`${position.x - 1}-${position.y + 2}`]?.color !== color)
      moves.push({ x: position.x - 1, y: position.y + 2 })
    if (position.x + 1 <= 7 && position.y + 2 >= 0 && boardPieces[`${position.x + 1}-${position.y + 2}`]?.color !== color)
      moves.push({ x: position.x + 1, y: position.y + 2 })
    if (position.x + 2 <= 7 && position.y + 1 >= 0 && boardPieces[`${position.x + 2}-${position.y + 1}`]?.color !== color)
      moves.push({ x: position.x + 2, y: position.y + 1 })
    if (position.x + 2 <= 7 && position.y - 1 >= 0 && boardPieces[`${position.x + 2}-${position.y - 1}`]?.color !== color)
      moves.push({ x: position.x + 2, y: position.y - 1 })
    if (position.x - 1 >= 0 && position.y - 2 <= 7 && boardPieces[`${position.x - 1}-${position.y - 2}`]?.color !== color)
      moves.push({ x: position.x - 1, y: position.y - 2 })
    if (position.x + 1 <= 7 && position.y - 2 <= 7 && boardPieces[`${position.x + 1}-${position.y - 2}`]?.color !== color)
      moves.push({ x: position.x + 1, y: position.y - 2 })
    if (position.x - 2 <= 7 && position.y + 1 >= 0 && boardPieces[`${position.x - 2}-${position.y + 1}`]?.color !== color)
      moves.push({ x: position.x - 2, y: position.y + 1 })
    if (position.x - 2 <= 7 && position.y - 1 >= 0 && boardPieces[`${position.x - 2}-${position.y - 1}`]?.color !== color)
      moves.push({ x: position.x - 2, y: position.y - 1 })

    return moves
  }

  const getBishopMoves = (position: Vector, color: PlayerColor): Array<Vector> => {
    return [...getLineMoves(position, color, -1, -1), ...getLineMoves(position, color, 1, -1), ...getLineMoves(position, color, 1, 1), ...getLineMoves(position, color, -1, 1)]
  }

  const getQueenMoves = (position: Vector, color: PlayerColor): Array<Vector> => {
    return [...getRookMoves(position, color), ...getBishopMoves(position, color)]
  }

  const getKingMoves = (position: Vector, color: PlayerColor): Array<Vector> => {
    const moves: Array<Vector> = []

    if (position.x - 1 >= 0 && position.y - 1 >= 0 && boardPieces[`${position.x - 1}-${position.y - 1}`]?.color !== color)
      moves.push({ x: position.x - 1, y: position.y - 1 })
    if (position.x + 1 >= 0 && position.y - 1 >= 0 && boardPieces[`${position.x + 1}-${position.y - 1}`]?.color !== color)
      moves.push({ x: position.x + 1, y: position.y - 1 })
    if (position.x + 1 >= 0 && position.y + 1 >= 0 && boardPieces[`${position.x + 1}-${position.y + 1}`]?.color !== color)
      moves.push({ x: position.x + 1, y: position.y + 1 })
    if (position.x - 1 >= 0 && position.y + 1 >= 0 && boardPieces[`${position.x - 1}-${position.y + 1}`]?.color !== color)
      moves.push({ x: position.x - 1, y: position.y + 1 })

    if (position.y - 1 >= 0 && boardPieces[`${position.x}-${position.y - 1}`]?.color !== color)
      moves.push({ x: position.x, y: position.y - 1 })
    if (position.x + 1 >= 0 && boardPieces[`${position.x + 1}-${position.y}`]?.color !== color)
      moves.push({ x: position.x + 1, y: position.y })
    if (position.y + 1 >= 0 && boardPieces[`${position.x}-${position.y + 1}`]?.color !== color)
      moves.push({ x: position.x, y: position.y + 1 })
    if (position.x - 1 >= 0 && boardPieces[`${position.x - 1}-${position.y}`]?.color !== color)
      moves.push({ x: position.x - 1, y: position.y })

    return moves
  }

  const getLineMoves = (position: Vector, color: PlayerColor, changeX: number, changeY: number): Array<Vector> => {
    const moves: Array<Vector> = []
    const numberOfMovesX = changeX < 0 ? 7 - position.x : changeX > 0 ? position.x : undefined
    const numberOfMovesY = changeY < 0 ? 7 - position.y : changeY > 0 ? position.y : undefined
    const numberOfMoves = !numberOfMovesX ? numberOfMovesY : !numberOfMovesY ? numberOfMovesX : numberOfMovesX < numberOfMovesY ? numberOfMovesX : numberOfMovesY
    if (!numberOfMoves)
      return moves

    for (let i = 1; i <= numberOfMoves; ++i) {
      const currentPiece = boardPieces[`${position.x - i * changeX}-${position.y - i * changeY}`]
      const prevPiece = boardPieces[`${position.x - (i - 1) * changeX}-${position.y - (i - 1) * changeY}`]
      if (currentPiece?.color === color || prevPiece && prevPiece.color !== color) break
      moves.push({ x: position.x - i * changeX, y: position.y - i * changeY })
    }

    return moves
  }

  return (
    <React.Fragment>
      <Turn turn={settings.playerMove} />
      <Board
        pieces={boardPieces}
        moves={moves}
        selectedPiece={selectedPiece?.position}
        onPieceClick={onPieceClick}
        onMoveClick={onMoveClick}
        onCellClick={onCellClick}
      />
    </React.Fragment>
  )
}

export default App
