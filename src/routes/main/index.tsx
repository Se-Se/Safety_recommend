import MainModal from '@src/routes/main/components/addModal';
import { DBTableName } from '@src/services';
import { initDbData } from '@src/services/initdbData';
import { useHistory } from '@tea/app';
import { Button, Card, Col, Layout, Row } from '@tencent/tea-component';
import React, { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { useIndexedDB } from 'react-indexed-db';
import ManiItem from './components/mainItem';

const { Body, Content } = Layout;

type RecordType = {
  id?: number;
  tradeN?: string;
  description?: string;
  createdAt?: string | number;
};

const MainPage: React.FC = () => {
  const { getAll } = useIndexedDB(DBTableName.trade);
  const [showModal, setShowModal] = useState(false);
  const [dataList, setDataList] = useState<RecordType[]>();
  const [tradeData, setTradeData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const history = useHistory();

  const checkFirstLoad = () => {
    const val = cookie.load('isFirstLoad');
    if (val) {
      return;
    }
    cookie.save('isFirstLoad', 'already');
    const p1 = initTheDbFn(initDbData, 'trade');
    const p2 = initTheDbFn(initDbData, 'business');
    const p3 = initTheDbFn(initDbData, 'app');
    const p4 = initTheDbFn(initDbData, 'data');
    const p5 = initTheDbFn(initDbData, 'property');
    const p6 = initTheDbFn(initDbData, 'area');
    const p7 = initTheDbFn(initDbData, 'scenes');
    const p8 = initTheDbFn(initDbData, 'gap');
    const p9 = initTheDbFn(initDbData, 'recommend');
    const p10 = initTheDbFn(initDbData, 'gapOptions');
    Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10]).then(() => {
      location.reload();
    });
  };

  const initTheDbFn = (data: any, attr: string) => {
    return new Promise((resolve, reject) => {
      const { add, clear } = useIndexedDB(DBTableName[attr]);
      if (!data[attr]) {
        return;
      }
      clear();
      data[attr].map((item: any, index: any) => {
        add(item)
          .then(res => {
            if (index + 1 === data[attr].length) {
              resolve(res);
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    });
  };
  // 拉取数据
  const fetchList = () => {
    getAll()
      .then(data => {
        setDataList(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchList();
    checkFirstLoad();
  }, []);

  const onAdd = () => {
    setIsEdit(false);
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
    setTradeData(null);
  };
  const handleSave = () => {
    fetchList();
  };
  const handleEdit = (data: any) => {
    setTradeData(data);
    setShowModal(true);
    setIsEdit(true);
  };
  const choseTrade = (ev: any, item: any) => {
    cookie.save('safetyTrade', item.tradeN.trim());
    history.push('/business');
  };
  return (
    <Body>
      <Content>
        <Content.Header title="请选择相关行业"></Content.Header>
        <Content.Body className="main-content-body">
          <Button type="primary" onClick={onAdd}>
            新增行业
          </Button>
          <MainModal
            close={handleModalClose}
            isEdit={isEdit}
            save={handleSave}
            theTrade={tradeData}
            allData={dataList}
            visible={showModal}
          />
          <Card>
            <Card.Body className="main-card-body">
              <Row>
                {(dataList || []).map((item: any, index: any) => {
                  return (
                    <div
                      key={index}
                      onClick={ev => {
                        choseTrade(ev, item);
                      }}
                    >
                      <Col span={6}>
                        <ManiItem
                          tradeN={item.tradeN}
                          description={item.description}
                          edit={() => {
                            handleEdit(item);
                          }}
                        />
                      </Col>
                    </div>
                  );
                })}
              </Row>
            </Card.Body>
          </Card>
        </Content.Body>
        <Content.Footer></Content.Footer>
      </Content>
    </Body>
  );
};
export default MainPage;
