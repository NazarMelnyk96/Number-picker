import React from 'react';
import '../styles.css';
import _ from 'underscore';

export const Stars = props => {  
  let stars = _.range(0, props.starsCount);
 
  return (
    <div className="col-5">
      {stars.map((star, i) => 
        <i key={i} className="fa fa-star" /> 
      )}
    </div>
  );
};