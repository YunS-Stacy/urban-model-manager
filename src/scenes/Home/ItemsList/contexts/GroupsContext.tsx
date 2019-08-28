import { createContext } from 'react';
import { IGroup } from '@esri/arcgis-rest-types';

const GroupsContext = createContext(null as null | IGroup[]);

export const {
  Provider: GroupsProvider,
  Consumer: GroupsConsumer,
} = GroupsContext;

export default GroupsContext;
