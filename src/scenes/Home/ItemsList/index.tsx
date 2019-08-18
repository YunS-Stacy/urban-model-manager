import React, { useContext, useState, useEffect } from 'react';
import { request, IRequestOptions } from '@esri/arcgis-rest-request';

import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

// @ts-ignore
import PenIcon from 'calcite-ui-icons-react/PenIcon';
// @ts-ignore
import TrashIcon from 'calcite-ui-icons-react/TrashIcon';

// Contexts
import IdentityContext from '../../contexts/IdentityContext';
import AddItemAccordion from './AddItemAccordion';
import ItemDataFormGroup from './ItemDataFormGroup';

export type TUrbanModelItemData = {
  version: string;
  services: [
    { type: 'master'; itemId: string },
    { type: 'design'; itemId: string },
    { type: 'master-view'; itemId: string }
  ];
};

type TSearchResult = {
  nextStart: number;
  num: number;
  query: string;
  results: {
    title: string;
    id: string;
    [key: string]: any;
  }[];
  start: number;
  total: number;
};

const searchItems = (portalUrl: string, params?: IRequestOptions['params']) => {
  const url = `https://${portalUrl}/sharing/rest/search`;

  return request(url, {
    params,
  });
};

const ItemsList = () => {
  const { identity } = useContext(IdentityContext);
  const [searchResult, setSearchResult] = useState(
    null as TSearchResult | null,
  );

  const [item, setItem] = useState({
    id: '',
    content: null as TUrbanModelItemData | null,
    loading: false,
    updating: false,
  });

  // Fetch items after logged in
  useEffect(() => {
    if (!(identity && identity.user)) {
      return setSearchResult(null);
    }

    const {
      org: { url },
      user: { username },
    } = identity;

    searchItems(url, {
      q: `type: Urban Model owner: ${username}`,
      f: 'json',
    })
      .then(res => setSearchResult(res))
      .catch(error => console.error(error));
  }, [identity]);

  // Fetch item detail
  useEffect(() => {
    if (identity && item.id) {
      const {
        org: { url },
      } = identity;
      setItem(s => ({ ...s, loading: true }));
      request(`https://${url}/sharing/rest/content/items/${item.id}/data`).then(
        (content: TUrbanModelItemData) => {
          setItem(s => ({ ...s, content, loading: false }));
        },
      );
    }
  }, [identity, item.id]);

  const submitFn = async (cb: TUrbanModelItemData) => {
    if (identity && item.id && cb) {
      setItem(s => ({
        ...s,
        updating: true,
      }));
      const {
        org: { url },
        user: { username },
      } = identity;
      try {
        await request(
          `https://${url}/sharing/rest/content/users/${username}/items/${
            item.id
          }/update`,
          {
            params: {
              text: JSON.stringify(cb),
              f: 'json',
            },
          },
        );

        setItem(s => ({
          ...s,
          content: cb,
          updating: false,
        }));
      } catch (error) {
        console.error(error);
        setItem(s => ({
          ...s,
          updating: false,
        }));
      }
    }
  };

  const deleteFn = async (itemId: string) => {
    if (identity && itemId) {
      setItem(s => ({
        ...s,
        loading: true,
      }));
      const {
        org: { url },
        user: { username },
      } = identity;
      try {
        await request(
          `https://${url}/sharing/rest/content/users/${username}/items/${
            item.id
          }/delete`,
        );

        setItem(s => ({
          ...s,
          id: '',
          content: null,
          loading: false,
        }));

        if (searchResult && searchResult.query)
          // Sset timeout to refresh
          setTimeout(async () => {
            try {
              // Set timeout to f
              const res = await searchItems(url, {
                q: searchResult.query,
                f: 'json',
              });
              setSearchResult(res);
            } catch (error) {
              console.error(error);
            }
          }, 1000);
      } catch (error) {
        console.error(error);
        setItem(s => ({
          ...s,
          loading: false,
        }));
      }
    }
  };
  return searchResult && searchResult.results.length > 0 ? (
    <>
      <AddItemAccordion
        refreshFn={() => {
          setTimeout(() => {
            if (
              identity &&
              identity.session &&
              searchResult &&
              searchResult.query
            ) {
              const {
                org: { url },
              } = identity;
              searchItems(url, {
                q: searchResult.query,
                f: 'json',
              })
                .then(res => setSearchResult(res))
                .catch(e => console.error(e));
            }
          }, 1000);
        }}
      />

      <Accordion activeKey={item.id}>
        {searchResult &&
          searchResult.results.map(({ id, title }) => (
            <Card key={id}>
              <Card.Header>
                <Accordion.Toggle
                  as={Button}
                  variant="link"
                  eventKey={id}
                  onClick={() =>
                    item.id === id
                      ? // Toggle off
                        setItem(s => ({ ...s, id: '', content: null }))
                      : // Switch
                        setItem(s => ({
                          ...s,
                          id,
                          content: null,
                        }))
                  }
                >
                  {title}
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey={id}>
                <Card.Body>
                  {item.loading ? (
                    <div
                      style={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    item.content && (
                      <UrbanModelItemForm
                        value={item.content}
                        updating={item.updating}
                        submitFn={cb => submitFn(cb)}
                        deleteFn={() => deleteFn(item.id)}
                      />
                    )
                  )}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))}
      </Accordion>
    </>
  ) : (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      {identity && identity.user ? 'No results' : 'Please log in'}
    </div>
  );
};

const UrbanModelItemForm = ({
  value,
  updating,
  submitFn,
  deleteFn,
}: {
  value: TUrbanModelItemData;
  updating: boolean;
  submitFn: (cb: TUrbanModelItemData) => void;
  deleteFn: any;
}) => {
  const [disabled, setDisabled] = useState(true);
  const [nValue, setNValue] = useState(value);

  return (
    <Form>
      <ButtonToolbar style={{ justifyContent: 'flex-end' }}>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="edit-icon">Edit</Tooltip>}
        >
          <Button variant="link" onClick={() => setDisabled(s => !s)}>
            <PenIcon />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="trash-icon">Delete</Tooltip>}
        >
          <Button variant="link" onClick={deleteFn}>
            <TrashIcon />
          </Button>
        </OverlayTrigger>
      </ButtonToolbar>
      <ItemDataFormGroup
        value={nValue}
        setValue={setNValue}
        disabled={disabled || updating}
      />

      {/* {(['version', 'services'] as (keyof TUrbanModelItemData)[]).map(key => (
        <Form.Group controlId={`data${key}`} key={key}>
          <Form.Label
            style={{
              textTransform: 'capitalize',
            }}
          >
            {key}
          </Form.Label>
          {typeof nValue[key] === 'string' ? (
            <Form.Control
              type="text"
              value={nValue[key] as string}
              readOnly={true}
            />
          ) : (
            (nValue[key] as typeof value['services']).map(
              ({ type, itemId }, i) => (
                <Form.Group
                  as={Form.Row}
                  controlId={`data${key}${type}`}
                  key={type}
                >
                  <Form.Label
                    style={{
                      textTransform: 'capitalize',
                      textAlign: 'right',
                    }}
                    column={true}
                    sm={2}
                  >
                    {type}
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      key={type}
                      type="text"
                      disabled={disabled || updating}
                      value={itemId}
                      title={type}
                      onChange={(e: any) => {
                        const nextValue = {
                          ...nValue,
                          [key]: [
                            ...nValue[key as 'services'].slice(0, i),
                            {
                              type,
                              itemId: e.target.value,
                            },
                            ...nValue[key as 'services'].slice(i + 1),
                          ],
                        };

                        setNValue(nextValue);
                      }}
                    />
                  </Col>
                </Form.Group>
              ),
            )
          )}
        </Form.Group>
      ))} */}

      {!disabled && (
        <ButtonToolbar style={{ justifyContent: 'flex-end' }}>
          <Button
            disabled={updating}
            variant="primary"
            type="submit"
            onClick={() => {
              submitFn(nValue);
            }}
          >
            {updating ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              'Update'
            )}
          </Button>
          <Button
            disabled={updating}
            variant="light"
            onClick={() => {
              setNValue(value);
              setDisabled(true);
            }}
          >
            Cancel
          </Button>
        </ButtonToolbar>
      )}
    </Form>
  );
};

export default ItemsList;
