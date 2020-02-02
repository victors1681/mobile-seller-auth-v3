const path = require('path');

const getEntry = () => ({
  app: ['@babel/polyfill', path.join(__dirname, '..', 'src', 'index.tsx')],
  vendors: ['react', 'react-dom']
});

module.exports.getEntry = getEntry;
