import { createContext } from 'react';
import { IFolder } from '..';


type TAccessContext = {
  folders: null | IFolder[];
};

const AccessContext = createContext({
  folders: null,
} as TAccessContext);

export const {
  Provider: AccessProvider,
  Consumer: AccessConsumer,
} = AccessContext;

export default AccessContext;
