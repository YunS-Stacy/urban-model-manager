import React, { useContext } from 'react';
import FormCheckCardSearch from '../../../components/FormCheckCardSearch';
import { IGroup } from '@esri/arcgis-rest-types';
import GroupsContext from './contexts/GroupsContext';

interface IItemGroupFormGroup<T = IGroup['id']> {
  value: T[];
  setValueFn: (cb: T[]) => void;
}

const getGroupInfo = (ids: IGroup['id'][], groups: IGroup[] | null) => {
  if (!ids || !groups) return [];
  return ids.reduce(
    (prev, curr) => {
      const itemId = groups.findIndex(({ id }) => id === curr);
      return itemId === -1 ? prev : [...prev, groups[itemId]];
    },
    [] as IGroup[],
  );
};

const ItemGroupFormGroup: React.FC<IItemGroupFormGroup> = ({
  value,
  setValueFn,
}) => {
  const groups = useContext(GroupsContext);

  const newValue = getGroupInfo(value, groups);

  return (
    <FormCheckCardSearch
      eventKey="group-search"
      values={groups || []}
      selected={newValue || []}
      idField="id"
      queryField="title"
      title="Groups"
      onSelect={(v) => setValueFn(v.map(({ id }) => id))}
    />
  );
};

export default ItemGroupFormGroup;
