import { AGOLSharingOption } from '..';
import { request } from '@esri/arcgis-rest-request';

export default async function shareItem({
  itemId = '',
  sharingOption,
  portalUrl = '',
  username = '',
}: {
  itemId?: string;
  sharingOption: AGOLSharingOption;
  portalUrl?: string;
  username?: string;
}) {
  if (!portalUrl || !username || !itemId) return;  
  return await request(
    `https://${portalUrl}/sharing/rest/content/users/${username}/shareItems`,
    {
      params: {
        f: 'json',
        items: itemId,
        ...sharingOption,
      },
    },
  );
}
