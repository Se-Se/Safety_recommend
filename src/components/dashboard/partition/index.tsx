import { randomString } from '@src/utils/util';
import { Row, Tooltip } from '@tencent/tea-component';
import cls from 'classnames';
import { pinyin } from 'pinyin-pro';
import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './index.less';

const PartitionCard: React.FC<{
    cols: number,
    data: any,
    edit: boolean,
    business: Array<string>,
    onClick: () => void,
    onSelect?: (dom) => void
}> = (props) => {
    const partData = props.data;

    const getIcon = (type) => {
        let typePinyin = ''
        if (type) {
            typePinyin = pinyin(type, {toneType: 'none', type: 'array'}).join('');
        }
        // const image = type + '.svg'
        return require('./image/computer.svg')
    }

    // 每一个系统/资产
    const partUnit = (index) => {
        const unit = partData.data[index];
        return <div className="part-unit" key={index} >
            <div id={'part_' + unit.key} className={cls("unit-box", { select: props.business && props.business.indexOf(unit.text) > -1 })}
                onClick={() => {
                    const dom = document.getElementById('part_' + unit.key);
                    props.onSelect(dom);
                }}>
                <img src={getIcon(unit.class)} className="part-icon" />
                <div className="part-text" title={unit.text}>{unit.text}</div>
            </div>
        </div>;
    }

    return <div key={randomString(4)} className="partition-content" onClick={() => {
        props.onClick();
    }}>
        <div className="part-title">{partData.title}</div>
        <Row className="part-content">
            {
                partData.data.map((item, index) => {
                    if (item.select) {
                        if (item['data'] && item['data'].length) {
                            return <Tooltip title={
                                <div className='data-content'>
                                    {
                                        item['data'].map(it => {
                                            return <div className="data-unit">{it}</div>
                                        })
                                    }
                                </div>
                            }>
                                {partUnit(index)}
                            </Tooltip>
                        } else {
                            return partUnit(index);
                        }
                    } else {
                        return null;
                    }
                })
            }
        </Row>
    </div>
};

export default PartitionCard;
