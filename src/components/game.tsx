import React           from "react"
import GameMenu        from "@components/gameMenu"
import Board           from "@components/board"
import GameInformation from "@components/gameInformation"
import GetPieceMoves, { isPositionAttacked } from "@core/moves"
import { DefaultGameState }                  from "@core/defaults"
import { Scoreboard, GameSettings, GameState, PlayerColor, Piece, PieceTypes, Vector, Move, MoveTypes, Dictionary } from "@core/types"
import { CreatePlayerPieces, GetLastObject, GetOppositeColor, GetPositionName, BackwardHistory, ForwardHistory }    from "@core/functions"

const Game: React.FunctionComponent<{
  scoreboard: Scoreboard
  settings:   GameSettings
  onSettingsChange:   (name: keyof GameSettings, value: GameSettings[keyof GameSettings]) => void
  setPlayerScore:     (color: PlayerColor, value: number) => void
  onPlayerNameChange: (name: string, color: PlayerColor) => void
}> = ({ scoreboard, settings, onSettingsChange, setPlayerScore, onPlayerNameChange }) => {
  const [state, setState]  = React.useState<GameState>(DefaultGameState)
  const isBoardDisabled    = state.winPlayer != undefined || state.lastMove != undefined && state.lastMove.promotion === "waiting"
  const isBackwardDisabled = state.lastMove == undefined
  const isForwardDisabled  = !Object.keys(state.history).length || state.lastMove != undefined && state.lastMove.id === GetLastObject(state.history).id

  React.useEffect(() => {
    if (!Object.keys(state.history).length)
      return undefined
    const color     = GetLastObject(state.history)?.isCheckmate ? GetLastObject(state.history).piece.color : PlayerColor.WHITE
    const newScore  = state.lastMove?.isCheckmate ? scoreboard[color].value + 1 : scoreboard[color].value - 1
    const winPlayer = state.lastMove?.isCheckmate ? color : undefined
    onSettingsChange("showGameMenu", winPlayer != undefined)
    setPlayerScore(color, newScore)
    return setState(prevState => ({ ...prevState, winPlayer: color }))
  }, [state.lastMove != undefined && state.lastMove.isCheckmate])

  const onNewGame = (): void => {
    const whitePlayer = CreatePlayerPieces(PlayerColor.WHITE, 6, false)
    const blackPlayer = CreatePlayerPieces(PlayerColor.BLACK, 0, true)
    setPlayerScore(PlayerColor.WHITE, 0)
    setPlayerScore(PlayerColor.BLACK, 0)
    onSettingsChange("showGameMenu", false)
    onSettingsChange("flip"        , false)
    return setState({ ...DefaultGameState, pieces: { ...whitePlayer, ...blackPlayer }, playerMove: PlayerColor.WHITE })
  }

  const onGameRematch = (): void => {
    const whitePlayer = CreatePlayerPieces(PlayerColor.WHITE, 6, false)
    const blackPlayer = CreatePlayerPieces(PlayerColor.BLACK, 0, true)
    onSettingsChange("showGameMenu", false)
    onSettingsChange("flip"        , !settings.flip)
    return setState({ ...DefaultGameState, pieces: { ...whitePlayer, ...blackPlayer }, playerMove: PlayerColor.WHITE })
  }

  const onResignCancel = (): void => {
    onSettingsChange("showGameMenu", false)
    return setState(prevState => ({ ...prevState, resignPlayer: undefined }))
  }

  const onResign = (): void => {
    const winPlayer = GetOppositeColor(state.playerMove)
    setPlayerScore(winPlayer, scoreboard[winPlayer].value + 1)
    return setState(prevState => ({ ...prevState, winPlayer, resignPlayer: undefined }))
  }

  const onPromotionClick = (piece: Piece, type: PieceTypes.ROOK | PieceTypes.BISHOP | PieceTypes.QUEEN): void => {
    const lastMove = state.lastMove
    if (lastMove == undefined)
      return undefined
    return setState(prevState => ({
      ...prevState,
      pieces:   { ...prevState.pieces, [GetPositionName(piece.position)]: { ...piece, type } },
      history:  { ...prevState.history, [lastMove.id]: { ...lastMove, promotion: type } },
      lastMove: { ...lastMove, promotion: type }
    }))
  }

  const onBoardClick = (position: Vector): void => {
    const hasMove  = state.selectedMoves[GetPositionName(position)]
    const hasPiece = state.pieces[GetPositionName(position)]

    if (hasMove  != undefined)
      return onMoveClick(hasMove)
    if (hasPiece != undefined)
      return onPieceClick(hasPiece)
    return setState(prevState => ({ ...prevState, selected: undefined, selectedMoves: {} }))
  }

  const onPieceClick = (piece: Piece): void => {
    if (piece.color != state.playerMove || state.selected && piece.position.x === state.selected.position.x && piece.position.y === state.selected.position.y)
      return setState(prevState => ({ ...prevState, selected: undefined, selectedMoves: {} }))
    return setState(prevState => ({ ...prevState, selected: piece, selectedMoves: GetPieceMoves(piece, state.pieces, false, state.lastMove) }))
  }

  const onMoveClick = (move: Move): void => {
    const pieces = { ...state.pieces }
    if (state.selected == undefined)
      return undefined
    if (move.captured)
      delete pieces[GetPositionName(move.captured.position)]
    if (move.type === MoveTypes.Q_CASTLING && delete pieces[GetPositionName({ x: 0, y: move.position.y })])
      pieces[GetPositionName({ x: 3, y: move.position.y })] = { ...state.pieces[GetPositionName({ x: 0, y: move.position.y })], position: { x: 3, y: move.position.y }, hasMoved: true }
    if (move.type === MoveTypes.K_CASTLING && delete pieces[GetPositionName({ x: 7, y: move.position.y })])
      pieces[GetPositionName({ x: 5, y: move.position.y })] = { ...state.pieces[GetPositionName({ x: 7, y: move.position.y })], position: { x: 5, y: move.position.y }, hasMoved: true }
    if (delete pieces[GetPositionName(state.selected.position)])
      pieces[GetPositionName(move.position)] = { ...state.pieces[GetPositionName(state.selected.position)], position: move.position, hasMoved: true }

    const nextMoves   = GetPieceMoves(pieces[GetPositionName(move.position)], pieces, true)
    const enemyKing   = pieces[Object.keys(pieces).find(key => pieces[key].type === PieceTypes.KING && pieces[key].color === GetOppositeColor(pieces[GetPositionName(move.position)].color)) as string]
    const isCheck     = Object.keys(nextMoves).find(key => pieces[GetPositionName(nextMoves[key].position)] && pieces[GetPositionName(nextMoves[key].position)].type === PieceTypes.KING) != undefined
    const isCheckmate = !Object.keys(GetPieceMoves(enemyKing, pieces)).length && isPositionAttacked(enemyKing.position, pieces[GetPositionName(move.position)].color, pieces) && !isPositionAttacked(move.position, GetOppositeColor(pieces[GetPositionName(move.position)].color), pieces)

    const newMove     = { ...move, isCheck, isCheckmate }
    const prevHistory = state.lastMove == undefined ? {} : Object.keys(state.history).reduce((r, key) => {
      if (state.lastMove && state.history[key].id > state.lastMove.id)
        return r
      return { ...r, [key]: { ...state.history[key] } }
    }, {})

    return setState(prevState => ({
      ...prevState,
      playerMove:     GetOppositeColor(prevState.playerMove),
      pieces:         pieces,
      selected:       undefined,
      selectedMoves:  {},
      history:        { ...prevHistory, [newMove.id]: newMove },
      lastMove:       newMove,
      promotionPiece: move.promotion ? pieces[GetPositionName(move.position)] : undefined
    }))
  }

  const onHistoryMoveClick = (move: Move): void => {
    if (state.lastMove != undefined && move.id === state.lastMove.id)
      return undefined
    const reduceType = state.lastMove == undefined ? "reduce" : move.id > state.lastMove.id ? "reduce" : "reduceRight"
    const pieces     = Object.keys(state.history)[reduceType]((r, key) => {
      const current  = state.history[key]
      if (state.lastMove == undefined && current.id <= move.id)
        return ForwardHistory(current, r)
      if (state.lastMove == undefined)
        return r
      if (current.id >  move.id && current.id <= state.lastMove.id)
        return BackwardHistory(current, r)
      if (current.id <= move.id && current.id >  state.lastMove.id)
        return ForwardHistory(current, r)
      return r
    }, { ...state.pieces })

    return updateAfterHistoryChange(move, pieces)
  }

  const onBackwardHistoryClick = (): void => {
    const historyMove = state.history[Object.keys(state.history).reverse().find(key => state.lastMove && state.history[key].id < state.lastMove.id) as string]
    if (historyMove == undefined && state.lastMove != undefined)
      return updateAfterHistoryChange(undefined, BackwardHistory(state.lastMove, state.pieces))
    if (historyMove == undefined || state.lastMove == undefined)
      return undefined
    return updateAfterHistoryChange(historyMove, BackwardHistory(state.lastMove, state.pieces))
  }

  const onForwardHistoryClick = (): void => {
    const historyMove = state.history[Object.keys(state.history).find(key => state.lastMove && state.history[key].id > state.lastMove.id) as string]
    if (historyMove == undefined && state.lastMove == undefined && Object.keys(state.history))
      return updateAfterHistoryChange(state.history[Object.keys(state.history)[0]], ForwardHistory(state.history[Object.keys(state.history)[0]], state.pieces))
    if (historyMove == undefined || state.lastMove == undefined)
      return undefined
    return updateAfterHistoryChange(historyMove, ForwardHistory(historyMove, state.pieces))
  }

  const updateAfterHistoryChange = (move: Move | undefined, pieces: Dictionary<Piece>): void => {
    const playerMove = move == undefined ? PlayerColor.WHITE : GetOppositeColor(move.piece.color)
    return setState(prevState => ({
      ...prevState,
      playerMove:    playerMove,
      pieces:        pieces,
      selectedMoves: {},
      selected:      undefined,
      lastMove:      move,
    }))
  }

  const onShowGameMenuClick = (): void => onSettingsChange("showGameMenu", !settings.showGameMenu)

  const onResignationClick = (): void => {
    onSettingsChange("showGameMenu", true)
    return setState(prevState => ({ ...prevState, resignPlayer: settings.flip ? GetOppositeColor(prevState.playerMove) : prevState.playerMove }))
  }

  return (
    <React.Fragment>
      <div className="game">
        <GameMenu
          hidden       = {!settings.showGameMenu}
          score        = {scoreboard}
          flip         = {settings.flip}
          winPlayer    = {state.winPlayer}
          resignPlayer = {state.resignPlayer}
          onGameRematch      = {onGameRematch}
          onNewGame          = {onNewGame}
          onResignCancel     = {onResignCancel}
          onResign           = {onResign}
          onPlayerNameChange = {onPlayerNameChange}
        />
        <Board
          playerMove       = {state.playerMove}
          pieces           = {state.pieces}
          flip             = {settings.flip}
          lastMove         = {state.lastMove}
          selectedPosition = {state.selected?.position}
          selectedMoves    = {state.selectedMoves}
          disabled         = {isBoardDisabled}
          onPromotionClick = {onPromotionClick}
          onClick          = {onBoardClick}
        />
      </div>
      <GameInformation
        score                  = {scoreboard}
        flip                   = {settings.flip}
        history                = {state.history}
        lastMove               = {state.lastMove}
        isShowGameMenuDisabled = {settings.showGameMenu && !Object.keys(state.pieces).length}
        isResignationDisabled  = {settings.showGameMenu && !Object.keys(state.pieces).length}
        isBackwardDisabled     = {isBackwardDisabled}
        isForwardDisabled      = {isForwardDisabled}
        onHistoryMoveClick     = {onHistoryMoveClick}
        onShowGameMenuClick    = {onShowGameMenuClick}
        onResignationClick     = {onResignationClick}
        onBackwardHistoryClick = {onBackwardHistoryClick}
        onForwardHistoryClick  = {onForwardHistoryClick}
      />
    </React.Fragment>
  )
}

export default Game
