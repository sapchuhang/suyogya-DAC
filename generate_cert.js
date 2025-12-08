const selfsigned = require('selfsigned');
const fs = require('fs');

try {
    const pems = selfsigned.generate(null, { days: 365 });
    console.log('Keys available:', Object.keys(pems));
    
    fs.writeFileSync('cert.pem', pems.cert);
    fs.writeFileSync('key.pem', pems.private);
    console.log('Success');
} catch (e) {
    console.error(e);
}
