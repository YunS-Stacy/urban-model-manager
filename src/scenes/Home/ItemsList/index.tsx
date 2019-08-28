import React, { useContext, useState, useEffect } from 'react';
import { request, IRequestOptions } from '@esri/arcgis-rest-request';

// Contexts
import IdentityContext from '../../contexts/IdentityContext';
// Components
import AddItemAccordion from './AddItemAccordion';
import AppPagination from '../../../components/AppPagination';
import { IItem, IGroup } from '@esri/arcgis-rest-types';
import fetchGroups from './utils/fetchGroups';
import ItemAccordion from './ItemAccordion';
import ItemFolderFormGroup from '../../../components/ItemFolderFormGroup';
import fetchFolders from './utils/fetchFolders';
import { getItemData, getItem } from '@esri/arcgis-rest-portal';
import GroupsContext from './contexts/GroupsContext';
import ItemSharingDiv from './ItemSharingDiv';
import fetchItemSharing from './utils/fetchItemSharing';

export interface IItemsListChild<T> {
  value?: T | null;
  setValueFn: (cb: T) => void;
  values?: T | T[] | null;
  disabled?: boolean;
}

export type TUrbanModelItemData = {
  version: string;
  services: [
    { type: 'master'; itemId: string },
    { type: 'design'; itemId: string },
    { type: 'master-view'; itemId: string },
  ];
};

type TSearchResult = {
  nextStart: number;
  num: number;
  query: string;
  results: IItem[];
  start: number;
  total: number;
};

export interface AGOLSharingOption {
  groups: string[];
  account: boolean;
  everyone: boolean;
}

export interface IFolder {
  created: number;
  id: string;
  title: string;
  username: string;
}
export interface IAppItem extends IItem {
  ownerFolder?: string;
  text?: TUrbanModelItemData | null;
  loading?: boolean;
  updating?: boolean;
}

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
    text: null as TUrbanModelItemData | null,
    loading: false,
    updating: false,
  } as IAppItem);

  const [sharingOption, setSharingOption] = React.useState({
    groups: [],
    account: false,
    everyone: false,
  } as AGOLSharingOption);

  const [folders, setFolders] = useState(null as IFolder[] | null);
  const [groups, setGroups] = useState(null as IGroup[] | null);
  const fetchItemsFn = async (queryOptions?: {
    start?: number;
    num?: number;
    sortField?: string;
  }) => {
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
    if (!(identity && identity.user && identity.org)) {
      setSearchResult(null);
    } else {
      fetchItemsFn();
      const {
        org: { url: portalUrl },
        user: { username },
      } = identity;
      fetchGroups({ username })
        .then((v) => setGroups(v))
        .catch((e) => console.error(e));
      fetchFolders({ portalUrl, username })
        .then((v) => setFolders(v))
        .catch((e) => console.error(e));
    }
  }, [identity && identity.user && identity.user.username]);

  // Fetch item detail
  useEffect(() => {
    if (identity && item.id) {
      setItem((s) => ({ ...s, loading: true }));

      getItem(item.id).then((res) => {
        setItem((s) => ({ ...s, ...res, loading: false }));
        const {
          org: { url: portalUrl },
        } = identity;
        fetchItemSharing({
          portalUrl,
          username: res.owner,
          itemId: res.id,
        }).then((sharing) => {
          if (!sharing) return;
          const { access, groups } = sharing;
          setSharingOption((s) => ({
            ...s,
            groups,
            everyone: access === 'public',
            account: access === 'org',
          }));
        });
      });

      getItemData(item.id).then((text: TUrbanModelItemData) =>
        setItem((s) => ({ ...s, text, loading: false })),
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
          `https://${url}/sharing/rest/content/users/${username}/items/${item.id}/update`,
          {
            params: {
              text: JSON.stringify(cb),
              f: 'json',
            },
          },
        );

        setItem((s) => ({
          ...s,
          text: cb,
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
          `https://${url}/sharing/rest/content/users/${username}/items/${item.id}/delete`,
        );

        setItem((s) => ({
          ...s,
          id: '',
          text: null,
          loading: false,
        }));

        if (searchResult && searchResult.query)
          // Set timeout to refresh
          setTimeout(async () => {
            fetchItemsFn();
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
            fetchItemsFn();
          }, 1000);
        }}
      />

      <ItemAccordion
        values={searchResult && searchResult.results}
        value={item}
        setValueFn={(cb) => setItem(cb)}
        submitFn={submitFn}
        deleteFn={deleteFn}
      >
        <ItemFolderFormGroup
          values={folders}
          value={
            folders &&
            folders.find(({ id }) => id === (item && item.ownerFolder))
          }
          setValueFn={(cb) => console.log(cb, 'move item')}
        />
        <GroupsContext.Provider value={groups}>
          <ItemSharingDiv
            value={sharingOption}
            setValueFn={(v) => setSharingOption(v)}
          />
          {/* <ItemGroupFormGroup
            values={groups}
            value={item && item.groups}
            setValueFn={(cb) => console.log(cb, 'set group')}
          /> */}
        </GroupsContext.Provider>
      </ItemAccordion>

      {searchResult && searchResult.total > 0 ? (
        <AppPagination
          prevFn={
            searchResult.start > 1
              ? () => {
                  fetchItemsFn({
                    start: searchResult.start - searchResult.num,
                    num: searchResult.num,
                  });
                }
              : null
          }
          nextFn={
            searchResult.nextStart > searchResult.start
              ? () => {
                  fetchItemsFn({
                    start: searchResult.nextStart,
                    num: searchResult.num,
                  });
                }
              : null
          }
          pageFn={(n) =>
            fetchItemsFn({
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
