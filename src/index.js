import React from "react";
import _ from "underscore";
import { render } from "react-dom";
import { possibleCombinationSum, getRandomNumberInRange } from './helper';

import { Header } from "./components/Header";
import { Stars } from "./components/Stars";
import { AcceptBtn } from "./components/AcceptBtn";
import { Answer } from "./components/Answer";
import { Numbers } from "./components/Numbers";
import { RedrawBtn } from './components/RedrawBtn';
import { GameFinal } from './components/GameFinal';
import { RetryBtn } from './components/RetryBtn';

Numbers.list = _.range(1, 10);

class App extends React.Component {    

  initialState = {
    selectedNumbers: [],    
    starsCount: getRandomNumberInRange(9),
    isAnswerCorrect: null,
    isLose: null,
    redrawsCount: 7
  };

  state = this.initialState;

  selectNumber = clickedNumber => {
    if (_.contains(this.state.selectedNumbers, clickedNumber)) {
      return;
    }
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber),
      isAnswerCorrect: null,
    }));
  };

  deselectNumber = clickedNumber => {
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers
                                    .filter(n => n !== clickedNumber),
      isAnswerCorrect: null,
    }));
  };

  acceptNumbers = () => {
    const { selectedNumbers, starsCount } = this.state;    
    const isAnswerCorrect = this.getIsAnswerCorrect(selectedNumbers, starsCount);
    
    if (this.checkGameFinish(starsCount, isAnswerCorrect)) {
      return;
    }

    this.setState(prevState => ({
      isAnswerCorrect: isAnswerCorrect,
      starsCount: isAnswerCorrect 
        ? this.getNextStarsCount()
        : prevState.starsCount,
      selectedNumbers: isAnswerCorrect ? [] : selectedNumbers
    }), () => this.checkGameFinish(this.state.starsCount));

    isAnswerCorrect && this.removeUsedNumbers(selectedNumbers);
  };

  getIsAnswerCorrect = (selectedNumbers, starsCount) => {
    return starsCount === selectedNumbers.reduce((prev, next) => prev + next);
  };

  checkGameFinish = (starsCount) => {
    let isLose = null, isFinal = false;
    if (_.isEmpty(Numbers.list)) {
      isLose = false;  
      isFinal = true;
    }    
    if (this.state.redrawsCount === 0 && 
        !possibleCombinationSum(Numbers.list, starsCount) &&
        isLose === null) {
      isLose = true;
      isFinal = true;
    }    
    this.setState(prevState => ({      
      isLose: isLose
    }));
    return isFinal;
  };

  removeUsedNumbers = (selectedNumbers) => {
    Numbers.list = Numbers.list.filter(n => !_.contains(selectedNumbers, n));
  };

  getNextStarsCount = () => {
    let nextNumber = getRandomNumberInRange(9);
      while (nextNumber === this.state.starsCount) {
        nextNumber = getRandomNumberInRange(9);
    }
    return nextNumber;
  };

  redraw = () => {
    this.state.redrawsCount--;
    this.setState({
      selectedNumbers: [],
      starsCount: this.getNextStarsCount(),
      isAnswerCorrect: null
    }, () => this.checkGameFinish(this.state.starsCount));
  };

  retry = () => {    
    Numbers.list = _.range(1, 10);
    this.setState(this.initialState);
  };

  render() {
    const { 
      starsCount,
      selectedNumbers,
      isAnswerCorrect,
      isLose,
      redrawsCount
    } = this.state;
    
    let finalMessage = isLose === true 
      ? 'You lose'
      : isLose === false 
        ? 'You win'
        : null;
    
    return (
      <div className="container">
        <Header />
        <hr />
        <div className="row">
          <Stars starsCount={starsCount} />
          <div className="col-2 text-center">
            <AcceptBtn 
              isAnswerCorrect={isAnswerCorrect}
              acceptNumbers={this.acceptNumbers}
              starsCount={starsCount} 
              selectedNumbers={selectedNumbers}/>
              <br /> 
            <RedrawBtn 
              redrawsCount={redrawsCount}
              redraw={this.redraw} />
            <br />
            {finalMessage ? <RetryBtn retry={this.retry}/> : ''}
          </div>
          <Answer 
            deselectNumber={this.deselectNumber} 
            selectedNumbers={selectedNumbers} />
        </div>
        <br />
        <div className="flex-container">
          <GameFinal finalMessage={finalMessage}/>
        </div>
        <Numbers
          selectNumber={this.selectNumber}
          selectedNumbers={selectedNumbers} />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
