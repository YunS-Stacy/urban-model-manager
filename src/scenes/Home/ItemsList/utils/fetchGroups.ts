import { IGroup } from '@esri/arcgis-rest-types';
import { getUser } from '@esri/arcgis-rest-portal';

export default async function fetchGroups({ username = '' }) {
  if (!username) return null;
  const { groups } = await getUser(username);

  return groups as IGroup[];
}
