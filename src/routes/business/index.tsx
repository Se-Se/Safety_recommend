import BreadcrumbPage from '@src/components/crumb';
import TableCommon from '@src/components/tableCommon';
import { DBTableName } from '@src/services';
import { filterTheTrade } from '@src/utils/util';
import { Button, Card, Layout, message, SearchBox } from '@tencent/tea-component';
import React, { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { useIndexedDB } from 'react-indexed-db';
import AddModal from './components/addModal';

const { Body, Content } = Layout;

type RecordType = {
  businessId?: string;
  businessName?: string;
  part?: string;
  businessKinds?: string;
  addMen?: string;
  createdAt?: string | number;
  editMen?: string;
  editedAt?: string | number;
  businessPic?: string;
  safetyTrade?: string;
};
const crumb = [
  { name: '银行', link: '/main' },
  { name: '行业资产', link: '/business' },
  { name: '重要业务', link: '/business' },
];
const BusinessPage: React.FC = () => {
  const [dataList, setDataList] = useState<RecordType[]>();
  const [allList, setAllList] = useState<RecordType[]>();
  const { getAll, deleteRecord } = useIndexedDB(DBTableName.business);
  const val = cookie.load('safetyTrade');
  const [trade, setTrade] = useState(val);

  const [businessN, setBusinessN] = useState('');
  const [selectPart, setSelectPart] = useState('');
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
        setAllList([...arr]);
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
  // 搜索框搜索
  const handleInputChange = (value, attr) => {
    if (attr === 'businessN') {
      setBusinessN(value);
    }
    if (attr === 'selectPart') {
      setSelectPart(value);
    }
  };

  const filterDataList = (arr: any) => {
    if (!arr) {
      return [];
    }
    if (businessN.trim() === '' && selectPart.trim() === '') {
      return arr;
    }
    let filterArr = [];
    if (businessN.trim() === '' && selectPart.trim() !== '') {
      arr.map((item: any) => {
        if (item.part === selectPart) {
          filterArr.push(item);
        }
      });
      return filterArr;
    }

    if (businessN.trim() !== '' && selectPart.trim() === '') {
      arr.map((item: any) => {
        if (item.businessName === businessN) {
          filterArr.push(item);
        }
      });
      return filterArr;
    }
    if (businessN.trim() !== '' && selectPart.trim() !== '') {
      arr.map((item: any) => {
        if (item.businessName === businessN && item.part === selectPart) {
          filterArr.push(item);
        }
      });
      return filterArr;
    }
  };

  useEffect(() => {
    let arr = filterDataList(allList);
    setDataList([...arr]);
  }, [businessN, selectPart]);
  //表格checkbox被选中
  const handleSelectItems = data => {
    setCheckItem(data);
  };
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
  const handleShowPic = (data): void => {
    setModalData(data);
  };

  const propsConfig = {
    list: dataList,
    recordKey: 'businessId',
    columns: [
      'businessId',
      'businessName',
      'part',
      'businessKinds',
      'addMen',
      'createdAt',
      'editMen',
      'editedAt',
      'businessPic',
      'action',
    ],
    right: (
      <>
        <SearchBox
          className="margin-r-30"
          value={businessN}
          onChange={value => {
            handleInputChange(value, 'businessN');
          }}
          placeholder="业务名称进行搜索"
        />

        <SearchBox
          value={selectPart}
          onChange={value => {
            handleInputChange(value, 'selectPart');
          }}
          placeholder="请输入所属部门"
        />
      </>
    ),
    left: (
      <>
        <Button type="primary" onClick={onAdd}>
          新增业务
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
                allData={allList}
                visible={showModal}
                trade={trade}
              />
              <TableCommon
                {...propsConfig}
                showPic={handleShowPic}
                onEdit={handleEdit}
                selectItems={handleSelectItems}
              ></TableCommon>
            </Card.Body>
          </Card>
        </Content.Body>
      </Content>
    </Body>
  );
};

export default BusinessPage;
