const target = process.env.API_TARGET || 'http://localhost:5000';

module.exports = {
  '/api': {
    target,
    secure: false,
    changeOrigin: true,
  },
};
