import { createContext } from 'react';
import { UserSession, IUser } from '@esri/arcgis-rest-auth';
import { IPortal} from '@esri/arcgis-rest-portal';


export const DEFAULT_IDENTITY_CONTEXT: {
  identity: any;
  setIdentity: (cb?: any) => void;
} = {
  identity: null as any,
  setIdentity: () => null,
}
const IdentityContext: React.Context<typeof DEFAULT_IDENTITY_CONTEXT> = createContext(
  DEFAULT_IDENTITY_CONTEXT,
);

export const {
  Provider: IdentityProvider,
  Consumer: IdentityConsumer,
} = IdentityContext;

export default IdentityContext;