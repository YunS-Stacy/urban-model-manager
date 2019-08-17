import { createContext } from 'react';
export const INITIAL_IDENTITY_CONTEXT: {
  identity: any;
  setIdentity: (cb?: any) => void;
} = {
  identity: null as any,
  setIdentity: () => null,
};

const IdentityContext: React.Context<
  typeof INITIAL_IDENTITY_CONTEXT
> = createContext(INITIAL_IDENTITY_CONTEXT);

export const {
  Provider: IdentityProvider,
  Consumer: IdentityConsumer,
} = IdentityContext;

export default IdentityContext;
