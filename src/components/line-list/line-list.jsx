import { Icon } from '@tencent/tea-component';
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import './line-list.less';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Item = ({ quote, index }) => {
  const style = { color: '#888888' };
  return (
    <Draggable draggableId={quote.id} index={index}>
      {provided => (
        <div
          className={quote.active ? 'item item-active' : 'item'}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {quote.editable || (true && <Icon className="drag-hint" type="drop"></Icon>)}
          <div className="content">
            <span className="text">{quote.content}</span>
            {quote.editable || (true && <Icon type="delete"></Icon>)}
          </div>
          <div style={style}>{quote.grid || 'placeholder'}</div>
        </div>
      )}
    </Draggable>
  );
};

const ItemList = ({ quotes }) => {
  return quotes.map((quote, index) => <Item quote={quote} index={index} key={quote.id} />);
};

function DraggableList({ initial }) {
  const [state, setState] = useState({ quotes: initial });

  function onDragEnd(result) {
    let quotes = state.quotes;
    if (result.destination && result.destination.index !== result.source.index) {
      quotes = reorder(state.quotes, result.source.index, result.destination.index);
    }

    quotes.forEach(elem => {
      elem.active = false;
    });

    setState({ quotes });
  }

  function onDragStart() {
    const quotes = state.quotes;
    quotes.forEach(elem => {
      elem.active = true;
    });
    setState({ quotes });
  }

  return (
    <div className="container">
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable droppableId="list">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="items">
              <ItemList quotes={state.quotes} />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default DraggableList;
