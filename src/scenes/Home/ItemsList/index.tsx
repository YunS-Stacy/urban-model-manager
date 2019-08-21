import React, { useContext, useState, useEffect } from 'react';
import { request, IRequestOptions } from '@esri/arcgis-rest-request';

import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

// Contexts
import IdentityContext from '../../contexts/IdentityContext';
// Components
import AddItemAccordion from './AddItemAccordion';
import ItemForm from './ItemForm';
import AppPagination from '../../../components/AppPagination';

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

  const searchFn = async (queryOptions?: { start?: number; num?: number, sortField?: string }) => {
    if (identity && identity.org) {
      const {
        org: { url },
        user: { username },
      } = identity;

      return searchItems(url, {
        q:
          (searchResult && searchResult.query) ||
          `type: Urban Model owner: ${username}`,
        sortField: 'title',
        start: searchResult && searchResult.start,
        num: searchResult && searchResult.num,
        ...queryOptions,
        f: 'json',
      })
        .then((res) => setSearchResult(res))
        .catch((e) => console.error(e));
    }
    return null;
  };

  // Fetch items after logged in
  useEffect(() => {
    if (!(identity && identity.user)) {
      setSearchResult(null);
    } else {
      searchFn();
    }
  }, [identity && identity.user && identity.user.username]);

  // Fetch item detail
  useEffect(() => {
    if (identity && item.id) {
      const {
        org: { url },
      } = identity;
      setItem((s) => ({ ...s, loading: true }));
      request(`https://${url}/sharing/rest/content/items/${item.id}/data`).then(
        (content: TUrbanModelItemData) => {
          setItem((s) => ({ ...s, content, loading: false }));
        },
      );
    }
  }, [identity, item.id]);

  const submitFn = async (cb: TUrbanModelItemData) => {
    if (identity && item.id && cb) {
      setItem((s) => ({
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

        setItem((s) => ({
          ...s,
          content: cb,
          updating: false,
        }));
      } catch (error) {
        console.error(error);
        setItem((s) => ({
          ...s,
          updating: false,
        }));
      }
    }
  };

  const deleteFn = async (itemId: string) => {
    if (identity && itemId) {
      setItem((s) => ({
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

        setItem((s) => ({
          ...s,
          id: '',
          content: null,
          loading: false,
        }));

        if (searchResult && searchResult.query)
          // Sset timeout to refresh
          setTimeout(async () => {
            searchFn();
          }, 1000);
      } catch (error) {
        console.error(error);
        setItem((s) => ({
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
            searchFn();
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
                        setItem((s) => ({ ...s, id: '', content: null }))
                      : // Switch
                        setItem((s) => ({
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
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    item.content && (
                      <ItemForm
                        value={item.content}
                        updating={item.updating}
                        submitFn={(cb) => submitFn(cb)}
                        deleteFn={() => deleteFn(item.id)}
                      />
                    )
                  )}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))}
      </Accordion>
      {searchResult && searchResult.total > 0 ? (
        <AppPagination
          prevFn={
            searchResult.start > 1
              ? () => {
                  searchFn({
                    start: searchResult.start - searchResult.num,
                    num: searchResult.num,
                  });
                }
              : null
          }
          nextFn={
            searchResult.nextStart > searchResult.start
              ? () => {
                  searchFn({
                    start: searchResult.nextStart,
                    num: searchResult.num,
                  });
                }
              : null
          }
          pageFn={n =>
            searchFn({
              start: n * searchResult.num + 1,
              num: searchResult.num,
            })
          }
          activePage={Math.floor(searchResult.start / searchResult.num)}
          pageCount={Math.ceil(searchResult.total / searchResult.num)}
        />
      ) : null}
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

export default ItemsList;
