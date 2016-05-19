var crypto = require('crypto');
var fs = require('fs');

if (!process.env.PASSPHRASE) throw new Error('Environment variable PASSPHRASE is not defined');

var key = crypto.pbkdf2Sync(process.env.PASSPHRASE, 'whatever salt', 32, 32, 'sha256').toString('base64');
fs.writeFileSync('cryptex.key', key);