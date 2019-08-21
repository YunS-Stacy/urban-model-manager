import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import styled from 'styled-components';

export type TAppPagination<T = ((...cb: any) => void) | null> = {
  prevFn?: T;
  nextFn?: T;
  pageFn?: T;
  pageCount?: number;
  activePage?: number;
};

const StyledAppPagination = styled(Pagination)`
  display: flex;
  justify-content: center;
  margin: .8rem 0;
`

const AppPagination = ({
  prevFn = null,
  nextFn = null,
  pageFn = null,
  pageCount = 0,
  activePage = 0,
}: TAppPagination) => {
  return pageCount > 0 ? (
    <StyledAppPagination style={{ display: 'flex', justifyContent: 'center' }}>
      {prevFn && <Pagination.Prev onClick={prevFn} />}
      {pageCount > 0
        ? Array(pageCount)
            .fill(0)
            .map((_, i) => (
              <Pagination.Item
                active={activePage === i}
                disabled={!pageFn}
                onClick={() => pageFn && pageFn(i)}
                key={`pagination-${i}`}
              >
                {i + 1}
              </Pagination.Item>
            ))
        : null}
      {nextFn && <Pagination.Next onClick={nextFn} />}
    </StyledAppPagination>
  ) : null;
};

export default AppPagination;
