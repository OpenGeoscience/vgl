/*global describe, it, expect, vgl*/
describe('vgl.version', function () {
  it('Version number is defined', function () {
    expect(vgl.version).toMatch(/[0-9]+\.[0-9]+\.[0-9]+[_a-zA-Z]*/);
  });
});
