import React, { useState } from 'react';
import Layout, { Header, Body } from '../../components/Layout';
import {
  IdentityProvider,
  INITIAL_IDENTITY_CONTEXT,
} from '../contexts/IdentityContext';
import TopNavbar from './TopNavbar';

const Home = () => {
  const setIdentity = (cb: any) => {
    setIdentityState({ ...identityState, identity: cb });
  };

  const [identityState, setIdentityState] = useState({
    ...INITIAL_IDENTITY_CONTEXT,
    setIdentity,
  });

  return (
    <IdentityProvider value={identityState}>
      <Layout>
        <Header>
          <TopNavbar />
        </Header>
        <Body />
      </Layout>
    </IdentityProvider>
  );
};

export default Home;
