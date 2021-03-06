import { DBTableName } from '@src/services';
import { filterTheTrade } from '@src/utils/util';
import { Button, Cascader, Form, Input, message, Modal, Select } from '@tencent/tea-component';
import React, { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db';

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
  theBusinessId?: string;
};
type Business = {
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
type GapType = {
  gapId?: string;
  propertyOrSystem?: string;
  business?: string;
  businessKinds?: string;
  part?: string;
  categorys?: string;
  theType?: string;
  editMen?: string;
  addMen?: string;
  editedAt?: string | number;
  actType?: string;
  actName?: string;
  theBug?: string;
  bugName?: string;
  action?: string;
  actionName?: string;
  against?: string;
  againstName?: string;
  safetyTrade?: string;
  theBusinessId?: string;
};

export default function AddModal(props) {
  const { add, update } = useIndexedDB(DBTableName[props.comName]);
  const { getAll } = useIndexedDB(DBTableName.business);
  const [tableData, setTableData] = useState<Business[]>();

  const [theName, setTheName] = useState('');
  const [belongSelect, setBelongSelect] = useState('');
  const [belongFieldA, setBelongFieldA] = useState('');
  const [belongFieldB, setBelongFieldB] = useState('');
  const [kindOption, setKindOption] = useState('');
  const [belongOption, setBelongOption] = useState([]);
  const [cascaderProperty, setCascaderProperty] = useState([]);
  const [theBusinessId, setTheBusinessId] = useState('');
  const [doSave, setDoSave] = useState(false);
  const [preName, setPreName] = useState('');

  // ??????gap?????????
  const handleGapTable = (type, data) => {
    const { add, update } = useIndexedDB(DBTableName.gap);
    let request: GapType = {
      gapId: data.propertyId,
      propertyOrSystem: data.propertyName,
      business: data.business,
      businessKinds: data.businessKinds,
      part: data.part,
      categorys: 'property',
      theType: data.propertyKind,
      addMen: data.addMen,
      editedAt: data.createdAt,
      actType: '',
      theBug: '',
      safetyTrade: data.safetyTrade,
      theBusinessId: data.theBusinessId,
    };
    if (type === 'add') {
      add<GapType>(request)
        .then(() => {
          message.success({ content: '??????' });
        })
        .catch(err => {
          message.error({ content: `??????${err}` });
        });
    } else if (type === 'update') {
      request.editedAt = data.editedAt;
      update<GapType>(request)
        .then(() => {
          message.success({ content: '??????' });
        })
        .catch(err => {
          message.error({ content: `??????${err}` });
        });
    }
  };
  // ????????????
  const fetchList = () => {
    getAll()
      .then(data => {
        const arr = filterTheTrade(data, 'safetyTrade', props.trade);
        getSelecOptions([...arr]);
        setTableData([...arr]);
      })
      .catch(() => {});
  };
  // ????????????????????????
  useEffect(() => {
    if (props.visible) {
      fetchList();
    }
  }, [props.visible]);
  const getSelecOptions = data => {
    if (!data) {
      return;
    }

    const theNameArr = [];
    data.map(item => {
      const obj: any = {};
      obj.value = item.businessName;
      obj.text = item.businessName;
      theNameArr.push(obj);
    });

    setBelongOption([...theNameArr]);
  };

  // select change ??????
  const handleSelectChange = (v, attr) => {
    if (attr === 'belongSelect') {
      setBelongSelect(v);
      tableData.map(item => {
        if (item.businessName === v) {
          setBelongFieldA(item.businessKinds);
          setBelongFieldB(item.part);
        }
      });
    }
    if (attr === 'kindOption') {
      setKindOption(v);
    }
  };
  // ??????????????????
  const handleCascaderChange = (v): void => {
    setCascaderProperty(v);
  };
  const init = () => {
    setTheName('');
    setBelongSelect('');
    setBelongFieldA('');
    setBelongFieldB('');
    setKindOption('');
    setCascaderProperty([]);
    setTheBusinessId('');
    setDoSave(false);
    setPreName('');
  };
  const close = () => {
    props.close();
    init();
  };
  // ????????????
  const nameMessage = (attV, errMes, existMes): any => {
    if (doSave) {
      if (attV.trim() && checkSave()) {
        return null;
      } else {
        if (!attV.trim()) {
          return errMes;
        } else if (!checkSave()) {
          return existMes;
        }
      }
    } else {
      return null;
    }
    return '';
  };

  // ?????????????????????????????????
  const checkSave = () => {
    if (props.allData) {
      let arr = [];
      props.allData.map(item => {
        arr.push(item.propertyName);
      });
      if (arr.indexOf(theName.trim()) > -1 && !props.isEdit) {
        return false;
      }
      if (arr.indexOf(theName.trim()) > -1 && props.isEdit && theName !== preName) {
        return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    setDoSave(true);
    if (theName.trim() === '') {
      return false;
    }
    if (belongSelect.trim() === '') {
      return false;
    }
    if (props.comName === 'property' && cascaderProperty.join('/').trim() === '') {
      return false;
    }
    if (kindOption.trim() === '' && props.comName !== 'property') {
      return false;
    }
    if (!checkSave()) {
      return;
    }
    if (props.isEdit) {
      let request = {
        ...props.theData,
        propertyName: theName.trim(),
        business: belongSelect.trim(),
        businessKinds: belongFieldA.trim(),
        part: belongFieldB.trim(),
        propertyKind: cascaderProperty.join('/').trim(),
        editMen: 'shanehwang',
        editedAt: +new Date(),
      };

      update<PropertyType>(request)
        .then(() => {
          handleGapTable('update', request);
          props.close();
          props.save();
          init();
        })
        .catch(err => {
          message.error({ content: `??????${err}` });
        });
    } else {
      let request = {
        propertyId: 'property_id' + new Date().getTime(),
        propertyName: theName.trim(),
        business: belongSelect.trim(),
        businessKinds: belongFieldA.trim(),
        part: belongFieldB.trim(),
        propertyKind: cascaderProperty.join('/').trim(),
        addMen: 'shanehwang',
        createdAt: +new Date(),
        safetyTrade: props.trade,
        theBusinessId: theBusinessId,
      };

      add<PropertyType>(request)
        .then(() => {
          handleGapTable('add', request);
          props.close();
          props.save();
          init();
        })
        .catch(err => {
          message.error({ content: `??????${err}` });
        });
    }
  };
  useEffect(() => {
    if (props.theData && props.isEdit) {
      setTheName(props.theData.propertyName);
      setBelongSelect(props.theData.business);
      setBelongFieldA(props.theData.businessKinds);
      setBelongFieldB(props.theData.part);
      setCascaderProperty(props.theData.propertyKind.split('/'));
      setTheBusinessId(props.theData.theBusinessId);
      setPreName(props.theData.propertyName);
    }
  }, [props.theData]);
  const templageFn = () => {
    return (
      <>
        <Form>
          <Form.Item
            label="????????????"
            message={nameMessage(theName, '?????????????????????', '?????????????????????')}
            status={doSave ? (theName.trim() && checkSave() ? null : 'error') : null}
          >
            <Input
              size="m"
              value={theName}
              onChange={(value, context) => {
                setTheName(value);
              }}
              placeholder="?????????????????????"
            />
          </Form.Item>
          <Form.Item
            label="????????????"
            message={doSave ? (belongSelect ? null : '?????????????????????') : null}
            status={doSave ? (belongSelect ? null : 'error') : null}
          >
            <Select
              value={belongSelect}
              clearable
              matchButtonWidth
              appearance="button"
              placeholder="?????????????????????"
              options={belongOption}
              onChange={value => {
                handleSelectChange(value, 'belongSelect');
              }}
              size="m"
            />
          </Form.Item>
          <Form.Item
            label="????????????"
            message={doSave ? (cascaderProperty.length !== 0 ? null : '?????????????????????') : null}
            status={doSave ? (cascaderProperty.length !== 0 ? null : 'error') : null}
          >
            <Cascader
              value={cascaderProperty}
              clearable
              type="menu"
              placeholder="?????????????????????"
              data={props.propertyOption}
              multiple={false}
              onChange={value => {
                handleCascaderChange(value);
              }}
            />
          </Form.Item>
        </Form>
      </>
    );
  };

  return (
    <>
      <Modal
        maskClosable
        visible={props.visible}
        caption={props.isEdit ? '????????????' : '????????????'}
        size="m"
        disableCloseIcon={true}
        onClose={close}
      >
        <Modal.Body>{templageFn()}</Modal.Body>
        <Modal.Footer>
          <Button type="primary" onClick={handleSave}>
            ??????
          </Button>
          <Button type="weak" onClick={close}>
            ??????
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
