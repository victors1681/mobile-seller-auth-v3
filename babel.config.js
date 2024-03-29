module.exports = (api) => ({
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: false,
        forceAllTransforms: api.env('production'),
        targets: {
          browsers: ['last 2 versions']
        }
      }
    ],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-transform-classes',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-async-to-generator',
    '@babel/plugin-syntax-dynamic-import',
    'react-hot-loader/babel',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-transform-spread',
    '@babel/plugin-transform-regenerator',
    '@babel/plugin-transform-runtime'
  ]
});
