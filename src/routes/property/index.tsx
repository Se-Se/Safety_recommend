import BreadcrumbPage from '@src/components/crumb';
import TableCommon from '@src/components/tableCommon';
import { propertyOption } from '@src/components/tableCommon/globalData';
import { DBTableName } from '@src/services';
import { filterTheTrade } from '@src/utils/util';
import { Button, Card, Cascader, Layout, message, SearchBox } from '@tencent/tea-component';
import React, { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { useIndexedDB } from 'react-indexed-db';
import AddModal from './components/addModal';

const { Body, Content } = Layout;

type PropertyType = {
  propertyId?: string;
  propertyName?: string;
  business?: string;
  businessKinds?: string;
  part?: string;
  propertyKind?: string;
  addMen?: string;
  createdAt?: string | number;
  editMen?: string;
  editedAt?: string | number;
  safetyTrade?: string;
};
const crumb = [
  { name: '银行', link: '/main' },
  { name: '行业资产', link: '/property' },
  { name: '网络资产', link: '/property' },
];

const PropertyPage: React.FC = () => {
  const [dataList, setDataList] = useState<PropertyType[]>();
  const [allList, setAllList] = useState<PropertyType[]>();
  const { getAll, deleteRecord } = useIndexedDB(DBTableName.property);
  const val = cookie.load('safetyTrade');
  const [trade, setTrade] = useState(val);

  const [inputOne, setInputOne] = useState('');
  const [inputTwo, setInputTwo] = useState('');
  const [inputThree, setInputThree] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [checkItem, setCheckItem] = useState([]);
  const [headerSelect, setHeaderSelect] = useState('all');

  // 修改gap表数据
  const handleGapTable = id => {
    const { deleteRecord } = useIndexedDB(DBTableName.gap);
    deleteRecord(id)
      .then(() => {})
      .catch(err => {
        message.error({ content: `失败${err}` });
      });
  };
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
    if (attr === 'inputOne') {
      setInputOne(value);
    }
    if (attr === 'inputTwo') {
      setInputTwo(value);
    }
    if (attr === 'inputThree') {
      setInputThree(value);
    }
  };
  // 筛选数据
  const filterDataList = (arr: any) => {
    if (!arr) {
      return [];
    }
    if (inputOne.trim() === '' && inputTwo.trim() === '' && inputThree.trim() === '' && headerSelect === 'all') {
      return arr;
    }
    let filterArr = [];
    let inputOneArr = filterItem(arr, 'propertyName', inputOne);
    let inputTwoArr = filterItem(arr, 'business', inputTwo);
    let inputThreeArr = filterItem(arr, 'part', inputThree);
    let headerSelectArr = filterItem(arr, 'propertyKind', headerSelect);
    arr.map(item => {
      if (
        inputOneArr.indexOf(item) > -1 &&
        inputTwoArr.indexOf(item) > -1 &&
        inputThreeArr.indexOf(item) > -1 &&
        headerSelectArr.indexOf(item) > -1
      ) {
        filterArr.push(item);
      }
    });
    return filterArr;
  };
  const filterItem = (arr, attr, value) => {
    if (!arr) {
      return [];
    }
    let newArr = [];
    if (value.trim() === '' || value.trim() === 'all') {
      newArr = [...arr];
    } else {
      arr.map(item => {
        if (item[attr] === value) {
          newArr.push(item);
        }
      });
    }
    return newArr;
  };
  // 资产类型选择
  const handleSelectChange = (v): void => {
    let str = v.join('/');
    setHeaderSelect(str);
  };

  useEffect(() => {
    let arr = filterDataList(allList);
    setDataList([...arr]);
  }, [inputOne, inputTwo, inputThree, headerSelect]);

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
            handleGapTable(item);
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
    recordKey: 'propertyId',
    columns: [
      'propertyId',
      'propertyName',
      'business',
      'businessKinds',
      'part',
      'propertyKind',
      'addMen',
      'createdAt',
      'editMen',
      'editedAt',
      'action',
    ],
    right: (
      <>
        <SearchBox
          className="margin-r-30"
          value={inputOne}
          onChange={value => {
            handleInputChange(value, 'inputOne');
          }}
          placeholder="请输入资产名称"
        />

        <SearchBox
          className="margin-r-30"
          value={inputTwo}
          onChange={value => {
            handleInputChange(value, 'inputTwo');
          }}
          placeholder="请输入所属业务"
        />

        <SearchBox
          className="margin-r-30"
          value={inputThree}
          onChange={value => {
            handleInputChange(value, 'inputThree');
          }}
          placeholder="请输入所属部门"
        />

        <Cascader
          clearable
          type="menu"
          data={propertyOption}
          multiple={false}
          onChange={value => {
            handleSelectChange(value);
          }}
        />
      </>
    ),
    left: (
      <>
        <Button type="primary" onClick={onAdd}>
          新增资产
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
                propertyOption={propertyOption}
                comName={'property'}
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

export default PropertyPage;
