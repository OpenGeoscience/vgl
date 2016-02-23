/*global describe, it, expect, vgl*/
describe('vgl.timestamp', function () {
  describe('Create', function () {
    it('create function', function () {
      var ts = vgl.timestamp();
      expect(ts instanceof vgl.timestamp).toBe(true);
    });
  });
  describe('Public methods', function () {
    var ts;
    it('getMTime', function () {
      ts = vgl.timestamp();
      expect(ts.getMTime()).toBe(0);
    });
    it('modified', function () {
      ts.modified();
      expect(ts.getMTime()).toBeGreaterThan(0);
    });
  });
});
