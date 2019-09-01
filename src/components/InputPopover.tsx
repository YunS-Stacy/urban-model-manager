import React, { forwardRef, useEffect, memo } from 'react';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl, { FormControlProps } from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import AppPagination, { TAppPagination } from './AppPagination';
import { IItem } from '@esri/arcgis-rest-types';

const UpdatingPopover = forwardRef<Popover, any>(
  ({ scheduleUpdate, children, ...props }, ref) => {
    useEffect(() => {
      scheduleUpdate();
    }, [children, scheduleUpdate]);
    return (
      <Popover ref={ref as any} {...props}>
        {children}
      </Popover>
    );
  },
);

interface IPopoverListGroup<
  V = any,
  O = { id: string; title: string; [key: string]: any }
> extends TAppPagination {
  query?: string;
  setQueryFn?: (cb: string) => void;
  setValueFn?: (cb: V) => void;
  values?: V[];
  option?: O;
  options?: O[];
  setOptionFn?: (cb: O) => void;
}

const PopoverListGroup = memo(
  ({
    query,
    setQueryFn,
    values = [],
    setValueFn,
    option,
    options,
    setOptionFn,
    prevFn,
    nextFn,
    pageFn,
    activePage,
    pageCount,
  }: IPopoverListGroup) => {
    const filteredItems = values.sort((a, b) => (a > b ? -1 : 1));

    return (
      <Popover.Content as={ListGroup}>
        {setQueryFn && (
          <InputGroup>
            <FormControl
              placeholder="Enter text..."
              aria-label="search-query"
              aria-describedby="basic-addon"
              value={query}
              onChange={(e: any) => setQueryFn(e.target.value)}
            />
            {option && options && (
              <InputGroup.Append>
                <DropdownButton id="dropdown-basic-button" title={option.title} variant="light">
                  {options.map((s) => (
                    <Dropdown.Item
                      key={s.id}
                      href={`#/action-${s.id}`}
                      style={{ textTransform: 'capitalize' }}
                      onClick={() => setOptionFn && setOptionFn(s)}
                      disabled={option.id === s.id}
                    >
                      {s.title}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </InputGroup.Append>
            )}
          </InputGroup>
        )}
        {filteredItems.length > 0 ? (
          filteredItems.map((v) => (
            <ListGroup.Item
              key={v.id}
              action={true}
              onClick={() => setValueFn && setValueFn(v)}
              as={Button}
            >
              {v.title}
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item as={Button} disabled={true}>
            No results
          </ListGroup.Item>
        )}
        {activePage && (
          <AppPagination
            prevFn={prevFn}
            nextFn={nextFn}
            pageFn={pageFn}
            activePage={activePage}
            pageCount={pageCount}
          />
        )}
      </Popover.Content>
    );
  },
);

export interface IInputPopover extends IPopoverListGroup {
  disabled?: boolean;
  value: FormControlProps['value'];
  setValueFn: (cb: FormControlProps['value']) => void;
}

const InputPopover = ({
  disabled = false,
  value = '',
  setValueFn = (_) => null,
  ...rest
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
        rootClose={true}
        overlay={
          <UpdatingPopover id="list">
            <PopoverListGroup
              {...rest}
              setValueFn={(v: IItem) => setValueFn(v.id)}
            />
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
