import React from "react"
import Board from "./components/board"
import DefaultSettings from "./core/settings"
import DefaultAppState from "./core/appstate"
import getPieceMoves from "./core/pieceMoves"
import { Dictionary, Settings, AppState, Vector, PieceParams, PieceTypes, PlayerColor } from "./core/types"

const App: React.FunctionComponent<{}> = () => {
  const [settings, setSettings] = React.useState<Settings>(DefaultSettings)
  const [state, setState] = React.useState<AppState>(DefaultAppState)

  const pieces: Dictionary<PieceParams> = state.pieces.reduce((r, piece): Dictionary<PieceParams> => ({ ...r, [`${piece.position.x}-${piece.position.y}`]: piece }), {})
  const selectedPieceMoves: Dictionary<boolean> = state.selectedPieceMoves.reduce((r, move) => ({ ...r, [`${move.x}-${move.y}`]: true }), {})

  React.useEffect(() => {
    if (!settings.hasStarted)
      return undefined

    const secondPlayerColor = settings.startPlayer === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE
    const firstPlayer = createPlayerPieces(settings.startPlayer, 6, false)
    const secondPlayer = createPlayerPieces(secondPlayerColor, 0, true)

    return setState(prevState => ({ ...prevState, pieces: [...firstPlayer, ...secondPlayer], currentPlayerMove: settings.startPlayer }))
  }, [settings.hasStarted])

  const createPlayerPieces = (color: PlayerColor, offsetY: number, switchRows: boolean): Array<PieceParams> => {
    const pieces: Array<PieceParams> = []
    const pawnY  = switchRows ? offsetY + 1 : offsetY
    const pieceY = switchRows ? offsetY     : offsetY + 1

    for (let i = 0; i < 8; ++i)
      pieces.push({ color, type: PieceTypes.PAWN, position: { x: i, y: pawnY  }})
    pieces.push({ color, type: PieceTypes.ROOK  , position: { x: 0, y: pieceY }})
    pieces.push({ color, type: PieceTypes.KNIGHT, position: { x: 1, y: pieceY }})
    pieces.push({ color, type: PieceTypes.BISHOP, position: { x: 2, y: pieceY }})
    pieces.push({ color, type: PieceTypes.QUEEN , position: { x: 3, y: pieceY }})
    pieces.push({ color, type: PieceTypes.KING  , position: { x: 4, y: pieceY }})
    pieces.push({ color, type: PieceTypes.BISHOP, position: { x: 5, y: pieceY }})
    pieces.push({ color, type: PieceTypes.KNIGHT, position: { x: 6, y: pieceY }})
    pieces.push({ color, type: PieceTypes.ROOK  , position: { x: 7, y: pieceY }})

    return pieces
  }

  const onCellClick = (position: Vector): void => {
    const hasMove  = selectedPieceMoves[`${position.x}-${position.y}`]
    const hasPiece = pieces[`${position.x}-${position.y}`]

    if (hasMove)
      return onMoveClick(position)
    if (hasPiece)
      return onPieceClick(position, hasPiece.color, hasPiece.type)
    return setState(prevState => ({ ...prevState, selectedPiece: undefined, selectedPieceMoves: [] }))
  }

  const onPieceClick = (position: Vector, color: PlayerColor, type: PieceTypes): void => {
    if (color !== state.currentPlayerMove)
      return undefined

    const selectedPiece = pieces[`${position.x}-${position.y}`]
    const selectedPieceMoves = getPieceMoves(position, color, type, pieces)

    return setState(prevState => ({ ...prevState, selectedPiece, selectedPieceMoves }))
  }

  const onMoveClick = (position: Vector): void => {
    if (!state.selectedPiece)
      return undefined

    const nextPlayerMove = state.currentPlayerMove == PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE
    const currentPiece = pieces[`${position.x}-${position.y}`]
    const newPieces = state.pieces.map(piece => {
      if (piece != state.selectedPiece)
        return piece
      if (piece.type === PieceTypes.PAWN)
        return { ...piece, position, hasMoved: true }
      return { ...piece, position }
    }).filter(piece => !currentPiece || piece != currentPiece)

    return setState(prevState => ({ ...prevState, currentPlayerMove: nextPlayerMove, pieces: newPieces, selectedPiece: undefined, selectedPieceMoves: [] }))
  }

  return (
    <React.Fragment>
      <Board
        pieces={pieces}
        selectedPiecePosition={state.selectedPiece?.position}
        selectedPieceMoves={selectedPieceMoves}
        onCellClick={onCellClick}
      />
    </React.Fragment>
  )
}

export default App
