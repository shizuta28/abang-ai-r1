module.exports = {
  apps: [
    {
      name: 'abang-api',
      cwd: './backend',
      script: 'src/server.js',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'abang-web',
      cwd: './frontend',
      script: '.output/server/index.mjs',
      env: { NODE_ENV: 'production', NUXT_API_INTERNAL: 'http://127.0.0.1:4000' }
    }
  ]
}
