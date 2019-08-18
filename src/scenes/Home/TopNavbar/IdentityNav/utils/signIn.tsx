import { UserSession } from '@esri/arcgis-rest-auth';

export const OAUTH_CONFIG = {
  portal: `https://${process.env.REACT_APP_PORTAL}/sharing/rest`,
  clientId: process.env.REACT_APP_ID as string,
  redirectUri: window.location.origin,
};

export default async function signIn() {
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
