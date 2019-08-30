import React, { useContext } from 'react';
import FormCheck from 'react-bootstrap/FormCheck';
import { IGroup } from '@esri/arcgis-rest-types';
import FormLabel from 'react-bootstrap/FormLabel';
import IdentityContext from '../../../contexts/IdentityContext';
import AccessContext from '../contexts/AccessContext';
import ItemGroupFormGroup from './ItemGroupFormGroup';
import { AGOLSharingOption } from '..';

type TItemSharingDiv = {
  value: AGOLSharingOption;
  disabled: boolean;
  setValueFn: (cb: AGOLSharingOption) => void;
};
const ItemSharingDiv = ({ value, disabled, setValueFn }: TItemSharingDiv) => {
  const { identity } = useContext(IdentityContext);

  const { groups } = useContext(AccessContext);

  const handleUpdateGroups = (groups: IGroup['id'][]) => {
    setValueFn({
      ...value,
      groups,
    });
  };

  return (
    <div>
      <FormLabel>Share</FormLabel>
      <FormCheck
        disabled={disabled}
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
        disabled={disabled}
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
        values={groups || []}
        disabled={disabled}
        setValueFn={handleUpdateGroups}
      />
    </div>
  );
};

export default ItemSharingDiv;
