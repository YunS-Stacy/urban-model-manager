import { AGOLSharingOption } from '..';
import { request } from '@esri/arcgis-rest-request';

export default async function unshareItem({
  itemId = '',
  groups,
  portalUrl = '',
  username = '',
}: {
  itemId?: string;
  groups: AGOLSharingOption['groups'];
  portalUrl?: string;
  username?: string;
}) {
  if (!portalUrl || !username || !itemId) return;

  return await request(
    `https://${portalUrl}/sharing/rest/content/users/${username}/unshareItems`,
    {
      params: {
        f: 'json',
        items: itemId,
        groups,
      },
    },
  );
}
