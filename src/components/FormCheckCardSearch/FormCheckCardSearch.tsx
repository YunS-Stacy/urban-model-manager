import React, { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import FormCheck from 'react-bootstrap/FormCheck';

import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

import { divideItemsByQuery } from './utils/divideItemsByQuery';
import { sortItemsByQuery } from './utils/sortItemsByQuery';
import { flattenArrays } from './utils/flattenArrays';
import { IGroup } from '@esri/arcgis-rest-types';

interface IFormCheckCardSearch<T = IGroup> {
  values: T[];
  queryField: string;
  idField: string;
  title: string;
  itemTitleStyle?: React.CSSProperties;
  selected?: T[];
  eventKey?: string;
  onSelect: (payload: T[]) => void;
  disabled?: boolean;
}
const FormCheckCardSearch = ({
  values,
  queryField,
  idField,
  title,
  itemTitleStyle,
  selected = [],
  eventKey,
  onSelect,
  disabled = false,
}: IFormCheckCardSearch<any>) => {
  const [query, setQuery] = React.useState('');
  const [sortedValues, setSortedValues] = React.useState(values);

  React.useEffect(() => {
    setSortedValues(values);
  }, [values]);

  React.useEffect(() => {
    if (!queryField) return;
    
    if (!query) {
      setSortedValues(values);
    } else {
      const newSorted = flattenArrays(
        divideItemsByQuery(sortedValues, query, queryField).map((el) =>
          sortItemsByQuery(el, queryField),
        ),
      );

      setSortedValues(newSorted);
    }
  }, [query, queryField]);

  React.useEffect(() => {
    onSelect(selected);

    if (!checkRef.current) return;
    if (selected.length > 0 && selected.length < values.length) {
      checkRef.current.indeterminate = true;
    } else {
      checkRef.current.indeterminate = false;
    }
  }, [selected && selected.length]);

  const checkRef = useRef(null as null | HTMLInputElement);

  return (
    <div style={{ display: 'flex', marginLeft: '1.25rem' }}>
      <input
        ref={checkRef}
        type="checkbox"
        className="form-check-input"
        disabled={disabled || !values}
        checked={selected.length > 0}
        onChange={() => {
          onSelect(selected.length === 0 ? sortedValues : []);
        }}
      />
      <Accordion style={{ flex: '1 1 auto', marginLeft: '1rem' }}>
        <Card>
          <Card.Header>
            <Accordion.Toggle
              as={Button}
              variant="link"
              size="small"
              eventKey={eventKey || '0'}
              disabled={disabled}
            >
              <div>{title}</div>
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey={eventKey || '0'}>
            <Card.Body style={{ maxHeight: '10rem', overflowY: 'scroll' }}>
              {sortedValues && (
                <>
                  <FormControl
                    placeholder="Search"
                    type="text"
                    onChange={(e: any) => setQuery(e.target.value)}
                  />
                  {sortedValues.map((el) => (
                    <FormCheck
                      label={el[queryField]}
                      style={itemTitleStyle}
                      key={el[idField]}
                      readOnly={true}
                      checked={selected.some(
                        ({ [idField]: origin }) => origin === el[idField],
                      )}
                      onClick={() => {
                        const itemId = selected.findIndex(
                          ({ [idField]: origin }) => origin === el[idField],
                        );
                        return onSelect(
                          itemId === -1
                            ? [...selected, el]
                            : [
                                ...selected.slice(0, itemId),
                                ...selected.slice(itemId + 1),
                              ],
                        );
                      }}
                    />
                  ))}
                </>
              )}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default FormCheckCardSearch;
