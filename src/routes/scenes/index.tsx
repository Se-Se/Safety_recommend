import BreadcrumbPage from '@src/components/crumb';
import TableCommon from '@src/components/tableCommon';
import { DBTableName } from '@src/services';
import { filterTheTrade } from '@src/utils/util';
import { Button, Card, Layout, message } from '@tencent/tea-component';
import React, { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { useIndexedDB } from 'react-indexed-db';
import AddModal from './components/addModal';

const { Body, Content } = Layout;

type ScenesType = {
  scenesId?: string;
  sceneName?: string;
  strategy?: string;
  attackObject?: string;
  loseEffect?: string;
  safetyTrade?: string;
};
const crumb = [
  { name: '银行', link: '/main' },
  { name: '知识展示', link: '/scenes' },
  { name: '攻击场景', link: '/scenes' },
];

const ScenesPage: React.FC = () => {
  const [dataList, setDataList] = useState<ScenesType[]>();
  const { getAll, deleteRecord } = useIndexedDB(DBTableName.scenes);
  const val = cookie.load('safetyTrade');
  const [trade, setTrade] = useState(val);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [checkItem, setCheckItem] = useState([]);

  // 拉取数据
  const fetchList = () => {
    getAll()
      .then(data => {
        const arr = filterTheTrade(data, 'safetyTrade', trade);
        setDataList([...arr]);
      })
      .catch(() => {});
  };

  // 首次打开页面加载 第二个参数需要是空数组保证只加载一次
  useEffect(() => {
    fetchList();
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSave = () => {
    fetchList();
  };

  // 点击添加按钮
  const onAdd = () => {
    setIsEdit(false);
    setShowModal(true);
  };

  // 点击编辑按钮
  const handleEdit = data => {
    setModalData({ ...data });
    setIsEdit(true);
    setShowModal(true);
  };

  //表格checkbox被选中
  const handleSelectItems = data => {
    setCheckItem(data);
  };

  // 删除button
  const handleDelete = (): void => {
    if (checkItem.length) {
      checkItem.map((item, index) => {
        deleteRecord(item)
          .then(() => {
            if (index === checkItem.length - 1) {
              message.success({ content: '成功' });
              fetchList();
            }
          })
          .catch(err => {
            message.error({ content: `失败${err}` });
          });
      });
    }
  };
  // 查看攻击线路图
  const handleShow = data => {
    console.log('data', data);
  };
  const propsConfig = {
    list: dataList,
    recordKey: 'scenesId',
    columns: ['scenesId', 'sceneName', 'strategy', 'attackObject', 'loseEffect', 'show', 'action'],
    left: (
      <>
        <Button type="primary" onClick={onAdd}>
          新增攻击场景
        </Button>
        <Button type="weak" onClick={handleDelete}>
          删除
        </Button>
      </>
    ),
  };
  return (
    <Body>
      <Content>
        <Content.Header
          subtitle={
            <>
              <BreadcrumbPage crumbs={crumb} />
            </>
          }
        ></Content.Header>
        <Content.Body className="common-table-content">
          <Card>
            <Card.Body>
              <AddModal
                close={handleModalClose}
                isEdit={isEdit}
                save={handleSave}
                theData={modalData}
                allData={dataList}
                visible={showModal}
                comName={'scenes'}
                trade={trade}
              />
              <TableCommon
                {...propsConfig}
                onEdit={handleEdit}
                selectItems={handleSelectItems}
                show={handleShow}
              ></TableCommon>
            </Card.Body>
          </Card>
        </Content.Body>
      </Content>
    </Body>
  );
};

export default ScenesPage;
