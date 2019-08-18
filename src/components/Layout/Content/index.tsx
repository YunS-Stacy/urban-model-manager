import React from 'react';
import styled from 'styled-components';

import { TLayoutFC } from '..';

const StyledContent = styled.div`
  flex: 1 1 auto;
  padding: 2rem;
  max-width: 80vw;
  overflow-y: auto;
  max-height: calc(100vh - 10rem);
`;

const Content: React.FC<TLayoutFC> = ({ style, children }) => {
  return <StyledContent style={style}>{children}</StyledContent>;
};

export default Content;
