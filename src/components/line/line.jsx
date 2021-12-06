import React from 'react';
import './line.less';

const GenPath = props => {
  let { x0, y0, x1, y1, round } = props;
  const wDelta = x1 - x0;
  const hDelta = y1 - y0;
  const width = Math.abs(wDelta) >= round ? Math.abs(wDelta) : 0;
  const height = Math.abs(hDelta) >= round ? Math.abs(hDelta) : 0;
  let path;
  if (width == 0 && height > 0) {
    path = `M${x0},${y0} v${hDelta}`;
  } else if (height == 0 && width > 0) {
    path = `M${x0},${y0} h${wDelta}`;
  } else if (wDelta < -10 && hDelta < -10) {
    path = `
      M${x0},${y0}
      h${wDelta - round}
      a${round},${round} 0 0 1 -${round},-${round}
      v${hDelta - round}
    `;
  } else if (wDelta > 10 && hDelta > 10) {
    path = `
      M${x0},${y0}
      h${wDelta - round}
      a${round},${round} 0 0 1 ${round},${round}
      v${hDelta - round}
    `;
  }

  return path;
};

const Line = ({ from, to, index, active }) => {
  const { x: x1, y: y1 } = from;
  const { x: x2, y: y2 } = to;
  const round = 4;
  const dpath = GenPath({ x0: x1, y0: y1, x1: x2, y1: y2, round });

  return (
    <div className="broken-line">
      <svg width="100%" height="100%" viewBox="0 0 500 500" className="svg-line">
        <defs>
          <marker
            id={'markerCircle' + index}
            viewBox="0 0 10 10"
            markerWidth="26"
            markerHeight="26"
            refX="8"
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <circle cx="5" cy="5" r="3" stroke="none" fill="red" />
            <text x="5" y="5.5" dominantBaseline="middle" textAnchor="middle" fontSize="3px">
              {index}
            </text>
          </marker>
          <marker
            id="markerArrow"
            viewBox="0 0 12 12"
            markerWidth="12"
            markerHeight="12"
            refX="2"
            refY="6.5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M2,2 L2,11 L10,6 L2,2" />
          </marker>
        </defs>
        {active ? (
          <path
            d={dpath}
            fill="none"
            className="svg-line-marker active"
            pathLength="1"
            id="theMotionPath"
            markerStart={`url(#markerCircle${index})`}
          />
        ) : (
          <path d={dpath} fill="none" className="svg-line-marker" pathLength="1" id="theMotionPath" />
        )}
        {active && (
          <circle r="3" fill="red">
            <animateMotion dur="2s" repeatCount="indefinite">
              <mpath xlinkHref="#theMotionPath" />
            </animateMotion>
          </circle>
        )}
      </svg>
    </div>
  );
};

export default Line;
