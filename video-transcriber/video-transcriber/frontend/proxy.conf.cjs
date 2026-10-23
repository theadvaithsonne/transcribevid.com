// Dev proxy: /api -> the FastAPI server. The port follows VT_PORT (set by `npm run dev`; default 8000).
module.exports = {
  '/api': {
    target: `http://127.0.0.1:${process.env.VT_PORT || 8000}`,
    secure: false,
    changeOrigin: false,
  },
};
