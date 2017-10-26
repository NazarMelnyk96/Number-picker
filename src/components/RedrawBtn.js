import React from 'react';

export const RedrawBtn = (props) => {
  return (
    <div>
      <button 
        disabled={props.redrawsCount === 0}
        className="btn btn-warning btn-sm" 
        onClick={() => props.redraw()}>
        <i className='fa fa-refresh'> 
          {' ' + props.redrawsCount}
        </i>
      </button>
    </div>
  )
};