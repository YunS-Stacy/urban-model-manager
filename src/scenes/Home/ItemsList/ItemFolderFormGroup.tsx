import React from 'react';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import { IFolder } from '.';

interface IItemFolderFormGroup {
  values?: IFolder[] | null;
  disabled: boolean;
  value?: IFolder | null;
  setValueFn: (cb: IFolder['id']) => void;
}

const ItemFolderFormGroup = ({
  value,
  values,
  disabled = false,
  setValueFn,
}: IItemFolderFormGroup) => {
  return !values ? null : (
    <FormGroup>
      <FormLabel>Folders</FormLabel>
      <FormControl
        as="select"
        disabled={disabled}
        value={(value && value.id) || ''}
        onChange={(e: any) => setValueFn(e.target.value)}
      >
        {values.map((v) => (
          <option key={v.id || 'default'} value={v.id || 'default'}>
            {v.title}
          </option>
        ))}
      </FormControl>
    </FormGroup>
  );
};

export default ItemFolderFormGroup;
