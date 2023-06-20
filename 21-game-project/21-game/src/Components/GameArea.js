import React from "react";
import StartGameButton from "./StartGameButton";
import PlayingTable from "./PlayingTable";
import socketIO from "socket.io-client"

const socket = socketIO.connect("http://localhost:4000")

let cardValues =  new Map([
  ['6', 6],
  ['7', 7],
  ['8', 8],
  ['9', 9],
  ['10', 10],
  ['J', 2],
  ['Q', 3],
  ['K', 4],
  ['A', 1],
]);


let deck = ["6", "6", "6", "6", "7", "7", "7", "7", "8", "8", "8", "8", "9", "9", "9", "9", "10", "10", "10", "10", "J", "J", "J", "J", "Q", "Q", "Q", "Q", "K", "K", "K", "K", "A", "A", "A", "A"];

export default class GameArea extends React.Component {
  constructor(props) {
    super(props);
    this.startGameButtonClick = this.startGameButtonClick.bind(this);
    this.menuTableButtonClick = this.menuTableButtonClick.bind(this);
    this.oneMoreButtonClick = this.oneMoreButtonClick.bind(this);
    this.enoughButtonClick = this.enoughButtonClick.bind(this);
    this.getDeckButtonClick = this.getDeckButtonClick.bind(this);
    this.state = {
    	is_Game_started: false,
    	cardPosition: 0,
    	cardSumm: 0,
      cardSummA: 0,
    	cards: ["cardBack", "cardBack"],
    	gameResult: " ",
    	isButtonDisabled: false
    }
  }

    componentDidMount() {
    	socket.on('newCardsReveal', (newCards) => {
    		if(newCards[0] !== null){
	    		let tempCards = [...this.state.cards];
	    		let curSum = this.state.cardSumm;
          let curSumA = this.state.cardSummA;
	    		console.log(newCards);
	    		for(let i = 0; i < newCards.length; i++)
	    		{
	    			tempCards[this.state.cardPosition + i] = newCards[i];
            if(curSumA > 0)
            {
              curSumA += cardValues.get(tempCards[this.state.cardPosition + i]);
              this.setState({cardSummA: curSumA});
            }
            else if((tempCards[this.state.cardPosition + i]) == 'A')
            {
              curSumA = curSum + 11;
              this.setState({cardSummA: curSumA});
            }
	    			curSum += cardValues.get(tempCards[this.state.cardPosition + i]);
	    			this.setState({cardSumm: curSum});
	    			this.setState({cards: [...tempCards], cardPosition: this.state.cardPosition + 1 + i});
	    		}
	    		if(curSum > 21)
			    {
			    	this.setState({gameResult: "You Lost"});
			    }
		    }
  		});

      socket.on('sendDeck', (deck) => {
        console.log(deck);
        this.setState({cards: deck});
      });
  }

  oneMoreButtonClick() {
    this.setState({cards: [...this.state.cards, "cardBack"]});
  	socket.emit("oneMoreCard", {socketID: socket.id, cardPosition: this.state.cardPosition});

  }
  enoughButtonClick() {
  	if(this.state.cardSumm < 19){
  		this.setState({gameResult: "You Lost", isButtonDisabled: true});
  	}
  	else
  		this.setState({gameResult: "You Won", isButtonDisabled: true});
  }

  startGameButtonClick() {
    this.setState({is_Game_started: true});
  }
  menuTableButtonClick() {
    this.setState({is_Game_started: false,
    	cardPosition: 0,
    	cardSumm: 0,
    	cards: ["cardBack", "cardBack"],
    	gameResult: " ",
    	isButtonDisabled: false
  });
    socket.emit("restartGame", {socketID: socket.id});
  }
  getDeckButtonClick() {
    socket.emit("getDeck", {socketID: socket.id});
  }
	render(){
		return(
		<>
			<StartGameButton is_Game_started={this.state.is_Game_started} startGameButtonClick={this.startGameButtonClick}/>
			<PlayingTable is_Game_started={this.state.is_Game_started} getDeckButtonClick={this.getDeckButtonClick} enoughButtonClick={this.enoughButtonClick} menuTableButtonClick={this.menuTableButtonClick} oneMoreButtonClick={this.oneMoreButtonClick} cardSumm={this.state.cardSumm} cardSummA={this.state.cardSummA} cards={this.state.cards} gameResult ={this.state.gameResult} isButtonDisabled={this.state.isButtonDisabled}/>
		</>
		);
	}
}