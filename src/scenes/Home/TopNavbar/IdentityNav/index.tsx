import React, { useContext, useEffect } from 'react';
import { UserSession } from '@esri/arcgis-rest-auth';

import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// Context
import IdentityContext, {
  INITIAL_IDENTITY_CONTEXT,
} from '../../../contexts/IdentityContext';
// Constants
import { SESSION_KEY } from '../../../../constants/session';
// Utils
import getIdentityFromSession from './utils/getIdentityFromSession';
import handleOAuth, { OAUTH_CONFIG } from './utils/handleOAuth';

async function getIdentity() {
  const storageItem = localStorage.getItem(SESSION_KEY);
  if (storageItem !== null) {
    const session = UserSession.deserialize(storageItem);
    // Check date
    if (session.tokenExpires < new Date()) {
      localStorage.removeItem(SESSION_KEY);
      const session = await handleOAuth();
      if (session) {
        window.localStorage.setItem(SESSION_KEY, session.serialize());
        return await getIdentityFromSession(session);
      }
    } else {
      return await getIdentityFromSession(session);
    }
  } else {
    const session = await handleOAuth();
    if (session) {
      window.localStorage.setItem(SESSION_KEY, session.serialize());
      return await getIdentityFromSession(session);
    }
  }
}

const IdentityNav: React.FC = () => {
  const { identity, setIdentity } = useContext(IdentityContext);

  const signInFn = async () => {
    setIdentity(await getIdentity());
  };

  const signOutFn = () => {
    localStorage.removeItem(SESSION_KEY);
    setIdentity(INITIAL_IDENTITY_CONTEXT);
    window.location.hash = '';
  };

  useEffect(() => {
    if (!identity) {
      const match = window.location.hash
        ? window.location.hash.match(/#access_token=([^&]+)/)
        : false;
      if (match) {
        const session = UserSession.completeOAuth2(OAUTH_CONFIG);
        getIdentityFromSession(session).then((id) => {
          setIdentity(id);
          window.localStorage.setItem(SESSION_KEY, session.serialize());
        });
      }
    }
  }, [identity, setIdentity]);

  if (!(identity && identity.user)) {
    return (
      <Nav style={{ justifyContent: 'flex-end !important' }}>
        <Button onClick={signInFn}>Sign In</Button>
      </Nav>
    );
  }

  const {
    user: { username, fullName, email },
    org: { url, name },
  } = identity;

  return (
    <Nav style={{ justifyContent: 'flex-end !important' }}>
      <NavDropdown title={fullName} alignRight={true} id="user-dropdown">
        <Row style={{ width: 450, padding: '45px 15px 15px 15px' }}>
          <Col sm={6} style={{ textAlign: 'center', padding: '0 10px 0 20px' }}>
            <h4 style={{ fontWeight: 400, fontSize: 18 }}>{username}</h4>
            {email && email.toLowerCase()}
            <br />
            {'\u200E'}
            {name}
            {'\u200E'}
          </Col>
          <Col
            sm={6}
            style={{
              padding: '7px 20px 0 10px',
              textAlign: 'left',
            }}
          >
            <h5 style={{ fontWeight: 400, fontSize: 14 }}>
              <a
                href={`https://${url}/home/user.html`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Profile
              </a>
            </h5>
            <h5 style={{ fontWeight: 400, fontSize: 14 }}>
              <a
                href="https://community.esri.com/groups/esri-training"
                rel="noopener noreferrer"
                target="_blank"
              >
                Training
              </a>
            </h5>
            <h5 style={{ fontWeight: 400, fontSize: 14 }}>
              <a
                href="https://community.esri.com/community/gis/web-gis/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Community
              </a>
            </h5>
          </Col>
        </Row>
        <Row style={{ width: 450, padding: 15 }}>
          <Col
            sm={6}
            // smOffset={6}
            style={{ textAlign: 'center', padding: '0 20px 0 10px' }}
          >
            <Button style={{ width: 150 }} onClick={signOutFn}>
              Sign Out
            </Button>
          </Col>
        </Row>
      </NavDropdown>
    </Nav>
  );
};

export default IdentityNav;
