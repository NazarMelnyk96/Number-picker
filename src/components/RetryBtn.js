import React from 'react';

export const RetryBtn = (props) => {
  return (
    <div>
      <button        
        className="btn btn-sm"
        onClick={() => props.retry()}>
        <i className='fa fa-repeat'>          
        </i>
      </button>
    </div>
  );
};