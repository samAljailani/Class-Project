var parentID = 'canvasContainer';
var canvasParent = document.getElementById(parentID);


const s = (p) =>{
    let cardBack;
    let interval = 0;
    let intervalDuration = 5; //millis
    let speed;
    let numOfCards;
    let cardGame;
    let distanceBetweenCards;
    let offset;
    function cardPosition(cardNumber, offset, distanceBetweenCards) {return p.width* offset + (cardNumber - 1) *distanceBetweenCards * p.width;}
    function drawScore(){
        p.textSize(p.width/25);
        p.textAlign(p.LEFT);
        p.text('Score: ' + cardGame.Score(), 10, p.height - (p.width/20) + 10);
        p.fill(91,192,222);
    }
    p.preload = function(){
        bg = p.loadImage('./static/p5js/background.webp')
        cardBack       = p.loadImage('./static/p5js/cardBack.png');
        cardImages = [
            p.loadImage('./static/p5js/AofHearts.png'),
            p.loadImage('./static/p5js/8OfDiamonds.png'),
            p.loadImage('./static/p5js/8OfClovers.png'),
            p.loadImage('./static/p5js/KingOfSpades.png')
        ]
        AofHearts      = p.loadImage('./static/p5js/AofHearts.png');
        eightofDimonds = p.loadImage('./static/p5js/8OfDiamonds.png');
        eightofClovers = p.loadImage('./static/p5js/8OfClovers.png');
        KingOfSpades   = p.loadImage('./static/p5js/KingOfSpades.png');
    }
    p.setup = function(){
        var width = canvasParent.offsetWidth;
        let canvas = p.createCanvas(width, 500);
        bg.resize(p.width, p.height);
        p.noStroke();
        p.imageMode(p.CENTER);
        speed = 3;
        offset = 0.2;// percentage of width
        numOfCards = 4;
        distanceBetweenCards = 0.2;//percentage of width
        cards = []
        for(let i = 0; i < numOfCards; ++i){
            if( i ==0){
                cards.push(new Card(cardBack, cardImages[i], true, cardPosition(i+1, offset, distanceBetweenCards),p.height/2, p.width, p.height, speed, speed))
            }else{
                cards.push(new Card(cardBack, cardImages[i], false, cardPosition(i+1, offset, distanceBetweenCards),p.height/2, p.width, p.height, speed, speed))
            }
        }
        cardGame = new Game(cards);
    }
    p.draw= function() {
        if( p.millis() > interval ){ 
            p.image(bg, p.width/2, p.height/2, p.width, p.height);
            drawScore();
            for(card of cardGame.cards){
                card.draw();
            }
            cardGame.preGame();
            cardGame.shuffle();
            interval = p.millis() + intervalDuration;
            cardGame.updateHighScore();
        }
        
        cardGame.viewResults();
    }
    p.mouseClicked = function(){
        //uses state desing pattern so if the current state is not 
        //GetUserSelection nothing will happen
        cardGame.getUserSelection();
        cardGame.startGame();
    }
    p.windowResized = function(){
        width= canvasParent.offsetWidth;
        var temp =  Shuffle.getInstance().cardStartingPosition1 / p.width;
        Shuffle.getInstance().cardStartingPosition1  = Math.floor(temp *  width);
        temp =  Shuffle.getInstance().cardStartingPosition2 / p.width;
        Shuffle.getInstance().cardStartingPosition2  = Math.floor(temp *  width);
        p.resizeCanvas(width, 500);
        for (card of cardGame.cards){
            card.reposition(width, p.height);
        }

        // bg.resize(p.width, p.height);
        // p.background(bg);
      }

      class Card{
        
        constructor(back,front,winner, x, y, windowWidth, windowHeight, xAdder=2, yAdder=2){
            this.cardback = back;
            this.cardfront = front;
            this.winner = winner;
            this.currentImage = this.cardfront;
            this.x = Math.floor(x);
            this.y = Math.floor(y);
            this.yAdder = yAdder;
            this.xAdder = xAdder;
            this.windowHeight = windowHeight;
            this.windowWidth = windowWidth;
            if(p.width > 400){
                this.width = p.width/ 15;
            }else{
                this.width = 40;
            }
            this.height = this.width * 1.5;
            
            
        }
        winningCard(){
            return this.winner;
        }
        setAdders(x, y=undefined){
            this.xAdder = x;
            if(y != undefined){
                this.yAdder = y;
            }
        }
        incrementXAdder( i = undefined){
            if(i != undefined){
                this.xAdder +=i;
            }else{
                this.xAdder += 1;
            }
            
        }
        incrementYAdder(i = undefined){
            if(i != undefined){
                this.yAdder += i;
            }else{
                this.yAdder += 1;
            }
        }
        incrementAdders(i = undefined){
            this.incrementXAdder(i);
            this.incrementYAdder(i);
        }
        incrementX(i = undefined){
            if( i !== undefined){
                this.x += i;
            }else{
                this.x += this.xAdder;
            }

        }
        incrementY(i = undefined){
            if( i !== undefined){
                this.y += i;
            }else{
                this.y += this.yAdder;
            }
        }
        increment(i = undefined){
            this.incrementY(i);
            this.incrementX(i);
            
        }
        decrementX(i = undefined){
            if( i !== undefined){
                this.x -= i;
            }else{
                this.x -= this.yAdder;
            }
        }
        decrementY(i = undefined){
            if( i !== undefined){
                this.y -= i;
            }else{
                this.y -= this.yAdder;
            }
        }
        decrement(i = undefined){
            this.decrementY(i);
            this.decrementX(i);
        }
        //only takes values front and back
        draw(){
                p.image(this.currentImage, this.x, this.y, this.width, this.height);

        }
        flip(){
            if(this.currentImage === this.cardback){
                this.currentImage = this.cardfront;
            }else if(this.currentImage === this.cardfront){
                this.currentImage = this.cardback;
            }
        }
        flipToBack(){
            this.currentImage = this.cardback;
        }
        flipToFront(){
            this.currentImage = this.cardfront;
        }
        
        reposition(newWidth, newHeight){
            //repsoitioning x
            var temp = 0;
            temp = this.x / this.windowWidth;
            this.x = Math.floor(temp *  newWidth);
            //repositioning y
            // temp = this.y / this.windowHeight;
            // this.y = Math.floor(temp * newHeight);
            //reseting window dimensions
            this.windowHeight = newHeight;
            this.windowWidth = newWidth;
            //resizing card
            if(newWidth > 400){
                this.width = newWidth/ 15;
            }else{
                this.width = 40;
            }
            //
            console.log('reposition', this.x, this.y);
            this.height = this.width * 1.5;
            p.image(this.cardback, this.x, this.y, this.width, this.height);
        }
        
    }

class Game{
    constructor(cards){
        this.cards = cards;
        this.state = Start.getInstance();
        this.playerWon = false;
        this.playerScore = 0;
        this.currentLevel = 1;
    }
    startGame(){
        this.state.startGame(this);
    }
    nextLevel(){
        this.currentLevel +=1;
        for(card of cards){
            card.incrementXAdder(2);
        }
        

    }
    resetGame(){
        for(card of this.cards){
            card.flipToBack();
            card.setAdders(2);
        }
        this.currentLevel = 1;
        this.resetScore();
    }
    setPlayerWonRound(temp){
        this.playerWon = temp;
    }
    playerWonRound(){
        return this.playerWon;
    }
    Score(){
        return this.playerScore;
    }
    incrementScore(){
        this.playerScore += 10;
    }
    updateHighScore(){
        this.state.updateHighScore(this);
    }
    resetScore(){
        this.playerScore = 0;
    }
    ///////////state design pattern functions
    shuffle(){
        this.state.shuffle(this);
    }
    getUserSelection(){
        this.state.getUserSelection(this);
    }
    viewResults(){
        this.state.viewResults(this);
    }
    preGame(){
        this.state.preGame(this);
    }
    
    changeState(state){
        this.state = state;
    }
}
///////////////////////////////////////////////////////
//////////////////////////States///////////////////////
//  _______________           __________________           ______________           ______________
// |               |         |                  |         |              |         |              |
// |    Shuffle    | ------> | GetUserSelection | ------> |  ViewResults | ------> |    Shuffle   |
// |_______________|         |__________________|         |______________|         |______________|
//  
class States{
    constructor(){

    }
    startGame(gameInstance) {};
    shuffle(gameInstance){}
    getUserSelection(gameInstance){}
    viewResults(gameInstance){}
    preGame(gameInstance){}
    updateHighScore(gameInstance){}
    // viewResults(){return false;}
    // getInfo()    {return false;}
    changeState(gameInstance, state){
        gameInstance.changeState(state);
    }
    
}
class Start extends States{
    constructor(){
        super();
    }
    static instance = new Start();
    static getInstance(){
        return this.instance;
    }
    startGame(gameInstance){
        gameInstance.resetGame();
        gameInstance.changeState(Shuffle.getInstance());
    }
    preGame(){
        p.textSize(p.width/25);
        p.textAlign(p.CENTER);
        p.text('Click anywhere to Start ' , p.width/2, p.width/20 + 10);
        p.fill(91,192,222);
    }
}
class Shuffle extends States{
    static instance = new Shuffle();
    constructor(){
        super();
        //swap variables
        this.index1 = -1;
        this.index2 = -1;
        this.lockSwap = false;
        //shuffle variables
        this.shuffleInProgress = false;
        this.shuffleCount = 0;
        this.curveCenter = 0;;
    }
    static getInstance(){
        return this.instance;
    }
    shuffle(gameInstance){
        if(!this.shuffleInProgress){
            this.shuffleCount = 0;
            this.shuffleInProgress = true;
            //num of swaps declared here
            this.numOfSwaps = Math.ceil(gameInstance.currentLevel*1.5 + 5);
        }
        if(!this.lockSwap){
            this.index1 = Math.floor(Math.random()* numOfCards);
            this.index2 = Math.floor(Math.random()* numOfCards);
            while (this.index1 == this.index2){
                this.index2 = Math.floor(Math.random()*numOfCards);
            }
            ++this.shuffleCount; 
        }
        this.swap(this.index1, this.index2, gameInstance);
        if(this.shuffleCount == this.numOfSwaps && !this.lockSwap){
            this.shuffleCount = 0;
            this.shuffleInProgress = false;
            this.lockShuffle = false;
            gameInstance.changeState(GetUserSelection.getInstance());
        }
    }
    swap(i, j, gameInstance){

    
        if(!this.lockSwap){
            if(gameInstance.cards[i].x > gameInstance.cards[j].x){
                this.index1 = j;
                this.index2 = i;
            }else{
                this.index1 = i;
                this.index2 = j;
            }
            this.curveCenter = (gameInstance.cards[this.index1].x + gameInstance.cards[this.index2].x) /2;
            this.lockSwap = true;
            this.cardStartingPosition1 = gameInstance.cards[this.index1].x;
            this.cardStartingPosition2 = gameInstance.cards[this.index2].x;

            let deltaY = 250 - (250 + 0.4* 500);
            let deltaX = gameInstance.cards[this.index2].x - gameInstance.cards[this.index1].x;
            this.yIncrememt = (deltaY / deltaX) * gameInstance.cards[this.index1].xAdder;
            
        }
        let index1 = this.index1;
        let index2 = this.index2;
        if(gameInstance.cards[index1].x < this.curveCenter){
            gameInstance.cards[index1].incrementX(gameInstance.cards[index1].xAdder);
            gameInstance.cards[index1].decrementY(this.yIncrememt);

        }else if(gameInstance.cards[index1].x >= this.curveCenter){
            gameInstance.cards[index1].incrementX(gameInstance.cards[index1].xAdder);
            gameInstance.cards[index1].incrementY(this.yIncrememt);
        }
        if(gameInstance.cards[index2].x < this.curveCenter){
            gameInstance.cards[index2].decrementX(gameInstance.cards[index2].xAdder);
            gameInstance.cards[index2].decrementY(this.yIncrememt);

        }else if(gameInstance.cards[index2].x >= this.curveCenter){
            gameInstance.cards[index2].decrementX(gameInstance.cards[index2].xAdder);
            gameInstance.cards[index2].incrementY(this.yIncrememt);
        }
        if(gameInstance.cards[index1].x >= this.cardStartingPosition2){
            //correting offset
            gameInstance.cards[index1].x = this.cardStartingPosition2;
            gameInstance.cards[index1].y = p.height/ 2;
            //correcting second card offset
            gameInstance.cards[index2].x = this.cardStartingPosition1;
            gameInstance.cards[index2].y = p.height/ 2;
            this.lockSwap = false;
            //change state to get user input
        }
        }
}
class GetUserSelection extends States{
    constructor(){
        super();
    }
    static instance = new GetUserSelection();
    static getInstance(){
        return this.instance;
    }
    getInfo(){return true;}
    getUserSelection(gameInstance){
        for(card of gameInstance.cards){
            if(p.mouseX > card.x - (card.width/2) && p.mouseX < card.x + (card.width/2)
                && p.mouseY > card.y - (card.height/2)&& p.mouseY < card.y + (card.height/2)){
                //changingInstance to viewResults
                card.flip();
                if(card.winningCard()){
                    gameInstance.setPlayerWonRound(true);
                    gameInstance.incrementScore();
                }else{
                    gameInstance.setPlayerWonRound(false);
                }
                
                gameInstance.changeState(ViewResults.getInstance());
                break;
            }
        }
    }
}
class ViewResults extends States{
    constructor(){
        super();
        this.resultsInterval = 0;
        this.intervalDuration = 3500;//three seconds 500 is used for the change state in results()
        this.IntervalisSet = false;
    }
    static instance = new ViewResults();
    static getInstance(){
        return this.instance;
    }
    //may not be needed
    // viewResults(){
    //     return true;
    // }
    viewResults(gameInstance){
        if(!this.intervalisSet){
            this.resultsInterval = p.millis() + this.intervalDuration;
            this.intervalisSet = true;
        }
        console.log('before millis')
        if(p.millis() < this.resultsInterval){
            if(cardGame.playerWonRound()){
                p.textSize(p.width/25);
                p.textAlign(p.CENTER)
                p.text('Great Job!', p.width/2, p.height/1.25);
                p.fill(91,192,222);
                if(p.millis() >= (this.resultsInterval - 500)){
                    gameInstance.setPlayerWonRound(false);
                    gameInstance.nextLevel();
                    this.intervalisSet = false;
                    for(card of gameInstance.cards){
                        card.flipToBack();
                    }
                    gameInstance.changeState(Shuffle.getInstance());
                }
            }else{
                p.textSize(p.width/25);
                p.textAlign(p.CENTER);
                p.text('Better Luck Next Time :(', p.width/2, p.height/1.25);
                p.fill(91,192,222);
                if(p.millis() >= (this.resultsInterval - 500)){
                    gameInstance.changeState(EndGame.getInstance());
                    gameInstance.setPlayerWonRound(false);
                    this.intervalisSet = false;
                }
            }
        }
        
    }

}
class EndGame extends States{
    constructor(){
        super();
    }
    static instance = new EndGame();
    static getInstance(){
        return this.instance;
    }
    updateHighScore(gameInstance){
        $.ajax({
            url:'/api/game/highScore',
            type:'POST', 
            contentType:"application/json; charset=utf-8",
            data:JSON.stringify(gameInstance.Score()), 
            success:function(){
            }
        })
        for(card of gameInstance.cards){
            card.flipToFront();
        }
        gameInstance.changeState(Start.getInstance());
    }
}
}
let myp5 = new p5(s, parentID);
