import { Icon } from '@tencent/tea-component';
import cls from 'classnames';
import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import PartitionCard from '../partition';
import './index.less';

const AreaCard: React.FC<{
    edit: boolean,
    width: number,
    cols: number,
    dataSource: Array<{}>,
    business?: Array<string>,
    onChange: (type, key, value) => void,
}> = (props) => {
    const [column, setcolumn] = useState<boolean>(false);
    const dataSource = props.dataSource;

    const onLayoutChange = layout => {
        // const colWidth = props.width / props.cols;
        for (let index = 0; index < layout.length; index++) {
            const element = layout[index];
            if (index < dataSource.length) {
                // 修改大小
                // const contentLength = dataSource[index]['content']['data'].length;
                // const width = Math.floor((element['w'] * colWidth - 20) / 100);
                // const height = Math.ceil(contentLength / width);
                // console.log(width, height, element);
                
                ['x', 'y', 'w', 'h'].forEach(item => {
                    dataSource[index][item] = element[item];
                });
            }
        }
        setcolumn(!column);     // 强制渲染子组件
        props.onChange('data', 'layout', dataSource);
    }

    const drag = (_, layoutItem, event) => {
        const info = JSON.parse(event.dataTransfer.getData("text/plain"));
        const data = {
            content: info,
            x: layoutItem['x'],
            y: layoutItem['y'],
            w: info.data.length * 100 + 100,
            h: 8,
        };
        props.onChange('data', 'add', data);
    }

    const renderPartition = () => {
        return props.dataSource.map((item, index) => {
            const position = { 'minW': 1, 'minH': 1 };
            ['x', 'y', 'w', 'h'].forEach(k => {
                position[k] = item[k];
            })
            return <div key={index} className={cls('partition', { edit: props.edit })} data-grid={position}>
                {
                    props.edit ? <div className="delete-icon" onClick={() => {
                        props.onChange('data', 'delete', index);
                    }}>
                        <Icon type="dismiss" />
                    </div> : null
                }
                <PartitionCard key={index} cols={position['w']} data={item['content']} edit={props.edit} business={props.business} 
                onSelect={dom => {
                    props.onChange('data', 'select', dom);
                }}
                onClick={() => {
                    if (props.edit) {
                        props.onChange('data', 'edit', index)
                    }
                }} />
            </div>
        });
    }
    return (
        <div className="area-content">
            <GridLayout
                onLayoutChange={onLayoutChange}
                className="layout"
                layout={dataSource}
                isDraggable={props.edit}
                isResizable={props.edit}
                cols={props.cols}
                width={props.width}
                isDroppable={true}
                onDrop={drag}
                margin={[20, 20]}
                verticalCompact={false}
                rowHeight={1}
            >
                {renderPartition()}
            </GridLayout>
        </div>
    )
};

export default AreaCard;
