import React, { memo } from 'react';

import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Spinner from 'react-bootstrap/Spinner';
import styled from 'styled-components';

interface IItemCardFooter {
  disabled: boolean;
  okFn: () => void;
  cancelFn: () => void;
  okTitle?: string;
  cancelTitle?: string;
}

const StyledItemCardFooter = styled(ButtonToolbar)`
  justify-content: flex-end;
  padding: 2rem 0;
`;
const ItemCardFooter = ({
  disabled,
  okFn,
  cancelFn,
  okTitle = 'Update',
  cancelTitle = 'Cancel',
}: IItemCardFooter) => {
  return (
    <StyledItemCardFooter>
      <Button
        disabled={disabled}
        variant="primary"
        type="submit"
        onClick={okFn}
      >
        {disabled ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        ) : (
          okTitle
        )}
      </Button>
      <Button disabled={disabled} variant="light" onClick={cancelFn}>
        {cancelTitle}
      </Button>
    </StyledItemCardFooter>
  );
};

ItemCardFooter.whyDidYouRender = true;

export default memo(ItemCardFooter);
