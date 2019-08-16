import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Body from './Body';

const StyledLayout = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  pointer-events: none;

  display: flex;
  flex-direction: column;
`;

export type TLayoutFC = React.PropsWithChildren<{
  style?: React.CSSProperties;
}>;

const Layout: React.FC<TLayoutFC> = ({ children, style }) => {
  return <StyledLayout style={style}>{children}</StyledLayout>;
};

export { Body, Header, Layout };

export default Layout;
