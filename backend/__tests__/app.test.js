const http = require('http');
const app = require('../src/app');

test('GET /health returns ok', (done) => {
  const server = app.listen(0, () => {
    const { port } = server.address();
    http.get({ hostname: '127.0.0.1', port, path: '/health', agent: false }, (res) => {
      expect(res.statusCode).toBe(200);
      let body = '';
      res.on('data', (chunk) => { body += chunk.toString(); });
      res.on('end', () => {
        expect(JSON.parse(body)).toEqual({ status: 'ok' });
        server.close();
        done();
      });
    }).on('error', (err) => {
      server.close();
      done(err);
    });
  });
});
