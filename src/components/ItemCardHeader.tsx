import React, { memo } from 'react';

import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

// @ts-ignore
import PenIcon from 'calcite-ui-icons-react/PenIcon';
// @ts-ignore
import TrashIcon from 'calcite-ui-icons-react/TrashIcon';

interface IItemCardHeader {
  disabled?: boolean;
  editFn: () => void;
  deleteFn: () => void;
}
const ItemCardHeader = ({ disabled = false, editFn, deleteFn }: IItemCardHeader) => {
  return (
    <ButtonToolbar style={{ justifyContent: 'flex-end' }}>
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id="edit-icon">Edit</Tooltip>}
      >
        <Button variant="link" disabled={disabled} onClick={editFn}>
          <PenIcon />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id="trash-icon">Delete</Tooltip>}
      >
        <Button variant="link" disabled={disabled} onClick={deleteFn}>
          <TrashIcon />
        </Button>
      </OverlayTrigger>
    </ButtonToolbar>
  );
};

ItemCardHeader.whyDidYouRender = true

export default memo(ItemCardHeader);
