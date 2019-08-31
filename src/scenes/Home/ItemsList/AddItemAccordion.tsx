import React, { useState, useContext } from 'react';
import { request } from '@esri/arcgis-rest-request';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// @ts-ignore
import PlusIcon from 'calcite-ui-icons-react/PlusIcon';
// Types
import { TUrbanModelItemData, INITIAL_SHARING_OPTION } from '.';
// Components
import ItemDataFormGroup from '../../../components/ItemDataFormGroup';

// Contexts
import IdentityContext from '../../contexts/IdentityContext';
import ItemFolderFormGroup from './ItemFolderFormGroup';
import ItemSharingDiv from './ItemSharingDiv';
import ItemCardFooter from '../../../components/ItemCardFooter';
import AccessContext from './contexts/AccessContext';
import shareItem from './utils/shareItem';
import { ICreateItemResponse } from '@esri/arcgis-rest-portal';



const INITIAL_VALUE: TUrbanModelItemData = {
  version: '1.0.5',
  services: [
    {
      type: 'master',
      itemId: '',
    },
    {
      type: 'design',
      itemId: '',
    },
    {
      type: 'master-view',
      itemId: '',
    },
  ],
};

const INITIAL_ITEM = {
  title: '',
  text: INITIAL_VALUE,
};
const addItem = async ({
  portalUrl,
  username,
  item,
  folderId = '',
}: {
  folderId?: string;
  portalUrl: string;
  username: string;
  item: {
    [key: string]: string;
  };
}) => {
  const url = `https://${portalUrl}/sharing/rest/content/users/${username}/${
    folderId ? `${folderId}/` : ''
  }addItem`;

  const res: ICreateItemResponse = await request(url, {
    params: {
      ...item,
      f: 'json',
    },
  });
  return res;
};
const AddItemAccordion = ({
  disabled = false,
  refreshFn,
}: {
  disabled?: boolean;
  refreshFn: () => void;
}) => {
  const { identity } = useContext(IdentityContext);
  const [item, setItem] = useState(INITIAL_ITEM);
  const [activeKey, setActiveKey] = useState('');

  const { folders } = useContext(AccessContext);
  const [folderId, setFolderId] = useState('');

  const [sharingOption, setSharingOption] = useState(INITIAL_SHARING_OPTION);
  const [updating, setUpdating] = useState(false);

  const okFn = async () => {
    if (!identity) return;

    setUpdating(true);

    try {
      const {
        org: { url: portalUrl },
        user: { username },
      } = identity;

      const { id, success } = await addItem({
        portalUrl,
        username: username as string,
        item: {
          title: item.title,
          type: 'Urban Model',
          typeKeywords: 'Urban,Urban-Model',
          tags: 'Urban,Urban-Model',
          text: JSON.stringify(item.text),
        },
        folderId,
      });
      if (!success) {
        return setUpdating(false);
      }
      await shareItem({
        portalUrl,
        username,
        sharingOption,
        itemId: id,
      });
      setItem(INITIAL_ITEM);
      setActiveKey('');
      refreshFn();
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      console.error(error);
    }
  };

  const cancelFn = () => {
    setItem(INITIAL_ITEM);
    setActiveKey(() => '');
  };

  return identity && identity.session ? (
    <Accordion activeKey={activeKey}>
      <Card>
        <Card.Header>
          <Accordion.Toggle
            as={Button}
            variant="link"
            eventKey="1"
            onClick={() => setActiveKey((s) => (!s ? '1' : ''))}
          >
            <PlusIcon size={16} />
            Add Urban Model
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="1">
          <Card.Body>
            <Form.Group controlId="item-title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={item.title}
                onChange={(e: any) => {
                  const title = e.target.value;
                  setItem((s) => ({ ...s, title }));
                }}
              />
            </Form.Group>
            <ItemDataFormGroup
              value={item.text}
              setValue={(text) => setItem((s) => ({ ...s, text }))}
              disabled={updating || disabled}
            />
            <ItemFolderFormGroup
              disabled={updating || disabled}
              values={folders}
              value={folders && folders.find(({ id }) => id === folderId)}
              setValueFn={(cb) => setFolderId(cb)}
            />
            <ItemSharingDiv
              value={sharingOption}
              setValueFn={(cb) => setSharingOption(cb)}
              disabled={updating || disabled}
            />
            <ItemCardFooter
              disabled={updating}
              okTitle={'Ok'}
              okFn={okFn}
              cancelFn={cancelFn}
            />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  ) : null;
};

export default AddItemAccordion;
