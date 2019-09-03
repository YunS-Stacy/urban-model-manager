import React, { useState, useEffect, useContext } from 'react';
import InputPopover, {
  IInputPopover,
} from '../../../../components/InputPopover';
import {
  searchItems,
  ISearchResult,
  IItem,
  IUser,
} from '@esri/arcgis-rest-portal';
import IdentityContext from '../../../contexts/IdentityContext';

const QUERY_LOCATIONS = [
  {
    id: 'owner',
    title: 'My Content',
  },
  {
    id: 'orgid',
    title: 'My Organization',
  },
  {
    id: 'group',
    title: 'My Groups',
  },
];

const getLocationQuery = (
  user: IUser,
  { id }: { id: string; title: string },
) => {
  switch (id) {
    case 'owner':
      return `${id}: "${user.username}"`;

    case 'orgid':
      return `${id}: ${user.orgId}`;

    case 'group':
      return !user.groups
        ? ''
        : `${id}: (${user.groups &&
            user.groups.map(({ id }) => id).join(' OR ')})`;

    default:
      return '';
  }
};

const queryItems = async ({
  query,
  user,
  searchResult,
  locationOption,
}: {
  query: string;
  user: IUser | null;
  searchResult?: ISearchResult<IItem> | null;
  locationOption: {
    id: string;
    title: string;
  };
}) => {
  if (!user) return null;
  // Query

  try {
    const res = await searchItems({
      q: `${query} type: "Feature Service" 
          ${getLocationQuery(user, locationOption)}`,
      sortField: 'title',
      start: (searchResult && searchResult && searchResult.start) || 0,
      num: (searchResult && searchResult && searchResult.num) || 20,
      f: 'json',
    });
    return res;
  } catch (error) {
    return null;
  }
};

interface IItemDataInputPopover extends IInputPopover {}
const ItemDataInputPopover: React.FC<IItemDataInputPopover> = (props) => {
  const [query, setQuery] = useState('');
  const [option, setOption] = useState(QUERY_LOCATIONS[0]);
  const [searchResult, setSearchResult] = useState(null as ISearchResult<
    IItem
  > | null);

  const { identity } = useContext(IdentityContext);

  useEffect(() => {
    queryItems({
      query,
      searchResult,
      user: identity && identity.user,
      locationOption: option,
    })
      .then((res) => setSearchResult(() => res))
      .catch((e) => console.error(e));
  }, [query, option.id]);
  
  return (
    <InputPopover
      {...props}
      query={query}
      setQueryFn={setQuery}
      option={option}
      options={QUERY_LOCATIONS}
      setOptionFn={setOption}
      values={(searchResult && searchResult && searchResult.results) || []}
      prevFn={
        searchResult && searchResult.start > searchResult.num
          ? () => {
              queryItems({
                query,
                searchResult: {
                  ...searchResult,
                  start: searchResult.start - searchResult.num,
                },
                user: identity && identity.user,
                locationOption: option,
              }).then(setSearchResult).catch(console.error);
            }
          : null
      }
      nextFn={
        searchResult && searchResult.nextStart > searchResult.start
          ? () => {
              queryItems({
                query,
                searchResult: {
                  ...searchResult,
                  start: searchResult && searchResult.nextStart,
                },
                user: identity && identity.user,
                locationOption: option,
              }).then(setSearchResult).catch(console.error);
            }
          : null
      }
      pageFn={
        !searchResult
          ? null
          : (n) =>
              queryItems({
                query,
                searchResult: {
                  ...searchResult,
                  start: n * searchResult.num + 1,
                },
                user: identity && identity.user,
                locationOption: option,
              }).then(setSearchResult).catch(console.error)
      }
      activePage={
        !searchResult ? 0 : Math.floor(searchResult.start / searchResult.num)
      }
      pageCount={
        !searchResult ? 0 : Math.ceil(searchResult.total / searchResult.num)
      }
    />
  );
};

export default ItemDataInputPopover;
