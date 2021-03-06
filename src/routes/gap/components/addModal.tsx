import { DBTableName } from '@src/services';
import { Button, Form, Input, message, Modal, Select } from '@tencent/tea-component';
import React, { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db';
const { TextArea } = Input;

type GapType = {
  gapId?: string;
  propertyOrSystem?: string;
  business?: string;
  businessKinds?: string;
  part?: string;
  categorys?: string;
  theType?: string;
  editMen?: string;
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
type ItemType = {
  text: string | number;
  value: string | number;
};
type GapOptions = {
  id?: number;
  attackOption?: ItemType;
  bugsOption?: ItemType;
  actionOption?: ItemType;
  againstOption?: ItemType;
};

export default function AddModal(props) {
  const { update } = useIndexedDB(DBTableName.gap);
  const [theName, setTheName] = useState('');

  const [attackOption, setAttackOption] = useState([]);
  const [bugsOption, setBugsOption] = useState([]);
  const [actionOption, setActionOption] = useState([]);
  const [againstOption, setAgainstOption] = useState([]);

  const [attacktion, setAttacktion] = useState('');
  const [attacktionDiy, setAttacktionDiy] = useState('');
  const [attackDiyId, setAttackDiyId] = useState('');
  const [theTheBug, setTheTheBug] = useState('');
  const [bugDiy, setBugDiy] = useState('');
  const [bugDiyId, setBugDiyId] = useState('');
  const [action, setAction] = useState('');
  const [actionDiy, setActionDiy] = useState('');
  const [actionDiyId, setActionDiyId] = useState('');
  const [against, setAgainst] = useState('');
  const [againstDiy, setAgainstDiy] = useState('');
  const [againstDiyId, setAgainstDiyId] = useState('');
  const [doSave, setDoSave] = useState(false);

  // 获取 options 数据
  const getOptions = () => {
    const { getAll } = useIndexedDB(DBTableName.gapOptions);
    getAll()
      .then(res => {
        setAttackOption([...res[0].attackOption]);
        setBugsOption([...res[0].bugsOption]);
        setActionOption([...res[0].actionOption]);
        setAgainstOption([...res[0].againstOption]);
      })
      .catch(err => {
        message.error({ content: `失败${err}` });
      });
  };
  useEffect(() => {
    if (props.visible) {
      getOptions();
    }
  }, [props.visible]);

  // 更新options 数据
  const updateOption = () => {
    const { update } = useIndexedDB(DBTableName.gapOptions);
    let request: GapOptions = {
      id: 1,
      attackOption: checkExistOption(attackOption, attacktion, attacktionDiy, attackDiyId),
      bugsOption: checkExistOption(bugsOption, theTheBug, bugDiy, bugDiyId),
      actionOption: checkExistOption(actionOption, action, actionDiy, actionDiyId),
      againstOption: checkExistOption(againstOption, against, againstDiy, againstDiyId),
    };
    update(request)
      .then(() => {})
      .catch(err => {
        message.error({ content: `失败${err}` });
      });
  };

  const checkExistOption = (perArr: any, attr: any, newText: any, val: any) => {
    if (!perArr) {
      return;
    }
    let arr: any = [];
    if (attr !== 'diy') {
      arr = [...perArr];
    } else {
      let textArr = [];
      perArr.map(item => {
        textArr.push(item.text);
      });
      if (textArr.indexOf(newText) < 0) {
        arr = [...perArr, { text: newText, value: val }];
      } else {
        perArr.map(item => {
          if (item.text === newText) {
            item.value = val;
          }
        });
        arr = [...perArr];
      }
    }
    return arr;
  };

  const init = () => {
    setTheName('');
    setAttacktion('');
    setTheTheBug('');
    setAction('');
    setAgainst('');
    setAttacktionDiy('');
    setBugDiy('');
    setActionDiy('');
    setAgainstDiy('');
    setAttackDiyId('');
    setBugDiyId('');
    setActionDiyId('');
    setAgainstDiyId('');
    setDoSave(false);
  };
  const close = () => {
    props.close();
    init();
  };

  // 输入框输入
  const handleTextAreaChange = (v, attr) => {
    attr(v);
  };

  // 当选择其他时展示 输入textarea
  const showTextArea = attr => {
    if (attr === 'diy') {
      return true;
    }
    return false;
  };
  useEffect(() => {
    if (attacktion !== 'diy') {
      setAttacktionDiy('');
    } else {
      const val = 'attacktion' + new Date().getTime();
      setAttackDiyId(val);
    }
  }, [attacktion]);

  useEffect(() => {
    if (theTheBug !== 'diy') {
      setBugDiy('');
    } else {
      const val = 'theTheBug' + new Date().getTime();
      setBugDiyId(val);
    }
  }, [theTheBug]);

  useEffect(() => {
    if (action !== 'diy') {
      setActionDiy('');
    } else {
      const val = 'action' + new Date().getTime();
      setActionDiyId(val);
    }
  }, [action]);

  useEffect(() => {
    if (against !== 'diy') {
      setAgainstDiy('');
    } else {
      const val = 'against' + new Date().getTime();
      setAgainstDiyId(val);
    }
  }, [against]);

  // 保存检查
  const checkSave = () => {
    if (!attacktion) {
      return false;
    }
    if (!theTheBug) {
      return false;
    }
    if (!action) {
      return false;
    }
    if (!against) {
      return false;
    }

    if (attacktion === 'diy' && attacktionDiy.trim() === '') {
      return false;
    }
    if (theTheBug === 'diy' && bugDiy.trim() === '') {
      return false;
    }
    if (action === 'diy' && actionDiy.trim() === '') {
      return false;
    }
    if (against === 'diy' && againstDiy.trim() === '') {
      return false;
    }
    return true;
  };

  // 返回名字

  const getName = (arr, attr_1, attr_2) => {
    if (!arr) {
      return;
    }
    let name = '';
    if (attr_1 === 'diy') {
      name = attr_2;
    } else {
      arr.map((item: any) => {
        if (item.value === attr_1) {
          name = item.text;
        }
      });
    }
    return name;
  };

  const handleSave = () => {
    setDoSave(true);

    if (!checkSave()) {
      return;
    }

    if (props.isEdit) {
      let request: any = {
        ...props.theData,
        editMen: 'shanehwang',
        editedAt: +new Date(),
        actType: attacktion === 'diy' ? attackDiyId : attacktion,
        actName: getName(attackOption, attacktion, attacktionDiy),
        theBug: theTheBug === 'diy' ? bugDiyId : theTheBug,
        bugName: getName(bugsOption, theTheBug, bugDiy),
        action: action === 'diy' ? actionDiyId : action,
        actionName: getName(actionOption, action, actionDiy),
        against: against === 'diy' ? againstDiyId : against,
        againstName: getName(againstOption, against, againstDiy),
      };
      update<GapType>(request)
        .then(() => {
          message.success({ content: '成功' });
          updateOption();
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
      setTheName(props.theData.propertyOrSystem);
      setAttacktion(props.theData.actType);
      setTheTheBug(props.theData.theBug);
      setAction(props.theData.action);
      setAgainst(props.theData.against);

      setAttacktionDiy(props.theData.actName || '');
      setBugDiy(props.theData.bugName || '');
      setActionDiy(props.theData.actionName || '');
      setAgainstDiy(props.theData.againstName || '');
    }
  }, [props.theData]);

  return (
    <>
      <Modal
        maskClosable
        visible={props.visible}
        caption="攻击手法与漏洞"
        size="l"
        disableCloseIcon={true}
        onClose={close}
      >
        <Modal.Body>
          <Form>
            <Form.Item label="资产/系统名称：" style={{ marginBottom: '20px' }}>
              <Input
                readOnly
                size="m"
                value={theName}
                onChange={value => {
                  setTheName(value);
                }}
                placeholder="资产/系统名称"
              />
            </Form.Item>

            <Form.Item
              label="攻击手法"
              message={doSave ? (attacktion ? null : '请选择攻击手法') : null}
              status={doSave ? (attacktion ? null : 'error') : null}
            >
              <Select
                size="m"
                appearance="button"
                options={attackOption}
                value={attacktion}
                onChange={value => handleTextAreaChange(value, setAttacktion)}
                placeholder="请选择攻击手法"
              />
            </Form.Item>

            {showTextArea(attacktion) && (
              <Form.Item
                message={
                  showTextArea(attacktion) && doSave
                    ? attacktionDiy && attacktionDiy.trim()
                      ? null
                      : '输入攻击手法'
                    : null
                }
                status={
                  showTextArea(attacktion) && doSave ? (attacktionDiy && attacktionDiy.trim() ? null : 'error') : null
                }
              >
                <TextArea
                  size="l"
                  value={attacktionDiy}
                  onChange={value => {
                    handleTextAreaChange(value, setAttacktionDiy);
                  }}
                  placeholder="输入攻击手法"
                />
              </Form.Item>
            )}

            <Form.Item
              label="漏洞"
              message={doSave ? (theTheBug ? null : '请选择漏洞') : null}
              status={doSave ? (theTheBug ? null : 'error') : null}
            >
              <Select
                size="m"
                appearance="button"
                options={bugsOption}
                value={theTheBug}
                onChange={value => handleTextAreaChange(value, setTheTheBug)}
                placeholder="请选择漏洞"
              />
            </Form.Item>

            {showTextArea(theTheBug) && (
              <Form.Item
                message={showTextArea(theTheBug) && doSave ? (bugDiy && bugDiy.trim() ? null : '输入攻击手法') : null}
                status={showTextArea(theTheBug) && doSave ? (bugDiy && bugDiy.trim() ? null : 'error') : null}
              >
                <TextArea
                  style={{ marginTop: '20px' }}
                  size="l"
                  value={bugDiy}
                  onChange={value => {
                    handleTextAreaChange(value, setBugDiy);
                  }}
                  placeholder="输入漏洞"
                />
              </Form.Item>
            )}

            <Form.Item
              label="执行动作"
              message={doSave ? (action ? null : '请选择执行动作') : null}
              status={doSave ? (action ? null : 'error') : null}
            >
              <Select
                size="m"
                appearance="button"
                options={actionOption}
                value={action}
                onChange={value => handleTextAreaChange(value, setAction)}
                placeholder="请选择执行动作"
              />
            </Form.Item>

            {showTextArea(action) && (
              <Form.Item
                message={
                  showTextArea(action) && doSave ? (actionDiy && actionDiy.trim() ? null : '输入执行动作') : null
                }
                status={showTextArea(action) && doSave ? (actionDiy && actionDiy.trim() ? null : 'error') : null}
              >
                <TextArea
                  style={{ marginTop: '20px' }}
                  size="l"
                  value={actionDiy}
                  onChange={value => {
                    handleTextAreaChange(value, setActionDiy);
                  }}
                  placeholder="输入执行动作"
                />
              </Form.Item>
            )}

            <Form.Item
              label="对抗措施"
              message={doSave ? (against ? null : '请选择对抗措施') : null}
              status={doSave ? (against ? null : 'error') : null}
            >
              <Select
                size="m"
                appearance="button"
                options={againstOption}
                value={against}
                onChange={value => handleTextAreaChange(value, setAgainst)}
                placeholder="请选择对抗措施"
              />
            </Form.Item>

            {showTextArea(against) && (
              <Form.Item
                message={
                  showTextArea(against) && doSave ? (againstDiy && againstDiy.trim() ? null : '输入对抗措施') : null
                }
                status={showTextArea(against) && doSave ? (againstDiy && againstDiy.trim() ? null : 'error') : null}
              >
                <TextArea
                  style={{ marginTop: '20px' }}
                  size="l"
                  value={againstDiy}
                  onChange={value => {
                    handleTextAreaChange(value, setAgainstDiy);
                  }}
                  placeholder="输入对抗措施"
                />
              </Form.Item>
            )}
          </Form>
        </Modal.Body>
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
