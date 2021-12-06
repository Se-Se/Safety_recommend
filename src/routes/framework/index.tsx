import DashboardPage from '@src/components/dashboard';
import { DBTableName } from '@src/services';
import { Button, Layout } from '@tencent/tea-component';
import React, { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import BusinessCard from './business';
import "./index.less";
const { Body, Content } = Layout;

const FrameworkPage: React.FC = () => {
    const [dataSource, setDataSource] = useState<Array<{}>>([]);
    const [groupSource, setgroupSource] = useState<Array<{}>>([]);
    const [business, setBusiness] = useState<Array<string>>([]);
    const { getAll } = useIndexedDB(DBTableName.dashboard);
    const getData = useIndexedDB(DBTableName.data).getAll;
    const getSystem = useIndexedDB(DBTableName.app).getAll;
    const getProperty = useIndexedDB(DBTableName.property).getAll;
    const getGroup = useIndexedDB(DBTableName.group).getAll;

    // 首次打开页面加载 第二个参数需要是空数组保证只加载一次
    useEffect(() => {
        fetchData();
    }, []);

    // 拉取数据
    const fetchData = () => {
        Promise.all([getAll(), getData(), getSystem(), getProperty(), getGroup()]).then(([data, allData, systemData, propertyData, groupData]) => {
            for (let index = 0; index < data.length; index++) {
                const content = data[index] ? JSON.parse(data[index]['content']) : { title: '', data: [] };
                for (let idx = 0; idx < content['data'].length; idx++) {
                    const curData = content['data'][idx];
                    if (curData['type'] == 'system') {
                        content['data'][idx]['data'] = allData.filter(item => item['systemPart'] == curData['text']).map(item => item['dataName']);
                        const system = systemData.filter(item => item['systemName'] == curData['text']);
                        content['data'][idx]['class'] = system && system.length ? system[0]['systemKinds'] : '';
                    } else {
                        const property = propertyData.filter(item => item['propertyName'] == curData['text']);
                        content['data'][idx]['class'] = property && property.length ? property[0]['propertyKind'].split('/')[1] : '';
                    }
                }
                data[index]['content'] = content;
            }
            setDataSource(data);
            setgroupSource(groupData);
        }).catch(() => { });
    };

    return <Body>
        <Content>
            <Button type="primary" className="edit-btn" onClick={() => {
                top.location.href = '/edit'
            }}>编辑</Button>
            <Content.Header title="系统架构"></Content.Header>
            <div className="framework-content">
                <BusinessCard onChange={names => {
                    setBusiness(names);
                }} />
                <DashboardPage
                    edit={false}
                    group={false}
                    groupSource={groupSource}
                    dataSource={dataSource}
                    business={business}
                    onChange={() => { }}
                />
            </div>
        </Content>
    </Body>
};

export default FrameworkPage;
