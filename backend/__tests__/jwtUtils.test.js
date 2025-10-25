beforeAll(() => {
  process.env.JWT_SECRET = 'testsecret';
});

const { sign, verify } = require('../src/utils/jwtUtils');

test('sign and verify a token', () => {
  const payload = { id: '123', email: 'a@b.com' };
  const token = sign(payload, { expiresIn: '1d' });
  const decoded = verify(token);
  expect(decoded.id).toBe(payload.id);
  expect(decoded.email).toBe(payload.email);
});
