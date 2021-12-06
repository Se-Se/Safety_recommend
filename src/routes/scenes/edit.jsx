import QuoteApp from '@src/components/line-list/line-list';
import { Button, Collapse, Radio } from '@tencent/tea-component';
import React, { useState } from 'react';
import './edit.less';

// props
const initial = Array.from({ length: 10 }, (v, k) => k).map(k => {
  const custom = {
    id: `${k}`,
    content: `Content ${k}`,
    active: false,
  };

  return custom;
});

export default function CollapseMultiExample(props) {
  let { name: panelName, editable: addTrack } = props;
  const [checked, setChecked] = useState('');
  const [editable, setEditable] = useState(addTrack);
  // props
  const data = Array.from({ length: 4 }, (v, k) => k).map(k => {
    const custom = {
      id: `${k}`,
      content: `Content ${k}`,
      active: true,
    };

    return custom;
  });
  const activeOnes = data.reduce((r, c, i) => (c.active ? r.concat(i.toString()) : r), []);
  const [activeIndice, setactiveIndice] = useState([...activeOnes]);
  const style = { marginRight: 14, marginBottom: 19 };
  const content = data => (
    <div className="op">
      {!editable ? (
        <Button
          type="link"
          style={style}
          onClick={() => {
            setEditable(!editable);
          }}
        >
          编辑
        </Button>
      ) : (
        <div>
          <Button
            type="link"
            style={style}
            onClick={() => {
              setEditable(false);
            }}
          >
            保存
          </Button>
          <Button
            type="link"
            style={style}
            onClick={() => {
              setEditable(false);
            }}
          >
            取消
          </Button>
        </div>
      )}
      <QuoteApp initial={data} />
    </div>
  );
  const header = (selected, index) => (
    <div className="header">
      <Radio
        value={selected}
        onChange={value => {
          if (value) {
            setChecked(index);
            console.log(index);
          }
        }}
      />
      <span>高级设置 {index}</span>
    </div>
  );

  return (
    <div className="track-panel">
      <div className="panel-header">
        <span className="header-title">{panelName}</span>
        {addTrack && <Button type="link">新增路径</Button>}
      </div>
      <Collapse className="" defaultActiveIds={activeIndice} iconPosition="right">
        {data.map(data => (
          <Collapse.Panel id={data.id} title={header(data.id == checked, data.id)}>
            {content(initial)}
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
}
