import { createContext } from 'react';
import { IUser, UserSession } from '@esri/arcgis-rest-auth';
export const INITIAL_IDENTITY_CONTEXT: {
  identity: {
    user: IUser,
    org: {
      name: string,
      url: string,
    },
    session: UserSession
  } | null;
  setIdentity: (cb?: any) => void;
} = {
  identity: null,
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
