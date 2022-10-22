const path = require('path');

const getEntry = () => ['whatwg-fetch', path.join(__dirname, '..', 'src', 'index.tsx')];

module.exports.getEntry = getEntry;
