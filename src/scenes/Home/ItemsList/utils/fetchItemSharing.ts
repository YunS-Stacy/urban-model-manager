import { request } from '@esri/arcgis-rest-request';
import { IItem, IGroup } from '@esri/arcgis-rest-types';

export default async function fetchItemSharing({
  portalUrl = '',
  username = '',
  itemId = '',
}) {
  if (!(portalUrl || username || itemId)) return null;

  const { sharing }: {
    sharing: {
      access: 'private' | 'public' | 'org' | 'shared';
      groups: IGroup['string'][];
    };
    item: IItem;
  } = await request(
    `https://${portalUrl}/sharing/rest/content/users/${username}/items/${itemId}?f=json`,
  );

  return sharing;
}
