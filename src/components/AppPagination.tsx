import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import styled from 'styled-components';

export type TAppPagination<T = ((...cb: any) => void) | null> = {
  prevFn?: T;
  nextFn?: T;
  pageFn?: T;
  pageCount?: number;
  activePage?: number;
  [key: string]: any;
};

const StyledAppPagination = styled(Pagination)`
  display: flex;
  justify-content: center;
  margin: 0.8rem 0;
`;

const AppPagination = ({
  prevFn = null,
  nextFn = null,
  pageFn = null,
  pageCount = 0,
  activePage = 0,
}: TAppPagination) => {
  const pageIds = Array(pageCount)
    .fill(0)
    .map((_, i) => i + 1);
  const updatePageIds =
    pageCount > 5
      ? [
          ...pageIds.slice(0, 2),
          ...(pageIds.slice(0, 2).includes(activePage + 1) ? ['...'] : ['...', activePage + 1]),
          ...(pageIds.slice(-2).includes(activePage + 1) ? [] : ['...']),
          ...pageIds.slice(-2),
        ]
      : pageIds;
  
  return pageCount > 0 ? (
    <StyledAppPagination style={{ display: 'flex', justifyContent: 'center' }}>
      {prevFn && <Pagination.Prev onClick={prevFn} />}
      {pageCount > 0
        ? updatePageIds.map((s, i) => (
            <Pagination.Item
              active={activePage + 1 === s}
              disabled={!pageFn || s === '...'}
              onClick={() => pageFn && pageFn(i)}
              key={`pagination-${i}`}
            >
              {s}
            </Pagination.Item>
          ))
        : null}
      {nextFn && <Pagination.Next onClick={nextFn} />}
    </StyledAppPagination>
  ) : null;
};

export default AppPagination;
