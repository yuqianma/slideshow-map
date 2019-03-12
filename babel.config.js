module.exports = function(api) {

  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        'useBuiltIns': false,
        'targets': 'last 2 major versions',
        'include': ['@babel/plugin-transform-template-literals']
      }
    ]
  ];
  const plugins = [
  ];

  return {
    presets,
    plugins
  };
};