import React from 'react';
import { isEmpty } from 'underscore';

export const AcceptBtn = (props) => {
  const { 
    selectedNumbers, 
    starsCount, 
    acceptNumbers,
    isAnswerCorrect
  } = props;

  let button;
  switch (isAnswerCorrect) {
    case true: 
      button = (
        <button className="btn btn-success btn-lg">
          <i className='fa fa-check'> </i>
        </button>);
      break;
    case false: 
      button = (
        <button className="btn btn-danger btn-lg">
          <i className='fa fa-times'> </i>
        </button>);
      break;
    default: 
      button = (
        <button className="btn btn-lg"
          onClick={() => props.acceptNumbers()}
          disabled={isEmpty(props.selectedNumbers)}>
            <i className="fa">
              =
            </i>
          </button>);
  }
  return (
    <div>
      {button}
    </div>
  );
};