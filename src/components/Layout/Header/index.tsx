import React from 'react';
import styled from 'styled-components';

import { TLayoutFC } from '..';

const StyledHeader = styled.div`
  flex: 0 0 auto;
  pointer-events: all;
`;

const Header: React.FC<TLayoutFC> = ({ style, children }) => {
  return <StyledHeader style={style}>{children}</StyledHeader>;
};

export default Header;
