import * as path from 'path';

export const isProducer = false;

export const mspId = 'Org2MSP'
const appOrg = 'org2.example.com'

// Gateway peer endpoint.
export const peerEndpoint = 'localhost:9051';

// Path to crypto materials.
export const cryptoPath = path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', appOrg);

// Path to user private key directory.
export const keyDirectoryPath = path.resolve(cryptoPath, 'users', 'User1@' + appOrg, 'msp', 'keystore');

// Path to user certificate.
export const certPath = path.resolve(cryptoPath, 'users', 'User1@' + appOrg, 'msp', 'signcerts', 'cert.pem');

// Path to peer tls certificate.
export const tlsCertPath = path.resolve(cryptoPath, 'peers', 'peer0.' + appOrg, 'tls', 'ca.crt');

// Gateway peer SSL host name override.
export const peerHostAlias = 'peer0.' + appOrg;