import React from 'react';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import { IItemsListChild } from '../scenes/Home/ItemsList';



interface AGOLFolderItem {
  id: string;
  title: string;
}

interface IItemFolderFormGroup<T = AGOLFolderItem> extends IItemsListChild<T> {
  values?: T[] | null;
};

const ItemFolderFormGroup = ({
  value,
  values,
  disabled = false,
  setValueFn,
}: IItemFolderFormGroup) => {
  return !values ? null : (
    <FormGroup>
      <FormLabel>Folders</FormLabel>
      <FormControl as="select" disabled={disabled}>
        {values.map((v) => (
          <option
            key={v.id}
            disabled={v.id === (value && value.id)}
            value={v.id}
            onSelect={() => setValueFn(v)}
          >
            {v.title}
          </option>
        ))}
      </FormControl>
    </FormGroup>
  );
};

export default ItemFolderFormGroup;
