module.exports = {
  apps: [
    {
      name: 'random_album_api',
      script: 'src/random_album_api.py',
      interpreter: 'python',  // Use 'python' instead of 'python3' on Windows
      watch: true,
      env: {
        FLASK_ENV: 'development',
      },
    },
  ],
};