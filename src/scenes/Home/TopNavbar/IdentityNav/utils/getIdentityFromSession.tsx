import { UserSession } from "@esri/arcgis-rest-auth";
import { getPortal } from "@esri/arcgis-rest-portal";

export default async function getIdentityFromSession(session: UserSession){
  const user = await session.getUser();
  const { name, urlKey, customBaseUrl } = await getPortal('', {
    authentication: session,
  });

  const org = {
    name,
    url: `${urlKey}.${customBaseUrl}`,
  };
  return {
    user, org, session
  }
}