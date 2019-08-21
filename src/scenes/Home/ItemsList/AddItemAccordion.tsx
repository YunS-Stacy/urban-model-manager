import React, { useState, useContext } from 'react';
import { request } from '@esri/arcgis-rest-request';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

// @ts-ignore
import PlusIcon from 'calcite-ui-icons-react/PlusIcon';
// Types
import { TUrbanModelItemData } from '.';
// Components
import ItemDataFormGroup from './ItemDataFormGroup';
// Contexts
import IdentityContext from '../../contexts/IdentityContext';

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
const addItem = async (
  portalUrl: string,
  username: string,
  item: {
    [key: string]: string;
  },
) => {
  const url = `https://${portalUrl}/sharing/rest/content/users/${username}/addItem`;

  try {
    await request(url, {
      params: {
        ...item,
        f: 'json',
      },
    });
  } catch (error) {
    console.error(error);
  }
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
              disabled={false}
            />
            <ButtonToolbar style={{ justifyContent: 'flex-end' }}>
              <Button
                disabled={disabled}
                variant="primary"
                type="submit"
                onClick={async () => {
                  const {
                    org: { url },
                    user: { username },
                  } = identity;
                  await addItem(url, username as string, {
                    title: item.title,
                    type: 'Urban Model',
                    typeKeywords: '["Urban", "Urban-Model"]',
                    tags: '["Urban", "Urban-Model"]',
                    text: JSON.stringify(item.text),
                  });
                  setItem(INITIAL_ITEM);
                  setActiveKey('');
                  refreshFn();
                }}
              >
                {disabled ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  'Ok'
                )}
              </Button>
              <Button
                disabled={disabled}
                variant="light"
                onClick={() => {
                  setItem(INITIAL_ITEM);
                  setActiveKey(() => '');
                }}
              >
                Cancel
              </Button>
            </ButtonToolbar>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  ) : null;
};

export default AddItemAccordion;
