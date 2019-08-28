import React, { useContext } from 'react';
import { IItemsListChild, AGOLSharingOption } from '.';
import IdentityContext from '../../contexts/IdentityContext';
import FormCheck from 'react-bootstrap/FormCheck';
import ItemGroupFormGroup from './ItemGroupFormGroup';
import { IGroup } from '@esri/arcgis-rest-types';
import FormLabel from 'react-bootstrap/FormLabel';

interface IItemSharingDiv<T = AGOLSharingOption> extends IItemsListChild<T> {
  value: T;
}
const ItemSharingDiv = ({ value, setValueFn }: IItemSharingDiv) => {
  const { identity } = useContext(IdentityContext);
  const handleUpdateGroups = (groups: IGroup['id'][]) => {
    setValueFn({
      ...value,
      groups,
    });
  };
  return !value ? null : (
    <div>
      <FormLabel>Share</FormLabel>
      <FormCheck
        readOnly={true}
        checked={value.everyone}
        onClick={() =>
          setValueFn({
            ...value,
            everyone: !value.everyone,
          })
        }
        label={'Everyone (public)'}
      />
      <FormCheck
        readOnly={true}
        checked={value.account}
        onClick={() =>
          setValueFn({
            ...value,
            account: !value.account,
          })
        }
        label={
          (identity && identity.org && identity.org.name) || 'Organization'
        }
      />
      <ItemGroupFormGroup
        value={value.groups}
        setValueFn={handleUpdateGroups}
      />
    </div>
  );
};

export default ItemSharingDiv;
