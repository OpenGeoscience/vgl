/*global describe, it, expect, vgl*/
describe('vgl.source', function () {
  describe('Create', function () {
    it('create function', function () {
      var src = vgl.source();
      expect(src instanceof vgl.source).toBe(true);
      expect(src.getMTime()).toBeGreaterThan(0);
    });
  });
  describe('Public methods', function () {
    var src;
    it('type', function () {
      src = vgl.source();
      expect(src.create()).toBe(undefined);
    });
  });
});
