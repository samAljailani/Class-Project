    //this file may only be called within a p5js element because it uses p.____ properties
    import TicTacToeEngine from "./engine.js";
    let stateTransitionInterval;
    export class Game{
        constructor(p, difficultyButtons,symbolButtons, playAgain, images){
            this.images = images;
            this.symbolButtons = symbolButtons;
            this.state = Start.getInstance();
            this.userSymbol = 'X';
            this.EngineSymbol = 'O';
            this.ttt = new TicTacToeEngine();
            this.board = this.ttt.initial_state();
            this.p = p;
            this.DifficultyButtons = difficultyButtons;
            this.playAgain = playAgain;

        }
        reposition(){
             this.state.reposition(this, this.p);
             Play.getInstance().reposition(this, this.p);
        }
        setUserSymbol(symbol){
            this.userSymbol = symbol;
            if(symbol === 'O'){
                this.EngineSymbol = 'X';
            }else{
                this.EngineSymbol = 'O';
            }
        }
        getUserSymbol(){
            return this.userSymbol;
        }
        getUserSelection(){
            this.state.getUserSelection(this, this.p);
        }
        newMove(){
            this.state.newMove();
        }
        drawContent(){
            this.state.drawContent(this, this.p);
        }
        buttonWasPressed(){
            this.state.buttonWasPressed(this, this.p);
        }
        changeState(state){
            this.state = state;
        }

    }
    export class States{
        constructor(){

        }
        buttonWasPressed(gameInterface, p){}
        drawContent(gameInterface, p){}
        newMove(gameInterface, p){}
        getUserSelection(gameInterface, p){}
        reposition(gameInterface, p){}
    }
    export class Start extends States{
        constructor(){
            super();
            this.first = true;

        }
        static instance = new Start();
        static getInstance(){
            return this.instance;
        }
        drawContent(gameInterface, p){

            if(this.first){
                for(let button of gameInterface.DifficultyButtons){
                    button.show();
                }
                this.first = false;
            }


        }
        buttonWasPressed(gameInterface, p){
            this.first = true;
            for(let button of gameInterface.DifficultyButtons){
                button.hide();
            }
            stateTransitionInterval = p.millis() + 400;
            gameInterface.changeState(SymbolSelection.getInstance());
        }

    }
    export class SymbolSelection extends States{
        constructor(){
            super();
            this.drawInterval = 0;
            this.intervalDuration = 100;// millis
            this.first = true;
        }
        static instance = new SymbolSelection();
        static getInstance(){
            return this.instance;
        }
        drawContent(gameInterface, p){
            if(this.first){
                for(let button of gameInterface.symbolButtons){
                    button.show();
                }
                this.first = false;
            }

        }
        buttonWasPressed(gameInterface, p){
            this.first = true;
            for(let button of gameInterface.symbolButtons){
                button.hide();
            }
            stateTransitionInterval = p.millis() + 400;
            gameInterface.changeState(Play.getInstance())
        }

    }
    export class Play extends States{
        constructor(){
            super();
            this.drawBoard = true;
            this.drawSymbols = false;
            this.boardSize = 250;//width and hieght
            this.tileWidth = 63;//px
            this.boarderWidth = 14;// board boarder width in px
            this.tileHeight = 63;//px
            this.getUserInput;
            this.newMovePosition;



        }
        static instance = new Play();
        static getInstance(){
            return this.instance;
        }
        newMove(){

            this.drawSymbols = true;
        }

        drawContent(gameInterface, p){

            if(this.drawBoard){
                p.image(gameInterface.images.boardImage, p.width/2, p.height/2, this.boardSize, this.boardSize);
                this.drawBoard = false;
            }
            if(this.drawSymbols){
                    for(let row =0 ; row< gameInterface.board.length; ++row){
                        for(let col = 0; col < gameInterface.board[row].length; ++col){

                            if(gameInterface.board[row][col] == 'X'){
                                let positionX = this.StartOfBoardX + this.tileWidth * col + this.boarderWidth * col + 0.5 * this.tileWidth;
                                let positionY = this.StartOfBoardY + this.tileHeight * row + this.boarderWidth * row + 0.5 * this.tileHeight;
                                p.image(gameInterface.images.Ximage, positionX, positionY, 50, 50);
                            }else if(gameInterface.board[row][col] == 'O'){
                                let positionX = this.StartOfBoardX + this.tileWidth * col + this.boarderWidth * col + 0.5 * this.tileWidth;
                                let positionY = this.StartOfBoardY + this.tileHeight * row + this.boarderWidth * row + 0.5 * this.tileHeight;
                                p.image(gameInterface.images.Oimage, positionX, positionY, 50, 50);
                            }
                        }
                    }
                    if(gameInterface.ttt.terminal(gameInterface.board)){
                        this.drawBoard = true;
                        gameInterface.playAgain.show();
                        return;
                    }
                    this.drawSymbols = false;
            }
            let temp = gameInterface.ttt.player(gameInterface.board);
            if(gameInterface.EngineSymbol == temp){
                let move = gameInterface.ttt.minimax(gameInterface.board);
                gameInterface.board[move[0]][move[1]] = gameInterface.EngineSymbol;
                this.newMove();

            }else{
                this.getUserInput = true;
            }

        }
        getUserSelection(gameInterface, p){
            if(p.millis() < stateTransitionInterval){
                return;
            }

            if(this.getUserInput){
                for(let row = 0; row < gameInterface.board.length; ++row){

                    for(let col = 0; col < gameInterface.board[row].length; ++col){
                        let temp = this.tilePressed(row, col, gameInterface.p);

                        if(temp[0]){
                            gameInterface.board[row][col] = gameInterface.getUserSymbol();
                            this.newMove();
                            this.getUserInput = false;
                        }
                    }
                }

            }
        }
        tilePressed(row, col, p){
            let tileX = this.StartOfBoardX + this.tileWidth * col+ this.boarderWidth * col;//start of tile X;
            let tileY = this.StartOfBoardY + this.tileHeight * row + this.boarderWidth * row;
            if(p.mouseX > tileX && p.mouseX < tileX + this.tileWidth
                && p.mouseY > tileY && p.mouseY < tileY + this.tileHeight){
                    return [true, [row, col]];
            }
            return [false, []];
        }
        setPositions(width, height){
            this.StartOfBoardY = height/2 - (1.5 * this.tileHeight)- this.boarderWidth;
            this.StartOfBoardX = width/2 - (1.5 * this.tileWidth)- this.boarderWidth;
        }
        reposition(gameInterface, p){
            this.setPositions(p.width, p.height);
            this.newMove();
            this.drawBoard = true;
        }

    }

    export class End extends States{
        constructor(){
            super();
        }
        static instance = new End();
        static getInstance(){
            return this.instance;
        }
        drawContent(gameInterface, p){
            //playAgain Button?
        }
    }
    export function buttonPosition(i, offset, distanceBetweenButtons, pWidth){

        return pWidth* offset + i *distanceBetweenButtons * pWidth
    }