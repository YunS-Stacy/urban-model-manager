import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

// @ts-ignore
import PenIcon from 'calcite-ui-icons-react/PenIcon';
// @ts-ignore
import TrashIcon from 'calcite-ui-icons-react/TrashIcon';

// Types
import { TUrbanModelItemData } from '.';
// Componnets
import ItemDataFormGroup from './ItemDataFormGroup';

type TItemForm<T = TUrbanModelItemData> = {
  value: T;
  updating: boolean;
  submitFn: (cb: T) => void;
  deleteFn: any;
};
const ItemForm: React.FC<TItemForm> = ({
  value,
  updating,
  submitFn,
  deleteFn,
}) => {
  const [disabled, setDisabled] = useState(true);
  const [nValue, setNValue] = useState(value);

  return (
    <Form>
      <ButtonToolbar style={{ justifyContent: 'flex-end' }}>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="edit-icon">Edit</Tooltip>}
        >
          <Button variant="link" onClick={() => setDisabled((s) => !s)}>
            <PenIcon />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="trash-icon">Delete</Tooltip>}
        >
          <Button variant="link" onClick={deleteFn}>
            <TrashIcon />
          </Button>
        </OverlayTrigger>
      </ButtonToolbar>
      <ItemDataFormGroup
        value={nValue}
        setValue={setNValue}
        disabled={disabled || updating}
      />
      {!disabled && (
        <ButtonToolbar style={{ justifyContent: 'flex-end' }}>
          <Button
            disabled={updating}
            variant="primary"
            type="submit"
            onClick={() => {
              submitFn(nValue);
            }}
          >
            {updating ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              'Update'
            )}
          </Button>
          <Button
            disabled={updating}
            variant="light"
            onClick={() => {
              setNValue(value);
              setDisabled(true);
            }}
          >
            Cancel
          </Button>
        </ButtonToolbar>
      )}
    </Form>
  );
};
export default ItemForm;
