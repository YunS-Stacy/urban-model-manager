import React, { useState } from 'react';
import Layout, { Header, Body } from '../../components/Layout';
import { IdentityProvider } from '../contexts/IdentityContext';
import TopNavbar from './TopNavbar';

const INITIAL_STATE = { user: null, portal: null };
const Home = () => {
  const [{ user, portal }, setIdentity] = useState(INITIAL_STATE);
  return (
    <IdentityProvider value={{ user, portal }}>
      <Layout>
        <Header>
          <TopNavbar
            signInFn={(cb) => setIdentity(cb)}
            signOutFn={() => setIdentity(INITIAL_STATE)}
          />
        </Header>
        <Body />
      </Layout>
    </IdentityProvider>
  );
};

export default Home;
