import React from 'react';

export const Answer = (props) => {
  return (
    <div className="col-4">
      {props.selectedNumbers.map((number, i) => 
        <span onClick={() => props.deselectNumber(number)} 
          key={i}>
          {number}
        </span>
      )}
    </div>);
};
