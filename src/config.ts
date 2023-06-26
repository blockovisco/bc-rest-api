import * as path from 'path';

const appOrg = 'org2.example.com'

// Path to crypto materials.
export const cryptoPath = path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', appOrg);

// Path to user private key directory.
export const keyDirectoryPath = path.resolve(cryptoPath, 'users', 'User1@' + appOrg, 'msp', 'keystore');

// Path to user certificate.
export const certPath = path.resolve(cryptoPath, 'users', 'User1@' + appOrg, 'msp', 'signcerts', 'cert.pem');

// Path to peer tls certificate.
export const tlsCertPath = path.resolve(cryptoPath, 'peers', 'peer0.' + appOrg, 'tls', 'ca.crt');

// Gateway peer endpoint.
export const peerEndpoint = 'localhost:9051';

// Gateway peer SSL host name override.
export const peerHostAlias = 'peer0.' + appOrg;