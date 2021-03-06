import { DBTableName } from '@src/services';
import { Button, Form, Input, message, Modal } from '@tencent/tea-component';
import React, { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db';
const { TextArea } = Input;

type ScenesType = {
  id?: number;
  scenesId?: string;
  sceneName?: string;
  strategy?: string;
  attackObject?: string;
  loseEffect?: string;
  safetyTrade?: string;
};

export default function AddModal(props) {
  const { add, update } = useIndexedDB(DBTableName[props.comName]);

  const [theName, setTheName] = useState('');
  const [theStrategy, setTheStrategy] = useState('');
  const [theAttackObject, setTheAttackObject] = useState('');
  const [theLoseEffect, setTheLoseEffect] = useState('');
  const [doSave, setDoSave] = useState(false);
  const [preName, setPreName] = useState('');

  const init = () => {
    setTheName('');
    setTheStrategy('');
    setTheAttackObject('');
    setTheLoseEffect('');
    setDoSave(false);
    setPreName('');
  };
  const close = () => {
    props.close();
    init();
  };

  const handleTextAreaChange = (v, attr) => {
    if (attr === 'theStrategy') {
      setTheStrategy(v);
    } else if (attr === 'theAttackObject') {
      setTheAttackObject(v);
    } else if (attr === 'theLoseEffect') {
      setTheLoseEffect(v);
    }
  };
  // 名称检查
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

  // 检查系统名称是否已存在
  const checkSave = () => {
    if (props.allData) {
      let arr = [];
      props.allData.map(item => {
        arr.push(item.sceneName);
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
    if (theStrategy.trim() === '') {
      return false;
    }
    if (theAttackObject.trim() === '') {
      return false;
    }
    if (theLoseEffect.trim() === '') {
      return false;
    }
    if (!checkSave()) {
      return;
    }
    if (props.isEdit) {
      let request = {};
      request = {
        ...props.theData,
        sceneName: theName.trim(),
        strategy: theStrategy.trim(),
        attackObject: theAttackObject.trim(),
        loseEffect: theLoseEffect.trim(),
      };

      update<ScenesType>(request)
        .then(() => {
          message.success({ content: '成功' });
          props.close();
          props.save();
          init();
        })
        .catch(err => {
          message.error({ content: `失败${err}` });
        });
    } else {
      let request = {};
      request = {
        scenesId: 'scenes_id' + new Date().getTime(),
        sceneName: theName.trim(),
        strategy: theStrategy.trim(),
        attackObject: theAttackObject.trim(),
        loseEffect: theLoseEffect.trim(),
        safetyTrade: props.trade,
      };
      add<ScenesType>(request)
        .then(() => {
          message.success({ content: '成功' });
          props.close();
          props.save();
          init();
        })
        .catch(err => {
          message.error({ content: `失败${err}` });
        });
    }
  };
  useEffect(() => {
    if (props.theData && props.isEdit) {
      setTheName(props.theData.sceneName);

      setTheStrategy(props.theData.strategy);
      setTheAttackObject(props.theData.attackObject);

      setTheLoseEffect(props.theData.loseEffect);
      setPreName(props.theData.sceneName);
    }
  }, [props.theData]);
  const templageFn = () => {
    return (
      <>
        <Form>
          <Form.Item
            label="攻击场景名称"
            message={nameMessage(theName, '请输入攻击场景名称', '攻击场景名称已存在')}
            status={doSave ? (theName.trim() && checkSave() ? null : 'error') : null}
          >
            <Input
              size="m"
              value={theName}
              onChange={(value, context) => {
                setTheName(value);
              }}
              placeholder="请输入攻击场景名称"
            />
          </Form.Item>
          <Form.Item
            label="行动策略"
            message={doSave ? (theStrategy.trim() ? null : '输入行动策略') : null}
            status={doSave ? (theStrategy.trim() ? null : 'error') : null}
          >
            <TextArea
              size="m"
              value={theStrategy}
              onChange={value => {
                handleTextAreaChange(value, 'theStrategy');
              }}
              placeholder="输入行动策略"
            />
          </Form.Item>
          <Form.Item
            label="攻击目标"
            message={doSave ? (theAttackObject.trim() ? null : '输入攻击目标') : null}
            status={doSave ? (theAttackObject.trim() ? null : 'error') : null}
          >
            <TextArea
              size="m"
              value={theAttackObject}
              onChange={value => {
                handleTextAreaChange(value, 'theAttackObject');
              }}
              placeholder="输入攻击目标"
            />
          </Form.Item>
          <Form.Item
            label="损失影响"
            message={doSave ? (theLoseEffect.trim() ? null : '输入损失影响') : null}
            status={doSave ? (theLoseEffect.trim() ? null : 'error') : null}
          >
            <TextArea
              size="m"
              value={theLoseEffect}
              onChange={value => {
                handleTextAreaChange(value, 'theLoseEffect');
              }}
              placeholder="输入损失影响"
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
        size="m"
        caption={props.isEdit ? '编辑攻击场景' : '新增攻击场景'}
        disableCloseIcon={true}
        onClose={close}
      >
        <Modal.Body>{templageFn()}</Modal.Body>
        <Modal.Footer>
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
          <Button type="weak" onClick={close}>
            取消
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
