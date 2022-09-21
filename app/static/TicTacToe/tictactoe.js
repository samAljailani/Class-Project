
import * as utilities from "./classes.js"
var parentID = 'tictactoe';
var canvasParent = document.getElementById(parentID);
const s= (p)=>{
    let bg;
    let Ximage;
    let Oimage;
    let boardImage;
    let drawIntervalDuration = 1000; //millis
    let drawInterval = 0;
    let user;
    let flag = false;
    let board;
    let game;
    let images;
    let div;
    let clickInterval = 0;
    p.preload = function(){

        images = {
            bg: p.loadImage('./static/TicTacToe/images/background.jpg'),
            boardImage: p.loadImage('./static/TicTacToe/images/board.png'),
            Ximage: p.loadImage('./static/TicTacToe/images/X2.png'),
            Oimage: p.loadImage('./static/TicTacToe/images/O.png')

        }
    }
    p.setup = function(){
        let width = canvasParent.offsetWidth;
        let canvas = p.createCanvas(width, 500);
        div = p.createDiv();
        div.id("button-container");
        div.position(0, p.height/2, 'none')
        p.noStroke();
        p.imageMode(p.CENTER);
        utilities.Play.getInstance().setPositions(p.width, p.height);
        p.image(images.bg, p.width/2, p.height/2, p.width, p.height);
            let difficultyButtons = createButtons(['easy', 'medium', 'impossible'],
                                                  [easyPressed, mediumPressed, impossiblePressed],
                                                  75, 50, div);
            let SymbolButtons = createButtons(['Play as X', 'Play as O'], [playAsX, playAsO], 75, 50, div);
            let playAgain = p.createButton('Play Again?')
            playAgain.position(0, 200, 'relative');
            playAgain.size(150, 75);
            playAgain.hide();
            div.child(playAgain);
            playAgain.mousePressed(resetGame);
            game = new utilities.Game(p, difficultyButtons,SymbolButtons,playAgain, images);


    }

    p.draw = function(){
        game.drawContent();
    }
    p.windowResized = function(){

        let width= canvasParent.offsetWidth;

        p.resizeCanvas(width, 500);

        game.p = p;
        p.image(images.bg, p.width/2, p.height/2, p.width, p.height);
        game.reposition();


    }
    p.mouseClicked = function(){
        if(p.millis() > clickInterval){
            game.getUserSelection();
            clickInterval = p.millis() + 100;
        }
    }
    function easyPressed(){
        game.ttt.depth(2);
        game.buttonWasPressed();

    }
    function mediumPressed(){
        game.ttt.depth(3);
        game.buttonWasPressed();
    }
    function impossiblePressed(){
        game.ttt.depth(6);
        game.buttonWasPressed();
    }
    function playAsX(){
        game.setUserSymbol('X');
        game.buttonWasPressed();
    }
    function playAsO(){
        game.setUserSymbol('O');
        game.buttonWasPressed();
    }
    function resetGame(){
        game.board = game.ttt.initial_state();
        p.image(images.bg, p.width/2, p.height/2, p.width, p.height);
        game.playAgain.hide();
        game.changeState(utilities.Start.getInstance());
    }
        function createButtons(buttonText,callbacks, width, height, parentDiv = undefined){
        //callbacks.length == buttonText.length
        let buttons = [];
        for(let i = 0; i < buttonText.length;++i){
            let temp = p.createButton(buttonText[i]);
            temp.mousePressed(callbacks[i]);
            temp.size(width, height);
            temp.hide();
            buttons.push(temp);
            if(parentDiv != undefined){
                parentDiv.child(temp);
            }
        }
        return buttons;
    }
}


let myp5 = new p5(s, parentID);