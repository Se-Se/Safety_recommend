import { DBTableName } from '@src/services';
import { randomString } from '@src/utils/util';
import { Icon } from '@tencent/tea-component';
import React, { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import './partition.less';

const PartitionManagerCard: React.FC<{
    onGroup: (group) => void
}> = (props) => {
    const [partition, setPartition] = useState<Array<{}>>([]);
    const [group, setGroup] = useState<boolean>(false);
    const { getAll } = useIndexedDB(DBTableName.area);


    useEffect(() => {
        getAll().then(data => {
            setPartition(data);
        }).catch(() => { });
    }, []);

    // 切换变更状态
    const changeStatus = () => {
        const curGroup = !group;
        setGroup(curGroup);
        props.onGroup(curGroup);
    }

    return <div className="partition-manager">
        <div className="manager-header">
            <a className="manager-right" href='/area'>管理</a>
            <div className="manager-left">分区</div>
        </div>
        <div className="manager-body">
            {
                !group && partition.map((item, index) => {
                    return <div className="manager-card" key={index} draggable={true}
                        onDragStart={event => {
                            const systems = item['belongSystem'].map(sys => { return { text: sys, type: 'system' } });
                            const properties = item['belongProperty'].map(sys => { return { text: sys, type: 'property' } });
                            event.dataTransfer.setData("text/plain", JSON.stringify({
                                id: item['areaId'],
                                title: item['areaName'],
                                data: systems.concat(properties).map(d => {
                                    return { text: d.text, select: true, type: d.type, key: randomString(6) };
                                }),
                            }))
                        }}>
                        {item['areaName']}
                    </div>
                })
            }
        </div>
        <div className="manager-change">
            <Icon type="convertip--blue" onClick={changeStatus}/>
        </div>
        <div className="manager-header">
            <div className="manager-left">大区</div>
        </div>
        <div className="manager-body">
            {group ? <div className="manager-card" draggable={true} onDragStart={event => event.dataTransfer.setData("text/plain", 'new class')}>新建大区</div> : null}
        </div>
    </div>;
};

export default PartitionManagerCard;
