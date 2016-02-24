/*global describe, it, expect, vgl*/
describe('vgl.freezeObject', function () {
  it('freezeObject function', function () {
    var obj = vgl.object();
    obj.prop1 = 'test';
    expect(obj.prop1).toBe('test');
    var fobj = vgl.freezeObject(obj);
    fobj.prop2 = 'test2';
    expect(fobj.prop1).toBe('test');
    expect(fobj.prop2).toBe(undefined);
    fobj.prop1 = 'test3';
    expect(fobj.prop1).toBe('test');
  });
  it('freezeObject fallback', function () {
    var obj = vgl.object();
    obj.prop1 = 'test';
    Object.freeze = undefined;
    expect(obj.prop1).toBe('test');
    var fobj = vgl.freezeObject(obj);
    fobj.prop2 = 'test2';
    expect(fobj.prop1).toBe('test');
    expect(fobj.prop2).toBe('test2');
  });
});
