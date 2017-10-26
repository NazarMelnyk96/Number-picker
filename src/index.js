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
import { Timer } from './components/Timer';

Numbers.list = _.range(1, 10);
Timer.start = Date.now();

class App extends React.Component {    
  REDRAWS_COUNT = 7;
  NUMBERS_COUNT = 9;
  LIMIT_SEC = 60;
  WIN_MESS = 'You win';
  LOSE_MESS = 'You lose';

  initialState = {
    selectedNumbers: [],    
    starsCount: getRandomNumberInRange(this.NUMBERS_COUNT),
    isAnswerCorrect: null,
    isLose: null,
    redrawsCount: this.REDRAWS_COUNT,
    limitElapsed: false,
    isFinal: false,
  };

  state = this.initialState;

  selectNumber = clickedNumber => {
    if (_.contains(this.state.selectedNumbers, clickedNumber) || this.state.isLose) {
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
    this.setIsLoseState(isLose);
    this.setState({
        isFinal: isFinal
    });
    return isFinal;
  };

  removeUsedNumbers = (selectedNumbers) => {
    Numbers.list = Numbers.list.filter(n => !_.contains(selectedNumbers, n));
  };

  getNextStarsCount = () => {
    let nextNumber = getRandomNumberInRange(this.NUMBERS_COUNT);
      while (nextNumber === this.state.starsCount) {
        nextNumber = getRandomNumberInRange(this.NUMBERS_COUNT);
    }
    return nextNumber;
  };

  redraw = () => {
    if (this.state.isLose) return;
    this.state.redrawsCount--;
    this.setState({
      selectedNumbers: [],
      starsCount: this.getNextStarsCount(),
      isAnswerCorrect: null
    }, () => this.checkGameFinish(this.state.starsCount));
  };

  retry = () => {    
    Numbers.list = _.range(1, 10);
    Timer.start = Date.now();
    Timer.timer = setInterval(Timer.tick, 100);
    this.setState(this.initialState);
  };

  setIsLoseState = (isLose, callback) => {
    this.setState({
        isLose: isLose
    }, () => callback && callback());
  };

  setIsLimitElapsed = (isLimitElapsed) => {
    this.setState({
        limitElapsed: isLimitElapsed
    });
  };

  render() {
    const { 
      starsCount,
      selectedNumbers,
      isAnswerCorrect,
      isLose,
      redrawsCount,
    } = this.state;
    
    let finalMessage = isLose === true 
      ? this.LOSE_MESS
      : isLose === false 
        ? this.WIN_MESS
        : null;
    
    return (
      <div className="container">
        <nav className="navbar navbar-default">
          <Header />
          <Timer
              isFinal={this.state.isFinal}
              setIsLimitElapsed={this.state.setIsLimitElapsed}
              limitElapsed={this.state.limitElapsed}
              limitSec={this.LIMIT_SEC}
              setIsLoseState={this.setIsLoseState}
          />
        </nav>
        <hr />
        <div className="row">
          <Stars starsCount={starsCount} />
          <div className="col-2 text-center">
            <AcceptBtn 
              isAnswerCorrect={isAnswerCorrect}
              acceptNumbers={this.acceptNumbers}
              starsCount={starsCount} 
              selectedNumbers={selectedNumbers}
            />
            <br />
            <RedrawBtn
              isLose={isLose}
              redrawsCount={redrawsCount}
              redraw={this.redraw}
            />
            <br />
            {
              finalMessage
                ? <RetryBtn retry={this.retry}/>
                : ''
            }
          </div>
          <Answer 
            deselectNumber={this.deselectNumber} 
            selectedNumbers={selectedNumbers}
          />
        </div>
        <br />
        <div className="flex-container">
          <GameFinal finalMessage={finalMessage}/>
        </div>
        <Numbers
          isLose={isLose}
          selectNumber={this.selectNumber}
          selectedNumbers={selectedNumbers}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
