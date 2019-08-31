import React, { useState, forwardRef, useEffect, memo } from 'react';
import Popover, { PopoverProps } from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl, { FormControlProps } from 'react-bootstrap/FormControl';

const UpdatingPopover = forwardRef<Popover, any>(
  ({ scheduleUpdate, children, ...props }, ref) => {
    useEffect(() => {
      console.log('updating!');
      scheduleUpdate();
    }, [children, scheduleUpdate]);
    return (
      <Popover ref={ref as any} {...props}>
        {children}
      </Popover>
    );
  },
);

const PopoverListGroup = memo(
  ({
    values = [],
    setValueFn,
  }: {
    values: { id: string; title: string; [key: string]: any }[];
    setValueFn?: any;
  }) => {
    console.log(values, 'valuse');
    const [query, setQuery] = useState('');

    const filteredItems = values
      .filter(({ title }) => title.toUpperCase().includes(query.toUpperCase()))
      .sort((a, b) => (a > b ? -1 : 1));

    return (
      <Popover.Content as={ListGroup}>
        <InputGroup>
          <FormControl
            placeholder="Enter text..."
            aria-label="search-query"
            aria-describedby="basic-addon2"
            onChange={(e: any) => setQuery(e.target.value)}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary">Search</Button>
          </InputGroup.Append>
        </InputGroup>
        {filteredItems.map((v) => (
          <ListGroup.Item
            key={v.id}
            action={true}
            onClick={() => setValueFn && setValueFn(v)}
            as={Button}
          >
            {v.title}
          </ListGroup.Item>
        ))}
      </Popover.Content>
    );
  },
);

interface IInputPopover<
  T = {
    title: string;
    id: string;
    [key: string]: any;
  }
> {
  disabled?: boolean;
  value?: FormControlProps['value'];
  setValueFn?: (cb: T) => void;
  values?: T[];
}

const InputPopover = ({
  disabled = false,
  values = [],
  value = '',
  setValueFn = (_) => null,
}: IInputPopover) => {
  return (
    <InputGroup>
      <FormControl
        disabled={disabled}
        placeholder="Enter text..."
        aria-label="popover-query"
        aria-describedby="popover-query"
        value={value}
        onChange={(e: any) => setValueFn(e.target.value)}
      />
      <OverlayTrigger
        trigger="click"
        placement="right"
        overlay={
          <UpdatingPopover id="list">
            <PopoverListGroup values={values} setValueFn={setValueFn} />
          </UpdatingPopover>
        }
      >
        <InputGroup.Append>
          <Button variant="light" disabled={disabled}>
            Search
          </Button>
        </InputGroup.Append>
      </OverlayTrigger>
    </InputGroup>
  );
};

export default InputPopover;
