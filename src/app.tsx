import React from "react"
import Board from "./components/board"
import GameInformation from "./components/gameInformation"
import DefaultSettings from "./core/settings"
import DefaultAppState from "./core/appstate"
import getPieceMoves from "./core/pieceMoves"
import { Dictionary, Settings, AppState, Vector, PieceParams, PieceTypes, PlayerColor, MoveTypes } from "./core/types"

const App: React.FunctionComponent<{}> = () => {
  const [settings, setSettings] = React.useState<Settings>(DefaultSettings)
  const [state, setState] = React.useState<AppState>(DefaultAppState)

  const pieces: Dictionary<PieceParams> = state.pieces.reduce((r, piece) => ({ ...r, [`${piece.position.x}-${piece.position.y}`]: piece }), {})
  const selectedPieceMoves: Dictionary<MoveTypes> = state.selectedPieceMoves.reduce((r, move) => ({ ...r, [`${move.position.x}-${move.position.y}`]: move.type }), {})
  const lastMove = state.movesHistory[state.movesHistory.length - 1]

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

    if (hasMove != undefined)
      return onMoveClick(position, hasMove)
    if (hasPiece != undefined)
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

  const onMoveClick = (position: Vector, type: MoveTypes): void => {
    if (!state.selectedPiece)
      return undefined

    const nextPlayerMove = state.currentPlayerMove == PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE
    const currentPiece = pieces[`${position.x}-${position.y}`]
    const newStatePieces = state.pieces.map(piece => {
      if (state.selectedPiece && type === MoveTypes.Q_CASTLING && piece.type === PieceTypes.ROOK && piece.color === state.selectedPiece.color && piece.position.x === 0)
        return { ...piece, position: { x: 3, y: position.y }, hasMoved: true }
      if (state.selectedPiece && type === MoveTypes.K_CASTLING && piece.type === PieceTypes.ROOK && piece.color === state.selectedPiece.color && piece.position.x === 7)
        return { ...piece, position: { x: 5, y: position.y }, hasMoved: true }
      if (piece != state.selectedPiece)
        return piece
      return { ...piece, position, hasMoved: true }
    }).filter(piece => !currentPiece || piece != currentPiece)

    const newMovesHistory = [...state.movesHistory]
    const newPieces: Dictionary<PieceParams> = newStatePieces.reduce((r, piece) => ({ ...r, [`${piece.position.x}-${piece.position.y}`]: piece }), {})
    const isCheck = !!getPieceMoves(position, state.currentPlayerMove, state.selectedPiece.type, newPieces).find(move => {
      const piece = pieces[`${move.position.x}-${move.position.y}`]
      if (!piece)
        return false
      return piece.type === PieceTypes.KING && piece.color === nextPlayerMove
    })
    newMovesHistory.push({ newPosition: position, piece: state.selectedPiece, capturedPiece: currentPiece, type, isCheck })

    return setState(prevState => ({
      ...prevState,
      currentPlayerMove: nextPlayerMove,
      pieces: newStatePieces,
      selectedPiece: undefined,
      selectedPieceMoves: [],
      movesHistory: newMovesHistory
    }))
  }

  return (
    <React.Fragment>
      <Board
        pieces={pieces}
        lastMove={lastMove}
        selectedPiecePosition={state.selectedPiece?.position}
        selectedPieceMoves={selectedPieceMoves}
        onCellClick={onCellClick}
      />
      <GameInformation
        movesHistory={state.movesHistory}
      />
    </React.Fragment>
  )
}

export default App
