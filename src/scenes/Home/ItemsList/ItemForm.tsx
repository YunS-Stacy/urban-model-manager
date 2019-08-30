import React, { useState, memo, useContext } from 'react';
import Form from 'react-bootstrap/Form';
// Types
import { TUrbanModelItemData, AGOLSharingOption, IFolder } from '.';
// Componnets
import ItemDataFormGroup from '../../../components/ItemDataFormGroup';
import ItemCardFooter from '../../../components/ItemCardFooter';
import ItemCardHeader from '../../../components/ItemCardHeader';
import ItemFolderFormGroup from './ItemFolderFormGroup';
import FolderContext from './contexts/FolderContext';
import ItemSharingDiv from './ItemSharingDiv';

type TItemForm<T = TUrbanModelItemData> = {
  value: T;
  updating?: boolean;
  submitFn: (cb: T, sharingOption: AGOLSharingOption, folderId: string) => void;
  deleteFn: any;
  children?: React.ReactNode;
  sharingOption: AGOLSharingOption;
  setSharingFn: (cb: AGOLSharingOption) => void;
  folderId: IFolder['id'];
  setFolderFn: (cb: IFolder['id']) => void;
};

const ItemForm = ({
  value,
  updating = false,
  submitFn,
  deleteFn,
  sharingOption,
  setSharingFn,
  folderId,
  setFolderFn,
}: TItemForm) => {
  const [disabled, setDisabled] = useState(true);
  const [nValue, setNValue] = useState(value);

  const { folders } = useContext(FolderContext);

  return (
    <Form>
      <ItemCardHeader
        disabled={updating}
        deleteFn={deleteFn}
        editFn={() => setDisabled((s) => !s)}
      />
      <ItemDataFormGroup
        value={nValue}
        setValue={setNValue}
        disabled={disabled || updating}
      />
      <ItemFolderFormGroup
        disabled={disabled || updating}
        values={folders}
        value={folders && folders.find(({ id }) => id === folderId)}
        setValueFn={(cb) => setFolderFn(cb)}
      />
      <ItemSharingDiv
        value={sharingOption}
        setValueFn={setSharingFn}
        disabled={updating || disabled}
      />
      {!disabled && (
        <ItemCardFooter
          disabled={updating}
          okFn={() => {
            submitFn(nValue, sharingOption, folderId);
          }}
          cancelFn={() => {
            setNValue(value);
            setDisabled(true);
          }}
        />
      )}
    </Form>
  );
};

// ItemForm.whyDidYouRender = true;

export default memo(ItemForm);
