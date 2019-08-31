import { createContext } from 'react';
import { IGroup } from '@esri/arcgis-rest-types';
import { IFolder } from '..';


type TAccessContext = {
  groups: null | IGroup[];
  folders: null | IFolder[];
};

const AccessContext = createContext({
  groups: null,
  folders: null,
} as TAccessContext);

export const {
  Provider: AccessProvider,
  Consumer: AccessConsumer,
} = AccessContext;

export default AccessContext;
