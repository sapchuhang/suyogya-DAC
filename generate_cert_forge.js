const forge = require('node-forge');
const fs = require('fs');

const pki = forge.pki;

// Generate a specific key pair
const keys = pki.rsa.generateKeyPair(2048);
const cert = pki.createCertificate();

cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

const attrs = [{
  name: 'commonName',
  value: '192.168.1.68'
}, {
  name: 'countryName',
  value: 'NP'
}, {
  shortName: 'ST',
  value: 'Bagmati'
}, {
  name: 'localityName',
  value: 'Kathmandu'
}, {
  name: 'organizationName',
  value: 'Suyogya Co-op'
}, {
  shortName: 'OU',
  value: 'IT'
}];

cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.sign(keys.privateKey);

const pemKey = pki.privateKeyToPem(keys.privateKey);
const pemCert = pki.certificateToPem(cert);

fs.writeFileSync('key.pem', pemKey);
fs.writeFileSync('cert.pem', pemCert);

console.log('Certificates generated successfully using node-forge.');
