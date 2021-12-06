
import cls from 'classnames';
import React from 'react';
import AreaCard from './area';
import GroupCard from './group';
import './index.less';

const DashboardPage: React.FC<{
    edit: boolean,
    group: boolean,
    dataSource: Array<{}>,
    groupSource: Array<{}>,
    onChange: (type, key, value) => void,
    business?: Array<string>,
}> = (props) => {
    // 计算宽度
    let width = window.innerWidth - 460;
    const cols = 1480;

    return (
        <div className={cls('dashboard-content', {edit: props.edit, group: props.group})} style={{width}}>
            <AreaCard edit={props.edit} width={width} cols={cols} dataSource={props.dataSource} onChange={props.onChange} business={props.business} />
            <GroupCard edit={props.edit} width={width} cols={cols} groupSource={props.groupSource} onChange={props.onChange} />
        </div>
    );
}

export default DashboardPage;
