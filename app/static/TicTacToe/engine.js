const X = 'X'
const O = 'O'
const EMPTY = undefined
export default class TicTacToeEngine{
    constructor(){
        this.initialplayer = X//player that will start the game
        this.Maxdepth = 6;
    }
    initial_state(){
        return[[EMPTY, EMPTY, EMPTY],
               [EMPTY, EMPTY, EMPTY],
               [EMPTY, EMPTY, EMPTY]
            ]
    }
    depth(depth){
        this.Maxdepth = depth;
    }
    player(board){
        if(board == EMPTY){
            return undefined;
        }
        let count = 0;
        for( let row of board){
            for(let col of row){
                if (col != EMPTY){
                    ++count;
                }

            }
        }
        return count % 2 == 0 ? X : O;
    }
    actions(board){
        if(board == EMPTY){
            return new Set();
        }
        let actions = new Set()
        for(let i = 0; i < board.length; ++i){
            for(let j = 0; j < board[i].length; ++j){
                if (board[i][j] == EMPTY){
                    actions.add([i,j]);
                }
            }
        }
        return actions
    }
    result(board, action){
        if(board == EMPTY || action == EMPTY){
            return undefined;
        }
        let symbol = this.player(board);
        let newBoard = JSON.parse(JSON.stringify(board));
        let i = action[0];
        let j = action[1];
        newBoard[i][j] = symbol;
        return newBoard;
    }
    winner(board){
        if(board == EMPTY){
            return undefined;
        }
        let winningPlayer = this.utility(board)
        if (winningPlayer == 1){
            return X;
        }else if (winningPlayer == -1){
            return O;
        }else{
            return undefined;
        }
    }
    terminal(board){

        /*Returns True if game is over, False otherwise.*/

        /*if there is a winner than it is a terminal state*/
        if(board == EMPTY){
            return true;
        }
        let aPlayerWon = this.winner(board);
        if (aPlayerWon != undefined){
            return true;
        }
        /*checking if all squares have been filled*/
        for(let row of board){
            for(let col of row){
                if (col == EMPTY){
                    return false;
                }
            }
        }
        return true;
    }
    utility(board){
      /**Returns 1 if X has won the game, -1 if O has won, 0 otherwise. */
      if(board == EMPTY){
        return undefined;
    }
      let getValue = (user) => user == X ? 1 : -1;
      for(let i = 0; i < board.length; ++i){
        let row = board[i];
        if(row[0] == row[1] && row[1] == row[2] && row[0] != EMPTY){
            return getValue(row[0]);
        }else if(board[0][i] == board[1][i] && board[1][i] == board[2][i] && board[0][i] != EMPTY){
            return getValue(board[0][i]);
        }
      }
      if(board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[1][1] != EMPTY){
        return getValue(board[1][1]);
      }else if(board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[1][1] != EMPTY){
        return getValue(board[1][1]);
      }
      return 0;
    }


    minimax(board){

        //comment
        if(this.terminal(board)){
            return undefined;
        }
        let actionValues = []
        if(this.player(board) == X){
            //max player
            for(let action of this.actions(board)){
                let temp = this.min_value(this.result(board, action), 1)
                actionValues.push([temp, action]);
            }
            let maxValue = -Infinity
            let bestAction = actionValues[0][1]
            for(let value of actionValues){

                if(value[0] > maxValue){
                    maxValue = value[0];
                    bestAction = value[1];
                }
            }
                return bestAction;
            }else{
                for(let action of this.actions(board)){
                    actionValues.push([this.max_value(this.result(board, action), 1), action]);
                }
                let minValue = Infinity
                let bestAction = actionValues[0][1]
                for(let min_values of actionValues){
                    if(min_values[0] < minValue){
                        minValue = min_values[0];
                        bestAction = min_values[1];
                    }
                }
                return bestAction;
            }

    }
    min_value(board, depth){
        /*returns the min value of all outcomes and the average winning rate of all action outcomes*/
        if(this.terminal(board) || depth == this.Maxdepth){
            let temp = this.utility(board);
            return temp;
        }
        let value = Infinity;
        let allActions = this.actions(board);
        for(let action of allActions){
            let maxplayer = this.max_value(this.result(board, action), depth+1);
            value = Math.min(value, maxplayer);
        }
        return value;
    }
    max_value(board, depth){
        /*returns the min value of all outcomes and the average winning rate of all action outcomes*/
        if(this.terminal(board) || depth == this.Maxdepth){
            let temp = this.utility(board);
            return temp;//value, average
        }
        let value = -Infinity;
        let allActions = this.actions(board);
        for(let action of allActions){
            let minplayer = this.min_value(this.result(board, action), depth+1);
            value = Math.max(value, minplayer);
        }
        return value;
    }
}