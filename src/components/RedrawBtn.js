import React from 'react';

export const RedrawBtn = (props) => {
    const {redrawsCount, isLose, redraw} = props;
    return (
        <div>
          <button
            disabled={redrawsCount === 0 || isLose}
            className="btn btn-warning btn-sm"
            onClick={() => redraw()}>
            <i className='fa fa-refresh'>
              {' ' + redrawsCount}
            </i>
          </button>
        </div>
    )
};