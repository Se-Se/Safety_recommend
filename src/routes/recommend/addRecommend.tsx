import { areaOptions, levelOptions } from '@src/components/tableCommon/globalData';
import { DBTableName } from '@src/services';
import { filterTheTrade } from '@src/utils/util';
import { useHistory } from '@tea/app';
import { Button, Card, Form, Input, Justify, Layout, message, Select, Table } from '@tencent/tea-component';
import React, { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { useIndexedDB } from 'react-indexed-db';
import EditorBraft from './components/braft';

const { Body, Content } = Layout;

type RecommendType = {
  recommendId?: string;
  theArea?: string;
  areaName?: string;
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

const AddRecommendPage: React.FC = () => {
  const { getByIndex } = useIndexedDB(DBTableName.recommend);
  const [isAdd, setIsAdd] = useState(true);
  const [canEdit, setCanEdit] = useState(false);

  const [category, setCategory] = useState('');
  const [dangerLevel, setDangerLevel] = useState('');
  const val = cookie.load('safetyTrade');
  const [trade, setTrade] = useState(val);

  const [theTitle, setTheTitle] = useState('');
  const [theRecommendId, setTheRecommendId] = useState('');
  const [theArea, setTheArea] = useState('');
  const [theBusiness, setTheBusiness] = useState('');
  const [businessOptions, setBusinessOptions] = useState([]);
  const [theSystem, setTheSystem] = useState('');
  const [systemOptions, setSystemOptions] = useState([]);
  const [theData, setTheData] = useState('');
  const [dataOptions, setDataOptions] = useState([]);
  const [theProperty, setTheProperty] = useState('');
  const [propertyOptions, setPropertyOptions] = useState([]);

  const [doSave, setDoSave] = useState(false);

  const editBaseData =
    '<p><strong>背景：</strong></p><p></p><p></p><p></p><p></p><p><strong>过程描述：</strong></p><p></p><p></p><p></p><p></p><p></p><p><strong>改进建议：</strong></p><p></p><p></p><p></p><p></p><p></p><p></p>';
  const [editData, setEditData] = useState(editBaseData);

  const history = useHistory();

  // 获取数据
  const getAreaData = (target, idV, nameV, setOptions) => {
    const { getAll } = useIndexedDB(DBTableName[target]);
    getAll()
      .then(data => {
        const arr = filterTheTrade(data, 'safetyTrade', trade);
        const options = [];
        if (arr) {
          arr.map(item => {
            const obj: any = {};
            obj.value = item[idV];
            obj.text = item[nameV];
            options.push(obj);
          });
          setOptions(options);
        }
      })
      .catch(err => {
        message.error({ content: `失败${err}` });
      });
  };

  // 首次打开页面加载 第二个参数需要是空数组保证只加载一次
  useEffect(() => {
    if (history.location.pathname === '/recommend/add') {
      setIsAdd(true);
      setCanEdit(true);
    } else {
      setCanEdit(false);
      const theId = history.location.pathname.substring(11).trim().toString();
      setTheRecommendId(theId);

      getByIndex('recommendId', theId).then(res => {
        initData(res);
      });
      setIsAdd(false);
    }
    getAreaData('business', 'businessId', 'businessName', setBusinessOptions);
    getAreaData('app', 'systemId', 'systemName', setSystemOptions);
    getAreaData('data', 'dataId', 'dataName', setDataOptions);
    getAreaData('property', 'propertyId', 'propertyName', setPropertyOptions);
  }, []);

  const initData = (data: any) => {
    setTheArea(data.theArea);
    setCategory(data.category);
    setDangerLevel(data.dangerLevel);
    setTheBusiness(data.theBusiness);
    setTheSystem(data.theSystem);
    setTheData(data.theData);
    setTheProperty(data.theProperty);
    setTheTitle(data.theTitle);
    setEditData(data.editHtml);
    setDoSave(false);
  };

  // 获取select选择的名称
  const getAreaName = () => {
    let name = '';
    areaOptions.map(item => {
      if (item.value === theArea) {
        name = item.text;
      }
    });
    return name;
  };
  // select 选择
  const handleSelect = (v: any, setAttr: any) => {
    setAttr(v);
  };

  // 返回按钮
  const goback = () => {
    history.push('/recommend');
  };

  // 提交验证
  const checkSave = () => {
    if (theArea.trim() === '') {
      return false;
    } else if (category.trim() === '') {
      return false;
    } else if (dangerLevel.trim() === '') {
      return false;
    } else if (theBusiness.trim() === '') {
      return false;
    } else if (theSystem.trim() === '') {
      return false;
    } else if (theData.trim() === '') {
      return false;
    } else if (theProperty.trim() === '') {
      return false;
    } else if (theTitle.trim() === '') {
      return false;
    }
    return true;
  };

  // 点击保存按钮
  const save = () => {
    setDoSave(true);
    if (!checkSave()) {
      return;
    }
    const { add, update } = useIndexedDB(DBTableName.recommend);
    const request: RecommendType = {
      recommendId: 'recommend_id' + new Date().getTime(),
      theArea: theArea,
      areaName: getAreaName(),
      category: category.trim(),
      dangerLevel: dangerLevel,
      theBusiness: theBusiness,
      theSystem: theSystem,
      theData: theData,
      theProperty: theProperty,
      theTitle: theTitle.trim(),
      editHtml: editData,
      safetyTrade: trade,
      createdAt: +new Date(),
    };
    if (isAdd) {
      add<RecommendType>(request)
        .then(() => {
          message.success({ content: '成功' });
          history.push('/recommend');
        })
        .catch(err => {
          message.error({ content: `失败${err}` });
        });
    } else {
      request.recommendId = theRecommendId;
      update<RecommendType>(request)
        .then(() => {
          message.success({ content: '成功' });
        })
        .catch(err => {
          message.error({ content: `失败${err}` });
        });
    }
  };

  // 点击编辑按钮
  const edit = () => {
    setCanEdit(true);
  };

  // 文本编辑器 cirl + s 保存的回调
  const handleEditSave = (data: any) => {
    setEditData(data);
  };
  return (
    <Layout>
      <Body>
        <Content>
          <Content.Header title="改进建议"></Content.Header>
          <Content.Body className="common-table-content">
            <Table.ActionPanel>
              <Justify
                left={
                  <>
                    <Button className="margin-r-30" type="primary" onClick={goback}>
                      返回
                    </Button>
                    <Button type="primary" onClick={save}>
                      保存
                    </Button>
                  </>
                }
                right={
                  isAdd ? null : (
                    <Button type="primary" onClick={edit}>
                      编辑
                    </Button>
                  )
                }
              />
            </Table.ActionPanel>
            <Card>
              <Card.Body>
                <Form layout="inline" className="add-recommend">
                  <Form.Item
                    label="所属分区"
                    message={doSave ? (theArea ? null : '请选择所属分区') : null}
                    status={doSave ? (theArea ? null : 'error') : null}
                  >
                    <Select
                      disabled={!canEdit}
                      appearance="button"
                      options={areaOptions}
                      value={theArea}
                      onChange={value => handleSelect(value, setTheArea)}
                      placeholder="请选择所属分区"
                      size="m"
                    />
                  </Form.Item>
                  <Form.Item
                    label="所属分类"
                    message={doSave ? (category ? null : '请输入所属分类') : null}
                    status={doSave ? (category ? null : 'error') : null}
                  >
                    <Input
                      disabled={!canEdit}
                      size="m"
                      value={category}
                      onChange={value => {
                        setCategory(value);
                      }}
                      placeholder="请输入所属分类"
                    />
                  </Form.Item>
                  <Form.Item
                    label="风险级别"
                    message={doSave ? (dangerLevel ? null : '请选择风险级别') : null}
                    status={doSave ? (dangerLevel ? null : 'error') : null}
                  >
                    <Select
                      disabled={!canEdit}
                      appearance="button"
                      options={levelOptions}
                      value={dangerLevel}
                      onChange={value => handleSelect(value, setDangerLevel)}
                      placeholder="请选择风险级别"
                      size="m"
                    />
                  </Form.Item>
                  <Form.Item
                    label="相关业务"
                    message={doSave ? (theBusiness ? null : '请选择相关业务') : null}
                    status={doSave ? (theBusiness ? null : 'error') : null}
                  >
                    <Select
                      disabled={!canEdit}
                      appearance="button"
                      options={businessOptions}
                      value={theBusiness}
                      onChange={value => handleSelect(value, setTheBusiness)}
                      placeholder="请选择相关业务"
                      size="m"
                    />
                  </Form.Item>
                  <Form.Item
                    label="相关系统"
                    message={doSave ? (theSystem ? null : '请选择相关系统') : null}
                    status={doSave ? (theSystem ? null : 'error') : null}
                  >
                    <Select
                      disabled={!canEdit}
                      appearance="button"
                      options={systemOptions}
                      value={theSystem}
                      onChange={value => handleSelect(value, setTheSystem)}
                      placeholder="请选择相关系统"
                      size="m"
                    />
                  </Form.Item>
                  <Form.Item
                    label="相关数据"
                    message={doSave ? (theData ? null : '请选择相关数据') : null}
                    status={doSave ? (theData ? null : 'error') : null}
                  >
                    <Select
                      disabled={!canEdit}
                      appearance="button"
                      options={dataOptions}
                      value={theData}
                      onChange={value => handleSelect(value, setTheData)}
                      placeholder="请选择相关数据"
                      size="m"
                    />
                  </Form.Item>
                  <Form.Item
                    label="相关资产"
                    message={doSave ? (theProperty ? null : '请选择相关资产') : null}
                    status={doSave ? (theProperty ? null : 'error') : null}
                  >
                    <Select
                      disabled={!canEdit}
                      appearance="button"
                      options={propertyOptions}
                      value={theProperty}
                      onChange={value => handleSelect(value, setTheProperty)}
                      placeholder="请选择相关资产"
                      size="m"
                    />
                  </Form.Item>
                </Form>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header></Card.Header>
              <Card.Body title="请输入标题">
                <Form className="add-remcommend-title">
                  <Form.Item
                    message={doSave ? (theTitle ? null : '请输入标题') : null}
                    status={doSave ? (theTitle ? null : 'error') : null}
                  >
                    <Input
                      size="l"
                      disabled={!canEdit}
                      value={theTitle}
                      onChange={value => {
                        setTheTitle(value);
                      }}
                      placeholder="请输入标题"
                    />
                  </Form.Item>
                </Form>
              </Card.Body>
              <EditorBraft isEdit={!canEdit} editData={editData} saveEdit={handleEditSave} />
            </Card>
          </Content.Body>
        </Content>
      </Body>
    </Layout>
  );
};

export default AddRecommendPage;
