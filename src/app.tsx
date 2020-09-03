import React from "react"
import Board from "./components/board"
import GameInformation from "./components/gameInformation"
import PromotionMenu from "./components/promotionMenu"
import DefaultSettings from "./core/settings"
import DefaultAppState from "./core/appstate"
import getPieceMoves from "./core/pieceMoves"
import { getPositionName } from "./core/functions"
import { Dictionary, Vector, Settings, AppState, Piece, PlayerColor, PieceTypes, PieceMove, MoveTypes } from "./core/types"

const App: React.FunctionComponent<{}> = () => {
  const [settings, setSettings] = React.useState<Settings>(DefaultSettings)
  const [state, setState] = React.useState<AppState>(DefaultAppState)

  React.useEffect(() => {
    if (!settings.hasStarted)
      return undefined

    const secondPlayerColor = settings.startPlayer === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE
    const firstPlayer = createPlayerPieces(settings.startPlayer, 6, false)
    const secondPlayer = createPlayerPieces(secondPlayerColor, 0, true)
    return setState(prevState => ({ ...prevState, pieces: { ...firstPlayer, ...secondPlayer }, currentPlayerMove: settings.startPlayer }))
  }, [settings.hasStarted])

  React.useEffect(() => {
    const playerKing = state.pieces[Object.keys(state.pieces).find(key => state.pieces[key].type === PieceTypes.KING && state.pieces[key].color === state.playerMove) as string]
    if (!Object.keys(state.pieces).length)
      return undefined
    if (!Object.keys(getPieceMoves(playerKing, state.pieces)).length)
      return setSettings(prevState => ({ ...prevState, hasStarted: false }))
  }, [state.playerMove])

  const createPlayerPieces = (color: PlayerColor, offsetY: number, switchRows: boolean): Dictionary<Piece> => {
    const pieces: Dictionary<Piece> = {}
    const pawnY  = switchRows ? offsetY + 1 : offsetY
    const pieceY = switchRows ? offsetY     : offsetY + 1

    for (let i = 0; i < 8; ++i)
      pieces[getPositionName({ x: i, y: pawnY })] = { color, type: PieceTypes.PAWN, position: { x: i, y: pawnY }}
    pieces[getPositionName({ x: 0, y: pieceY })] = { color, type: PieceTypes.ROOK  , position: { x: 0, y: pieceY }}
    pieces[getPositionName({ x: 1, y: pieceY })] = { color, type: PieceTypes.KNIGHT, position: { x: 1, y: pieceY }}
    pieces[getPositionName({ x: 2, y: pieceY })] = { color, type: PieceTypes.BISHOP, position: { x: 2, y: pieceY }}
    pieces[getPositionName({ x: 3, y: pieceY })] = { color, type: PieceTypes.QUEEN , position: { x: 3, y: pieceY }}
    pieces[getPositionName({ x: 4, y: pieceY })] = { color, type: PieceTypes.KING  , position: { x: 4, y: pieceY }}
    pieces[getPositionName({ x: 5, y: pieceY })] = { color, type: PieceTypes.BISHOP, position: { x: 5, y: pieceY }}
    pieces[getPositionName({ x: 6, y: pieceY })] = { color, type: PieceTypes.KNIGHT, position: { x: 6, y: pieceY }}
    pieces[getPositionName({ x: 7, y: pieceY })] = { color, type: PieceTypes.ROOK  , position: { x: 7, y: pieceY }}

    return pieces
  }

  const onCellClick = (position: Vector): void => {
    if (state.promotionPiece != undefined)
      return undefined

    const hasMove = state.selectedMoves[getPositionName(position)]
    const hasPiece = state.pieces[getPositionName(position)]

    if (hasMove != undefined)
      return onMoveClick(hasMove)
    if (hasPiece != undefined)
      return onPieceClick(hasPiece)
    return setState(prevState => ({ ...prevState, selected: undefined, selectedMoves: {} }))
  }

  const onPieceClick = (piece: Piece): void => {
    if (piece.color != state.playerMove)
      return undefined
    return setState(prevState => ({ ...prevState, selected: piece, selectedMoves: getPieceMoves(piece, state.pieces, false, state.lastMove) }))
  }

  const onMoveClick = (move: PieceMove): void => {
    const pieces = { ...state.pieces }
    if (state.selected == undefined)
      return undefined
    if (move.captured)
      delete pieces[getPositionName(move.captured.position)]
    if (move.type === MoveTypes.Q_CASTLING && delete pieces[getPositionName({ x: 0, y: move.position.y })])
      pieces[getPositionName({ x: 3, y: move.position.y })] = { ...state.pieces[getPositionName({ x: 0, y: move.position.y })], position: { x: 3, y: move.position.y }, hasMoved: true }
    if (move.type === MoveTypes.K_CASTLING && delete pieces[getPositionName({ x: 7, y: move.position.y })])
      pieces[getPositionName({ x: 5, y: move.position.y })] = { ...state.pieces[getPositionName({ x: 7, y: move.position.y })], position: { x: 5, y: move.position.y }, hasMoved: true }
    if (delete pieces[getPositionName(state.selected.position)])
      pieces[getPositionName(move.position)] = { ...state.pieces[getPositionName(state.selected.position)], position: move.position, hasMoved: true }

    const nextMoves = getPieceMoves(pieces[getPositionName(move.position)], pieces, true)
    const isCheck = !!Object.keys(nextMoves).find(key => {
      const currPiece = pieces[getPositionName(nextMoves[key].position)]
      if (currPiece == undefined)
        return undefined
      return currPiece.type === PieceTypes.KING
    })
    const historyMove = { type: move.type, piece: state.selected, position: move.position, captured: move.captured, isCheck }

    return setState(prevState => ({
      ...prevState,
      playerMove: prevState.playerMove === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE,
      pieces,
      selected: undefined,
      selectedMoves: {},
      historyMoves: { ...prevState.historyMoves, [Object.keys(prevState.historyMoves).length]: historyMove },
      lastMove: historyMove,
      promotionPiece: move.promotion ? pieces[getPositionName(move.position)] : undefined
    }))
  }

  const onPromotionClick = (piece: Piece, type: PieceTypes.ROOK | PieceTypes.BISHOP | PieceTypes.QUEEN): void => {
    const pieces = { ...state.pieces, [getPositionName(piece.position)]: { ...piece, type } }
    const updateHistoryMove = { ...state.historyMoves[Object.keys(state.historyMoves).length - 1], promotion: type }
    return setState(prevState => ({
      ...prevState,
      pieces,
      historyMoves: { ...prevState.historyMoves, [Object.keys(prevState.historyMoves).length - 1]: updateHistoryMove },
      promotionPiece: undefined
    }))
  }

  return (
    <React.Fragment>
      <Board
        pieces={state.pieces}
        selectedPosition={state.selected && state.selected.position}
        selectedMoves={state.selectedMoves}
        lastMove={state.lastMove}
        promotionPiece={state.promotionPiece}
        onCellClick={onCellClick}
        onPromotionClick={onPromotionClick}
      />
      <GameInformation historyMoves={state.historyMoves} />
    </React.Fragment>
  )
}

export default App
