import React from 'react';
import styled from 'styled-components';

import { TLayoutFC } from '..';

const StyledBody = styled.div`
  flex: 0 0 auto;
  pointer-events: all;
  justify-content: center;
  display: flex;
`;

const Body: React.FC<TLayoutFC> = ({ style, children }) => {
  return <StyledBody style={style}>{children}</StyledBody>;
};

export default Body;
