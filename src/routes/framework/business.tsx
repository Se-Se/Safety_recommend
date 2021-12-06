import { DBTableName } from '@src/services';
import cls from 'classnames';
import React, { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import './business.less';

const BusinessCard: React.FC<{
    onChange: (names) => void
}> = (props) => {
    const [dataList, setDataList] = useState<Array<{}>>([]);
    const { getAll } = useIndexedDB(DBTableName.business);
    const getApp = useIndexedDB(DBTableName.app).getAll;
    const getProperty = useIndexedDB(DBTableName.property).getAll;
    const [select, setSelect] = useState<number>(-1);

    useEffect(() => {
        getAll().then(data => {
            setDataList(data);
        }).catch(() => {});
    }, [])

    const selectBusiness = (index) => {
        const name = dataList[index]['businessName'];
        const promises = [getApp(), getProperty()];
        Promise.all(promises).then(values => {
            const systems = values[0].filter(item => item['business'] == name);
            const properties = values[1].filter(item => item['business'] == name);
            const result = systems.map(item => item['systemName']).concat(properties.map(item => item['propertyName']));
            props.onChange(result);
        })
        setSelect(index);
    }


    return <div className="business-select">
        {
            dataList.map((item, index) => {
                return <div key={index} className={cls("business-name", {select: select == index})} onClick={() => selectBusiness(index)}>{item['businessName']}</div>
            })
        }
    </div>;
};

export default BusinessCard;
