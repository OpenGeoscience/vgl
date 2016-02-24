/*global describe, it, expect, vgl*/
describe('vgl.data', function () {
  describe('Create', function () {
    it('create function', function () {
      var d = vgl.data();
      expect(d instanceof vgl.data).toBe(true);
    });
  });
  describe('Constants', function () {
    it('class constants', function () {
      expect(vgl.data.raster).toBe(0);
      expect(vgl.data.point).toBe(1);
      expect(vgl.data.lineString).toBe(2);
      expect(vgl.data.polygon).toBe(3);
      expect(vgl.data.geometry).toBe(10);
    });
  });
  describe('Public methods', function () {
    var d;
    it('type', function () {
      d = vgl.data();
      expect(d.type()).toBe(undefined);
    });
  });
});
