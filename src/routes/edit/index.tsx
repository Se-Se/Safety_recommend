import DashboardPage from '@src/components/dashboard';
import { DBTableName } from '@src/services';
import { randomString } from '@src/utils/util';
import { Button, Icon, Layout, message } from '@tencent/tea-component';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import EditCard from './edit';
import './index.less';
import PartitionManagerCard from './partition';
const { Body, Content } = Layout;

const EditPage: React.FC = () => {
    const [dataSource, setDataSource] = useState<Array<{}>>([]);
    const [groupSource, setGroupSource] = useState<Array<{}>>([]);
    const [select, setSelect] = useState<number>(-1);
    const [group, setGroup] = useState<boolean>(false);
    const dashboardDB = useIndexedDB(DBTableName.dashboard);
    const { getByIndex } = useIndexedDB(DBTableName.area);
    const groupDB = useIndexedDB(DBTableName.group);

    // 首次打开页面加载 第二个参数需要是空数组保证只加载一次
    useEffect(() => {
        fetchData();
    }, []);

    // 拉取数据
    const fetchData = () => {
        Promise.all([dashboardDB.getAll(), groupDB.getAll()]).then(([data, groups]) => {
            for (let index = 0; index < data.length; index++) {
                if (data[index] && data[index] != "undefined") {
                    data[index]['content'] = JSON.parse(data[index]['content']);
                } else {
                    data[index]['content'] = { title: '', data: [] };
                }
            }
            setDataSource(data);
            setGroupSource(groups);
        }).catch(() => { });
    };

    // 保存数据
    const onSave = () => {
        const promiseList = [];
        promiseList.push(groupDB.clear());
        for (let index = 0; index < groupSource.length; index++) {
            promiseList.push(groupDB.add(groupSource[index]));
        }
        promiseList.push(dashboardDB.clear());
        for (let index = 0; index < dataSource.length; index++) {
            const rowData = cloneDeep(dataSource[index]);
            rowData['content'] = JSON.stringify(dataSource[index]['content']);
            promiseList.push(dashboardDB.add(rowData));
        }
        Promise.all(promiseList).then(() => {
            message.success({ content: '保存成功' });
            window.location.href = '/framework';
        }).catch(err => {
            message.error({ content: `保存失败${err}` });
        });
    }

    // 卡片编辑
    const onEditChange = (index, value) => {
        if (index < 0) {    // group
            groupSource[select]['title'] = value;
            setGroupSource((cloneDeep(groupSource)));
        } else {    // part
            dataSource[select]['content']['data'][index]['select'] = value;
            setDataSource((cloneDeep(dataSource)));
        }
    }

    // 对数据进行处理
    const dataProcessing = (key, value, data) => {
        if (key == 'add') {
            data.push(value);
        } else if (key == 'delete') {
            data.splice(value, 1);
        } else if (key == 'layout') {
            data = value;
        }
        return data;
    }

    // 分区编辑
    const partitionEdit = (index) => {
        const content = dataSource[index]['content'];
        getByIndex('areaId', content['id']).then(part => {
            const systems = part['belongSystem'].map(sys => { return { text: sys, type: 'system' } });
            const properties = part['belongProperty'].map(sys => { return { text: sys, type: 'property' } });
            const subData = systems.concat(properties);
            const texts = content['data'].map(item => item['text']);
            const newData = [];
            for (let i = 0; i < subData.length; i++) {
                const curData = subData[i]
                const index = texts.indexOf(curData.text);
                if (index > -1) {
                    curData['select'] = content['data'][index]['select'];
                    curData['key'] = content['data'][index]['select'];
                } else {
                    curData['select'] = false;
                    curData['key'] = randomString(6)
                }
                newData.push(curData);
            }
            content['data'] = newData;
            dataSource[index]['content'] = content;
            setSelect(index);
        }).catch(() => { })
    }

    const onComponentChange = (type, key, value) => {
        // 编辑单独处理
        if (key == 'edit') {
            if (type == 'group') {
                setSelect(value);
            } else {
                partitionEdit(value);
            }
        }
        // 根据类型修改数据渲染
        else {
            if (type == 'group') {
                const groups = dataProcessing(key, value, groupSource);
                setGroupSource(cloneDeep(groups));
            } else {
                const datas = dataProcessing(key, value, dataSource);
                setDataSource(cloneDeep(datas));
            }
        }
    }

    const groupChange = gp => {
        setGroup(gp);
        setSelect(-1);
    }

    return (<Body>
        <Content>
            <div className="edit-btn">
                <Button type="primary" className="save-btn" onClick={onSave}>保存</Button>
            </div>
            <Content.Header className="edit-header">
                <Icon type="btnback" className="back-btn" onClick={() => {
                    window.location.href = '/framework';
                }} />
                <h2 className="tea-h2 edit-h2">系统框架 / 编辑系统框架</h2>
            </Content.Header>
            <div className="edit-content">
                <PartitionManagerCard onGroup={gp => groupChange(gp)} />
                {
                    select > -1 ? <EditCard group={group} data={group ? groupSource[select] : dataSource[select]['content']} onChange={onEditChange} /> : null
                }
                <DashboardPage edit={true} group={group} dataSource={dataSource} groupSource={groupSource} onChange={onComponentChange} />
            </div>
        </Content>
    </Body>);
};

export default EditPage;
