import React, { memo } from 'react';
import FormCheckCardSearch from '../../../../components/FormCheckCardSearch';
import { IGroup } from '@esri/arcgis-rest-types';

interface IItemGroupFormGroup {
  value: IGroup['id'][];
  values: IGroup[];
  setValueFn: (cb: IGroup['id'][]) => void;
  disabled: boolean;
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

const ItemGroupFormGroup = ({
  value,
  values,
  setValueFn,
  disabled,
}: IItemGroupFormGroup) => {
  const newValue = getGroupInfo(value, values);

  return (
    <FormCheckCardSearch
      disabled={disabled}
      eventKey="group-search"
      values={values || []}
      selected={newValue || []}
      idField="id"
      queryField="title"
      title="Groups"
      onSelect={(v) => setValueFn(v.map(({ id }) => id))}
    />
  );
};

ItemGroupFormGroup.whyDidYouRender = true;
export default memo(ItemGroupFormGroup)
