import { useHistory } from '@tea/app';
import { Bubble, Card } from '@tencent/tea-component';
import React, { useEffect, useState } from 'react';

export default function RecommendItem(props) {
  const [theData, setTheData] = useState({});
  const history = useHistory();

  // 根据props.list更新list
  useEffect(() => {
    setTheData({ ...props.theData });
  }, [props.theData]);

  const handleItemClck = data => {
    history.push(`/recommend/${data.recommendId}`);
  };
  const handletitleColor = data => {
    let color = '';
    switch (data) {
      case 'low':
        color = '#DDF4E9';
        break;
      case 'mid':
        color = '#FDF2D3';
        break;
      case 'high':
        color = '#FAE0DE';
        break;
      default:
        color = 'green';
    }
    return color;
  };
  useEffect(() => {}, [theData]);

  useEffect(() => {}, []);
  return (
    <Card bordered className="recommend-area-item">
      <div className="recommend-item-header">{(theData as any).theArea}</div>
      <div className="recommend-item-header-border"></div>

      <Card.Body className="recommend-item-container" title={props.theArea}>
        {((theData as any).categorys || []).map((item, index) => {
          return (
            <div className="category-group" key={item.category}>
              <Bubble content={item.category}>
                <div className="category-title">{item.category}</div>
              </Bubble>
              <div className="svg-content">
                {(item.recommends || []).map((reItem, index) => {
                  let points: any = '0,-50  90,-50';
                  let top: any = 0;

                  if (index === 0) {
                    points = '0,-50  90,-50';
                  } else {
                    points = `30,-50 30,75 90,75`;
                    top = 50 * (index - 1);
                  }

                  return (
                    <div className="svg-item" style={{ top: top }} key={reItem.recommendId}>
                      <svg width="40" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <marker
                            id="triangle"
                            viewBox="0 0 10 10"
                            refX="6"
                            refY="6"
                            markerUnits="strokeWidth"
                            markerWidth="8"
                            markerHeight="14"
                            orient="auto"
                          >
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#979797" />
                          </marker>
                        </defs>
                        <polyline
                          strokeWidth="2"
                          fill="none"
                          stroke="black"
                          points={points}
                          markerEnd="url(#triangle)"
                        />
                      </svg>
                    </div>
                  );
                })}
              </div>
              <div className="cagegory-items-content">
                {(item.recommends || []).map((cItem, index) => {
                  return (
                    <section key={index}>
                      <Bubble content={cItem.theTitle}>
                        <div
                          className="cagegory-item"
                          onClick={() => {
                            handleItemClck(cItem);
                          }}
                        >
                          <span style={{ backgroundColor: handletitleColor(cItem.dangerLevel), padding: '0 8px' }}>
                            {cItem.theTitle}
                          </span>
                        </div>
                      </Bubble>
                    </section>
                  );
                })}
              </div>
            </div>
          );
        })}
      </Card.Body>
    </Card>
  );
}
