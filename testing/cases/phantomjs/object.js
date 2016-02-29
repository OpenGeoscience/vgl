/*global describe, it, expect, vgl*/
describe('vgl.object', function () {
  describe('Create', function () {
    it('create function', function () {
      var obj = vgl.object();
      expect(obj instanceof vgl.object).toBe(true);
    });
  });
  describe('Public methods', function () {
    var obj, lasttime;
    it('getMTime', function () {
      obj = vgl.object();
      lasttime = obj.getMTime();
      expect(lasttime).toBeGreaterThan(0);
    });
    it('modified', function () {
      obj.modified();
      expect(obj.getMTime()).toBeGreaterThan(lasttime);
    });
  });
});
