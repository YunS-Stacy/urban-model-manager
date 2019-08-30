import { request } from '@esri/arcgis-rest-request';

export default async function fetchFolders({ portalUrl = '', username = '' }) {
  if (!(portalUrl || username)) return null;
  const { folders } = await request(
    `https://${portalUrl}/sharing/rest/content/users/${username}?f=json`,
  );

  return folders as any[]
}
