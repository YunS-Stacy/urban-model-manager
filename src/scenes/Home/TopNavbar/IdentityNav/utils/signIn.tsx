import { UserSession } from "@esri/arcgis-rest-auth";

const OAUTH_CONFIG = {
  portal: `https://${process.env.APP_PORTAL}`,
  clientId: process.env.APP_ID as string,
};

export default function signIn() {
  console.log('sign in ');
  
  UserSession.beginOAuth2({
    ...OAUTH_CONFIG,
    redirectUri: window.location.href,
    popup: false,
  });
}