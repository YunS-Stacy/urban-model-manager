import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import ItemForm from './ItemForm';
import {
  IItemsListChild,
  IAppItem,
  AGOLSharingOption,
  TUrbanModelItemData,
} from '.';
import { IItem } from '@esri/arcgis-rest-types';
import { INITIAL_SHARING_OPTION } from './contexts/AccessContext';

interface IItemAccordion<T = IAppItem> extends IItemsListChild<T> {
  values?: T[] | null;
  defaultSharing: AGOLSharingOption;
  submitFn: (
    cb: TUrbanModelItemData,
    sharingOption: AGOLSharingOption,
    folderId: string,
  ) => void;
  deleteFn: (cb: IItem['id']) => void;
}

const ItemAccordion = ({
  values,
  value,
  setValueFn,
  submitFn,
  deleteFn,
  defaultSharing,
}: IItemAccordion) => {
  const [folderId, setFolderId] = useState((value && value.ownerFolder) || '');
  const [sharingOption, setSharingOption] = useState(
    defaultSharing || INITIAL_SHARING_OPTION,
  );  

  useEffect(() => {
    setFolderId((value && value.ownerFolder) || '');
    setSharingOption(defaultSharing || INITIAL_SHARING_OPTION);
  }, [value && value.id]);

  const handleDelete = () => deleteFn((value && value.id) as string);

  return !values ? null : (
    <Accordion activeKey={(value && value.id) || ''}>
      {values.map((v) => (
        <Card key={v.id}>
          <Card.Header>
            <Accordion.Toggle
              as={Button}
              variant="link"
              eventKey={v.id}
              onClick={() =>
                (value && value.id) === v.id
                  ? // Toggle off
                    setValueFn({
                      ...v,
                      id: '',
                      content: null,
                      loading: false,
                      updating: false,
                    })
                  : // Switch
                    setValueFn(v)
              }
            >
              {v.title}
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey={v.id}>
            <Card.Body>
              {value && value.loading ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Spinner animation="border" />
                </div>
              ) : (
                value &&
                value.text && (
                  <ItemForm
                    value={value.text}
                    updating={value.updating}
                    submitFn={submitFn}
                    deleteFn={handleDelete}
                    sharingOption={sharingOption}
                    setSharingFn={(cb) => setSharingOption(cb)}
                    folderId={folderId}
                    setFolderFn={(cb) => setFolderId(cb)}
                  />
                )
              )}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      ))}
    </Accordion>
  );
};

export default React.memo(ItemAccordion);
