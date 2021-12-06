import { Button, Card } from '@tencent/tea-component';
import React from 'react';

export default function ManiItem(props) {
  const edit = (ev: any) => {
    ev.stopPropagation();
    props.edit();
  };

  return (
    <Card bordered className="main-card-item">
      <Card.Body className="main-card-img"></Card.Body>
      <Card.Body className="main-item-body" title={props.tradeN}>
        {props.description}
      </Card.Body>
      <Card.Footer>
        <Button
          className="main-item-edit-btn"
          type="link"
          onClick={ev => {
            edit(ev);
          }}
        >
          编辑
        </Button>
      </Card.Footer>
    </Card>
  );
}
