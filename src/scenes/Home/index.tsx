import React, { useState } from 'react';
import { setDefaultRequestOptions } from '@esri/arcgis-rest-request';

import Layout, { Header, Body, Content } from '../../components/Layout';
import {
  IdentityProvider,
  INITIAL_IDENTITY_CONTEXT,
} from '../contexts/IdentityContext';
import TopNavbar from './TopNavbar';
import ItemsList from './ItemsList';

const Home = () => {
  const setIdentity = (cb: any) => {
    if (cb && cb.session) {
      setDefaultRequestOptions({
        authentication: cb.session,
      });
    }

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
        <Body>
          <Content>
            <ItemsList />
          </Content>
        </Body>
      </Layout>
    </IdentityProvider>
  );
};

export default Home;
