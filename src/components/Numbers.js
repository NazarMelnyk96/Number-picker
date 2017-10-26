import React from 'react';
import '../styles.css';
import { contains } from 'underscore';

export const Numbers = (props) => {
  const getNumberClassName = (number) => {
    return contains(props.selectedNumbers, number) || props.isLose
      ? 'selected'
      : '';
  };

  return (
    <div className="card text-center">
      <div>
        {Numbers.list.map((number, i) => 
          <span className={getNumberClassName(number)}  
            onClick={() => props.selectNumber(number)}
            key={i}>
            {number}
          </span>
      )}
      </div>
    </div>
  );
};