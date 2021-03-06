import React from 'react';

import '../index.css';
import Board from './board.js';
import CapturedPiecesBlock from './captured-pieces-block.js';
import initialiseChessBoard from '../init/game-initialiser.js';
import King from '../pieces/king.js';

export default class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: initialiseChessBoard(),
      whiteCapturedPieces: [],
      blackCapturedPieces: [],
      player: 1,
      sourceSelection: -1,
      status: '',
      turn: 'white'
    }
  }

  handleClick(m) {
    const squares = [...this.state.squares];

    if (this.state.sourceSelection === -1) {
      if (!squares[m] || squares[m].player !== this.state.player) {
        this.setState({ status: "Please choose player " + this.state.player + " pieces." });
        if (squares[m]) {
          squares[m].style = { ...squares[m].style, backgroundColor: "" };
        }
      }
      else {
        squares[m].style = { ...squares[m].style, backgroundColor: "lightblue" }; 
        this.setState({
          status: "Choose destination for the selected piece",
          sourceSelection: m
        })
      }
      return
    }

    squares[this.state.sourceSelection].style = { ...squares[this.state.sourceSelection].style, backgroundColor: "" };

    if (squares[m] && squares[m].player === this.state.player) {
      this.setState({
        status: "Wrong selection.",
        sourceSelection: -1,
      });
    }
    else {

      const whiteCapturedPieces = [];
      const blackCapturedPieces = [];
      const isDestEnemyOccupied = Boolean(squares[m]);
      const isMovePossible = squares[this.state.sourceSelection].isMovePossible(this.state.sourceSelection, m, isDestEnemyOccupied);

      if (isMovePossible) {
        if (squares[m] !== null) {
          if (squares[m].player === 1) {
            whiteCapturedPieces.push(squares[m]);
          }
          else {
            blackCapturedPieces.push(squares[m]);
          }
        }

        squares[m] = squares[this.state.sourceSelection];
        squares[this.state.sourceSelection] = null;

    
    const isCheck = this.isCheckForPlayer(squares, this.state.player);

    if (isCheck) {
      this.setState( oldState => ({
        status: "Wrong selection. You are in check!",
        sourceSelection: -1,
      }))
    } else {
      let player = this.state.player === 1 ? 2 : 1;
      let turn = this.state.turn === 'white' ? 'black' : 'white';

      this.setState(oldState => ({
        sourceSelection: -1,
        squares,
        whiteCapturedPieces: [...oldState.whiteCapturedPieces, ...whiteCapturedPieces],
        blackCapturedPieces: [...oldState.blackCapturedPieces, ...blackCapturedPieces],
        player,
        status: '',
        turn
      }));
    }
  }
  else {
    this.setState({
      status: "Wrong selection. Choose valid piece and destination.",
      sourceSelection: -1,
    });
   }
  }
 }

getKingPosition(squares, player) {
return squares.reduce((acc, curr, idx) =>
  acc || ((curr && (curr.getPlayer() === player)) && (curr instanceof King) && idx), null);
}

isCheckForPlayer(squares, player) {
const opponent = player === 1 ? 2 : 1;
const playersKingPosition = this.getKingPosition(squares, player);
const canPieceKillPlayersKing = (piece, m) => piece.isMovePossible(playersKingPosition, m, squares);
return squares.reduce((acc, curr, idx) =>  acc || (curr && (curr.getPlayer() === opponent) && canPieceKillPlayersKing(curr, idx) && true), false);
}

  render() {

    return (
      <div>
        <div className="game">
          <div className="game-board">
            <Board
              squares={this.state.squares}
              onClick={(m) => this.handleClick(m)}
            />
          </div>
          <div className="game-info">
            <h3>Turn</h3>
            <div id="player-turn-box" style={{ backgroundColor: this.state.turn }}>
            </div>
            <div className="game-status">{this.state.status}</div>
            <div className="captured-pieces-block">
              {<CapturedPiecesBlock
                whiteCapturedPieces={this.state.whiteCapturedPieces}
                blackCapturedPieces={this.state.blackCapturedPieces}
              />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}        

 

