const { hashBuffer } = require('../src/utils/hashUtils');

test('hashBuffer computes sha256 correctly for "hello"', () => {
  const buf = Buffer.from('hello');
  const hash = hashBuffer(buf);
  expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
});
