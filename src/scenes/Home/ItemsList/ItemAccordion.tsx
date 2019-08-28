import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import ItemForm from './ItemForm';
import { IItemsListChild, IAppItem } from '.';
import { IItem } from '@esri/arcgis-rest-types';

interface IItemAccordion<T = IAppItem> extends IItemsListChild<T> {
  values?: T[] | null;
  submitFn: (cb: any) => void;
  deleteFn: (cb: IItem['id']) => void;
  children?: React.ReactNode;
}

const ItemAccordion = ({
  values,
  value,
  setValueFn,
  submitFn,
  deleteFn,
  children,
}: IItemAccordion) => {
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
                  >
                    {children}
                  </ItemForm>
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
