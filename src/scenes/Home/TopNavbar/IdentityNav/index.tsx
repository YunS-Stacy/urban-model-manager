import React, { useContext } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import NavItem from 'react-bootstrap/NavItem';
import IdentityContext from '../../../contexts/IdentityContext';
import signIn from './utils/signIn';

const IdentityNav: React.FC = () => {
  const { identity, setIdentity } = useContext(IdentityContext);


  if (!(identity && identity.user)) {
    return <NavItem onClick={() => signIn()}>{'Sign In'}</NavItem>;
  }

  return null;
  // return (
  //   <NavDropdown
  //     eventKey={20}
  //     title={
  //       <div
  //         style={{
  //           background: `url('${thumbnailUrl}')`,
  //           backgroundColor: '#f4f4f4',
  //           backgroundSize: '32px 32px',
  //           width: 32,
  //           height: 32,
  //           borderRadius: '50%',
  //         }}
  //         alt="thumbnail"
  //       />
  //     }
  //     id="user-dropdown"
  //     noCaret
  //   >
  //     <Row style={{ width: 450, padding: '45px 15px 15px 15px' }}>
  //       <Col sm={6} style={{ textAlign: 'center', padding: '0 10px 0 20px' }}>
  //         {thumbnailUrl && (
  //           <img
  //             src={thumbnailUrl}
  //             style={{
  //               width: 125,
  //               height: 125,
  //               borderRadius: '50%',
  //               border: '1px solid #ddd',
  //               marginBottom: 20,
  //             }}
  //             alt="thumbnail"
  //           />
  //         )}
  //         <h4 style={{ fontWeight: 400, fontSize: 18 }}>{fullname}</h4>
  //         {email && email.toLowerCase()}
  //         <br />
  //         {'\u200E'}
  //         {org.name}
  //         {'\u200E'}
  //       </Col>
  //       <Col
  //         sm={6}
  //         style={{
  //           padding: '7px 20px 0 10px',
  //           textAlign: rtl ? 'right' : 'left',
  //         }}
  //       >
  //         <h5 style={{ fontWeight: 400, fontSize: 14 }}>
  //           <a
  //             href={`https://${org.url || portalUrl}/home/user.html`}
  //             rel="noopener noreferrer"
  //             target="_blank"
  //           >
  //             {intl.formatMessage(messages.profile)}
  //           </a>
  //         </h5>
  //         <h5 style={{ fontWeight: 400, fontSize: 14 }}>
  //           <a
  //             href="https://community.esri.com/groups/esri-training"
  //             rel="noopener noreferrer"
  //             target="_blank"
  //           >
  //             {intl.formatMessage(messages.training)}
  //           </a>
  //         </h5>
  //         <h5 style={{ fontWeight: 400, fontSize: 14 }}>
  //           <a
  //             href="https://community.esri.com/community/gis/web-gis/"
  //             rel="noopener noreferrer"
  //             target="_blank"
  //           >
  //             {intl.formatMessage(messages.community)}
  //           </a>
  //         </h5>
  //       </Col>
  //     </Row>
  //     <Row style={{ width: 450, padding: 15 }}>
  //       <Col
  //         sm={6}
  //         smOffset={6}
  //         style={{ textAlign: 'center', padding: '0 20px 0 10px' }}
  //       >
  //         <Button style={{ width: 150 }} onClick={signOutFn}>
  //           {intl.formatMessage(messages.signOut)}
  //         </Button>
  //       </Col>
  //     </Row>
  //   </NavDropdown>
  // );
};

export default IdentityNav;
