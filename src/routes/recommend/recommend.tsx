import { DBTableName } from '@src/services';
import { filterTheTrade } from '@src/utils/util';
import { useHistory } from '@tea/app';
import { Button, Col, Layout, Row } from '@tencent/tea-component';
import React, { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { useIndexedDB } from 'react-indexed-db';
import RecommendItem from './components/recommendItem';
const { Body, Content } = Layout;

type RecommendType = {
  recommendId?: string;
  theArea?: string;
  category?: string;
  dangerLevel?: string;
  theBusiness?: string;
  theSystem?: string;
  theData?: string;
  theProperty?: string;
  theTitle?: string;
  editHtml?: string;
  safetyTrade?: string;
  createdAt?: string | number;
};
const RecommendsPage: React.FC = () => {
  const [dataList, setDataList] = useState([]);
  const val = cookie.load('safetyTrade');
  const [trade, setTrade] = useState(val);

  const { getAll } = useIndexedDB(DBTableName.recommend);
  const history = useHistory();

  // 拉取数据
  const fetchList = () => {
    getAll()
      .then(data => {
        const arr = filterTheTrade(data, 'safetyTrade', trade);
        let newArr = formatterData(arr);
        setDataList([...newArr]);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchList();
  }, []);

  const formatterData = (data: any) => {
    if (!data) {
      return;
    }
    let areaArr = [];
    data.map(item => {
      if (areaArr.indexOf(item.areaName) < 0) {
        areaArr.push(item.areaName);
      }
    });
    let newArr = [];
    areaArr.map(item => {
      let obj: any = {};
      obj.theArea = item;

      let categorys = [];
      data.map(dItem => {
        if (dItem.areaName === item) {
          if (categorys.indexOf(dItem.category) < 0) {
            categorys.push(dItem.category);
          }
        }
      });
      let recommends = [];
      categorys.map(cItem => {
        let cObj: any = {};
        cObj.category = cItem;
        let arr = [];
        data.map(dItem => {
          if (dItem.areaName === item && dItem.category === cItem) {
            arr.push(dItem);
          }
        });
        cObj.recommends = [...arr];
        recommends.push({ ...cObj });
      });
      obj.categorys = [...recommends];
      newArr.push({ ...obj });
    });
    console.log('newArr', newArr);
    return newArr;
  };

  const onAdd = () => {
    console.log(history);
    history.push('/recommend/add');
  };
  return (
    <Body>
      <Content>
        <Content.Header title="改进建议"></Content.Header>
        <Content.Body className="recommend-content-body">
          <Button type="primary" style={{ marginBottom: '10px', width: '112px' }} onClick={onAdd}>
            新增改进建议
          </Button>

          <Row className="recommend-wrap">
            {(dataList || []).map((item: any, index: any) => {
              return (
                <div key={index} className="recommend-area-wrap">
                  <Col span={24}>
                    <RecommendItem theData={item} />
                  </Col>
                </div>
              );
            })}
          </Row>
        </Content.Body>
        <Content.Footer></Content.Footer>
      </Content>
    </Body>
  );
};

export default RecommendsPage;
