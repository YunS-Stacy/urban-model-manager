import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import { TUrbanModelItemData } from '.';

const ItemDataFormGroup = ({
  value,
  setValue,
  disabled,
}: {
  value: TUrbanModelItemData;
  setValue: (cb: TUrbanModelItemData) => void;
  disabled: boolean;
}) => {
  return (
    <>
      {(['version', 'services'] as (keyof TUrbanModelItemData)[]).map(key => (
        <Form.Group controlId={`data${key}`} key={key}>
          <Form.Label
            style={{
              textTransform: 'capitalize',
            }}
          >
            {key}
          </Form.Label>
          {typeof value[key] === 'string' ? (
            <Form.Control
              type="text"
              value={value[key] as string}
              readOnly={true}
            />
          ) : (
            (value[key] as typeof value['services']).map(
              ({ type, itemId }, i) => (
                <Form.Group
                  as={Form.Row}
                  controlId={`data${key}${type}`}
                  key={type}
                >
                  <Form.Label
                    style={{
                      textTransform: 'capitalize',
                      textAlign: 'right',
                    }}
                    column={true}
                    sm={2}
                  >
                    {type}
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      key={type}
                      type="text"
                      disabled={disabled}
                      value={itemId}
                      title={type}
                      onChange={(e: any) => {
                        const itemId = e.target.value;
                        const nextValue = {
                          ...value,
                          [key]: [
                            ...value[key as 'services'].slice(0, i),
                            {
                              type,
                              itemId,
                            },
                            ...value[key as 'services'].slice(i + 1),
                          ],
                        };

                        setValue(nextValue);
                      }}
                    />
                  </Col>
                </Form.Group>
              ),
            )
          )}
        </Form.Group>
      ))}
    </>
  );
};

export default ItemDataFormGroup;
