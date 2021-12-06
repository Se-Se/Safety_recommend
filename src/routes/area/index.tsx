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

type FrameType = {
  id?: number;
  areaId?: string;
  areaName?: string;
  belongSystem?: string;
  belongProperty?: string;
  systemAndProperty?: string;
  addMen?: string;
  createdAt?: string | number;
  editMen?: string;
  editedAt?: string | number;
  safetyTrade?: string;
};
const crumb = [
  { name: '银行', link: '/main' },
  { name: '行业资产', link: '/business' },
  { name: '分区管理', link: '/area' },
];

const AreaPage: React.FC = () => {
  const [dataList, setDataList] = useState<FrameType[]>();
  const { getAll, deleteRecord } = useIndexedDB(DBTableName.area);
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
    // setTradeData(null);
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

  const propsConfig = {
    list: dataList,
    recordKey: 'areaId',
    columns: ['areaId', 'areaName', 'systemAndProperty', 'addMen', 'createdAt', 'editMen', 'editedAt', 'action'],
    left: (
      <>
        <Button type="primary" onClick={onAdd}>
          新增分区
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
                trade={trade}
              />
              <TableCommon {...propsConfig} onEdit={handleEdit} selectItems={handleSelectItems}></TableCommon>
            </Card.Body>
          </Card>
        </Content.Body>
      </Content>
    </Body>
  );
};

export default AreaPage;
