import React, { useContext, useState, useEffect, memo } from 'react';
import { request, IRequestOptions } from '@esri/arcgis-rest-request';

// Contexts
import IdentityContext from '../../contexts/IdentityContext';
import AccessContext from './contexts/AccessContext';

// Components
import AddItemAccordion from './AddItemAccordion';
import AppPagination from '../../../components/AppPagination';
import { IItem, IGroup } from '@esri/arcgis-rest-types';
import fetchGroups from './utils/fetchGroups';
import ItemAccordion from './ItemAccordion';
import fetchFolders from './utils/fetchFolders';
import {
  getItemData,
  getItem,
  moveItem,
  searchItems,
  ISearchOptions,
} from '@esri/arcgis-rest-portal';
import fetchItemSharing from './utils/fetchItemSharing';
import unshareItem from './utils/unshareItem';
import shareItem from './utils/shareItem';

export const DEFAULT_QUERY_FEATURE_SERVICE = `-type: Feature Service`;
export const INITIAL_SHARING_OPTION: AGOLSharingOption = {
  groups: [],
  account: false,
  everyone: false,
};

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

const ItemsList = () => {
  const { identity } = useContext(IdentityContext);
  const [searchResult, setSearchResult] = useState(
    null as TSearchResult | null,
  );
  const [searchServiceResult, setSearchServiceResult] = useState(
    null as TSearchResult | null,
  );
  const [item, setItem] = useState({
    id: '',
    text: null as TUrbanModelItemData | null,
    loading: false,
    updating: false,
  } as IAppItem);

  const [defaultSharingOption, setDefaultSharingOption] = React.useState({
    groups: [],
    account: false,
    everyone: false,
  } as AGOLSharingOption);

  const [folders, setFolders] = useState(null as IFolder[] | null);

  const [groups, setGroups] = useState(null as IGroup[] | null);
  const fetchItem = async () => {
    if (identity && identity.org && item && item.id) {
      setItem((s) => ({ ...s, loading: true }));

      const {
        org: { url: portalUrl },
      } = identity;

      try {
        const res = await getItem(item.id);

        // Sharing Option
        const sharing = await fetchItemSharing({
          portalUrl,
          username: res.owner,
          itemId: res.id,
        });
        if (!sharing) return;
        const { access, groups } = sharing;
        setDefaultSharingOption((s) => ({
          ...s,
          groups,
          everyone: access === 'public',
          account: access === 'org',
        }));

        // Data
        const text = await getItemData(item.id);
        setItem((s) => ({
          ...s,
          ...res,
          ownerFolder: res.ownerFolder || '',
          text,
          loading: false,
        }));
      } catch (error) {
        console.error(error);

        setItem((s) => ({ ...s, loading: false }));
      }
    }
  };

  const fetchUrbanModelsFn = async (queryOptions?: Partial<ISearchOptions>) => {
    if (identity && identity.org) {
      const {
        user: { username },
      } = identity;

      return searchItems({
        q:
          (searchResult && searchResult.query) ||
          `owner: "${username}" type: "Urban Model"`,
        sortField: 'title',
        start: (searchResult && searchResult.start) || 0,
        num: (searchResult && searchResult.num) || 20,
        ...queryOptions,
        f: 'json',
      })
        .then((res) => setSearchResult(res))
        .catch((e) => console.error(e));
    }
    return null;
  };

  const fetchServicesFn = async (queryOptions?: Partial<ISearchOptions>) => {
    if (identity && identity.org) {
      return searchItems({
        q:
          (searchServiceResult && searchServiceResult.query) ||
          `type: "Feature Service"`,
        sortField: 'title',
        start: (searchServiceResult && searchServiceResult.start) || 0,
        num: (searchServiceResult && searchServiceResult.num) || 20,
        ...queryOptions,
        f: 'json',
      })
        .then((res) => setSearchServiceResult(res))
        .catch((e) => console.error(e));
    }
    return null;
  };

  // Fetch items after logged in
  useEffect(() => {
    if (!(identity && identity.user && identity.org)) {
      setSearchResult(null);
    } else {
      const {
        org: { url: portalUrl },
        user: { username },
      } = identity;
      fetchUrbanModelsFn();

      fetchGroups({ username })
        .then((v) => {
          setGroups(v);
          // Use groupids to query items
          fetchServicesFn();
        })
        .catch((e) => console.error(e));
      fetchFolders({ portalUrl, username })
        .then((v) => {
          // Add default/root folder
          setFolders([{ id: '', title: 'Default' }, ...(v || [])]);
        })
        .catch((e) => console.error(e));
    }
  }, [identity && identity.user && identity.user.username]);

  // Fetch item detail
  useEffect(() => {
    if (identity && item.id) {
      fetchItem();
    }
  }, [identity, item.id]);

  const updateFn = async (
    cb: TUrbanModelItemData,
    sharing: AGOLSharingOption,
    folderId: IFolder['id'],
  ) => {
    if (identity && item.id && cb) {
      setItem((s) => ({
        ...s,
        updating: true,
      }));
      const {
        org: { url: portalUrl },
        user: { username },
        session,
      } = identity;
      try {
        await request(
          `https://${portalUrl}/sharing/rest/content/users/${username}/items/${item.id}/update`,
          {
            params: {
              text: JSON.stringify(cb),
              f: 'json',
            },
          },
        );

        if (folderId !== (item && item.ownerFolder)) {
          await moveItem({
            itemId: item.id,
            authentication: session,
            folderId,
          });
        }

        // Diff sharing
        if (
          sharing.account !== defaultSharingOption.account ||
          sharing.everyone !== defaultSharingOption.everyone ||
          sharing.groups.join('') !== defaultSharingOption.groups.join('')
        ) {
          if (
            sharing.groups.join('') !== defaultSharingOption.groups.join('')
          ) {
            if (defaultSharingOption.groups.length > 0) {
              await unshareItem({
                username,
                portalUrl,
                itemId: item.id,
                groups: sharing.groups,
              });
            }
          }

          await shareItem({
            portalUrl,
            username,
            itemId: item.id,
            sharingOption: sharing,
          });
        }
        setItem((s) => ({
          ...s,
          updating: false,
        }));
        await fetchItem();
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
            fetchUrbanModelsFn();
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
      <AccessContext.Provider
        value={{
          groups,
          folders,
        }}
      >
        <AddItemAccordion
          refreshFn={() => {
            setTimeout(() => {
              fetchUrbanModelsFn();
            }, 1000);
          }}
        />

        <ItemAccordion
          values={searchResult && searchResult.results}
          value={item}
          defaultSharing={defaultSharingOption}
          setValueFn={(cb) => setItem(cb)}
          submitFn={updateFn}
          deleteFn={deleteFn}
        />
      </AccessContext.Provider>

      {searchResult && searchResult.total > 0 ? (
        <AppPagination
          prevFn={
            searchResult.start > 1
              ? () => {
                  fetchUrbanModelsFn({
                    start: searchResult.start - searchResult.num,
                    num: searchResult.num,
                  });
                }
              : null
          }
          nextFn={
            searchResult.nextStart > searchResult.start
              ? () => {
                  fetchUrbanModelsFn({
                    start: searchResult.nextStart,
                    num: searchResult.num,
                  });
                }
              : null
          }
          pageFn={(n) =>
            fetchUrbanModelsFn({
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
      {'No results'}
    </div>
  );
};

export default memo(ItemsList);
