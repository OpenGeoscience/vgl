/*global describe, it, expect, vgl*/
describe('vgl.init', function () {
  describe('ogs namespace', function () {
    it('ogs namespace', function () {
      expect(window.ogs.namespace('ogs')).toBe(window.ogs);
      expect(window.ogs.namespace('gl')).toBe(vgl);
      var test = window.ogs.namespace('test');
      var sub = window.ogs.namespace('test.sub');
      expect(test.sub).toBe(sub);
      expect(test.sub).not.toBeNull();
    });
  });
  describe('Object.size', function () {
    it('objects', function () {
      var obj = {};
      expect(Object.size(obj)).toBe(0);
      obj.prop1 = 'a';
      expect(Object.size(obj)).toBe(1);
      obj.prop2 = 'b';
      expect(Object.size(obj)).toBe(2);
      obj.prop1 = undefined;
      expect(Object.size(obj)).toBe(2);
      obj.prop3 = 'c';
      expect(Object.size(obj)).toBe(3);
      delete obj.prop3;
      expect(Object.size(obj)).toBe(2);
    });
    it('arrays', function () {
      var arr = [1, 2, 3];
      expect(Object.size(arr)).toBe(3);
      arr.prop1 = 'a';
      expect(Object.size(arr)).toBe(4);
      arr.prop2 = 'b';
      expect(Object.size(arr)).toBe(5);
      arr.prop1 = undefined;
      expect(Object.size(arr)).toBe(5);
      arr.prop3 = 'c';
      expect(Object.size(arr)).toBe(6);
      delete arr.prop3;
      expect(Object.size(arr)).toBe(5);
      arr.pop();
      expect(Object.size(arr)).toBe(4);
    });
  });
});
