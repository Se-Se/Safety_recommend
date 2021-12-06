import { DBTableName } from '@src/services';
import { Button, Form, Input, message, Modal, TextArea } from '@tencent/tea-component';
import React, { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db';

type RecordType = {
  id?: number;
  tradeN?: string;
  description?: string;
  createdAt?: string | number;
};
export default function AddModal(props) {
  const { add, update } = useIndexedDB(DBTableName.trade);
  const [title, setTitle] = useState('');
  const [desText, setDesText] = useState('');
  const [doSave, setDoSave] = useState(false);
  const [preName, setPreName] = useState('');

  const handleTitle = (t: string) => {
    setTitle(t);
  };
  const handleDesText = (t: string) => {
    setDesText(t);
  };
  const init = () => {
    setDesText('');
    setTitle('');
    setDoSave(false);
    setPreName('');
  };
  const close = () => {
    props.close();
    init();
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
        arr.push(item.tradeN);
      });
      if (arr.indexOf(title.trim()) > -1 && !props.isEdit) {
        return false;
      }
      if (arr.indexOf(title.trim()) > -1 && props.isEdit && title !== preName) {
        return false;
      }
    }
    return true;
  };
  const handleSave = () => {
    setDoSave(true);
    if (title.trim() === '') {
      return;
    }
    if (desText.trim() === '') {
      return;
    }
    if (!checkSave()) {
      return;
    }
    if (props.isEdit) {
      update<RecordType>({ tradeN: title.trim(), description: desText, id: props.theTrade.id, createdAt: +new Date() })
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
      add<RecordType>({
        tradeN: title.trim(),
        description: desText,
        createdAt: +new Date(),
      })
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
    if (props.theTrade) {
      setDesText(props.theTrade.description);
      setTitle(props.theTrade.tradeN);
      setPreName(props.theTrade.tradeN);
    }
  }, [props.theTrade]);

  return (
    <>
      <Modal
        maskClosable
        visible={props.visible}
        disableCloseIcon={true}
        caption={props.isEdit ? '编辑行业' : '新增行业'}
        size="m"
        onClose={close}
      >
        <Modal.Body>
          <Form>
            <Form.Item
              label="标题"
              message={nameMessage(title, '请输入行业名称', '行业名称已存在')}
              status={doSave ? (title.trim() && checkSave() ? null : 'error') : null}
            >
              <Input
                size="m"
                value={title}
                onChange={value => {
                  handleTitle(value);
                }}
                placeholder="请输入行业名称"
              />
            </Form.Item>
            <Form.Item
              label="描述"
              message={doSave ? (desText ? null : '请输入行业描述') : null}
              status={doSave ? (desText ? null : 'error') : null}
            >
              <TextArea
                size="m"
                value={desText}
                placeholder="请输入行业描述"
                onChange={value => {
                  handleDesText(value);
                }}
              />
            </Form.Item>
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
