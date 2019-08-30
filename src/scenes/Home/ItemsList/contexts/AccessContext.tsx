import { createContext } from 'react';
import { IGroup } from '@esri/arcgis-rest-types';
import { AGOLSharingOption } from '..';

export const INITIAL_SHARING_OPTION: AGOLSharingOption = {
  groups: [],
  account: false,
  everyone: false,
};
type TAccessContext = {
  groups: null | IGroup[];
  sharingOption: AGOLSharingOption;
};

const AccessContext = createContext({
  groups: null,
  sharingOption: INITIAL_SHARING_OPTION,
} as TAccessContext);

export const {
  Provider: AccessProvider,
  Consumer: AccessConsumer,
} = AccessContext;

export default AccessContext;
