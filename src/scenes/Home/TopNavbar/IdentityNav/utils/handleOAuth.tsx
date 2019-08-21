import { UserSession } from '@esri/arcgis-rest-auth';
import { APP_PORTAL, APP_ID } from '../../../../../constants/app';

export const OAUTH_CONFIG = {
  portal: `https://${APP_PORTAL}/sharing/rest`,
  clientId: APP_ID as string,
  redirectUri: window.location.origin,
};

export default async function handleOAuth() {
  let session;
  try {
    session = UserSession.completeOAuth2({
      ...OAUTH_CONFIG,
      popup: false,
    });
  } catch (error) {
    UserSession.beginOAuth2({
      ...OAUTH_CONFIG,
      popup: false,
    });
  }

  return session;
}
