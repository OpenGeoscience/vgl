/*global describe, it, expect, vgl*/
describe('vgl.graphicsObject', function () {
  describe('Create', function () {
    it('create function', function () {
      var obj = vgl.graphicsObject();
      expect(obj instanceof vgl.graphicsObject).toBe(true);
      expect(obj.getMTime()).toBeGreaterThan(0);
    });
  });
  describe('Private methods', function () {
    var obj;
    it('_setup', function () {
      obj = vgl.graphicsObject();
      expect(obj._setup()).toBe(false);
    });
    it('_cleanup', function () {
      expect(obj._cleanup()).toBe(false);
    });
  });
  describe('Public methods', function () {
    var obj;
    it('bind', function () {
      obj = vgl.graphicsObject();
      expect(obj.bind()).toBe(false);
    });
    it('undoBind', function () {
      expect(obj.undoBind()).toBe(false);
    });
    it('render', function () {
      expect(obj.render()).toBe(false);
    });
    it('remove', function () {
      expect(obj.remove()).toBe(undefined);
    });
  });
});
