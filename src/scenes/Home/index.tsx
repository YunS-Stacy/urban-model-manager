import React, { useState } from 'react';
import Layout, { Header, Body } from '../../components/Layout';
import { IdentityProvider, DEFAULT_IDENTITY_CONTEXT } from '../contexts/IdentityContext';
import TopNavbar from './TopNavbar';


const Home = () => {
   
    const setIdentity = (cb: any) => {
      setIdentityState({ ...identity, ...cb });
    };
  
    const [identity, setIdentityState] = useState({
      ...DEFAULT_IDENTITY_CONTEXT,
      setIdentity,
    });
 
  return (
    <IdentityProvider value={identity}>
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
