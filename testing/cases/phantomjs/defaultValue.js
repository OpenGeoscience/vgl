/*global describe, it, expect, vgl*/
describe('vgl.defaultValue', function () {
  it('defaultValue function', function () {
    expect(vgl.defaultValue(undefined, 'test')).toBe('test');
    expect(vgl.defaultValue('value', 'test')).toBe('value');
    expect(vgl.defaultValue(null, 'test')).toBe(null);
    expect(vgl.defaultValue()).toBe(undefined);
  });
  it('defaultValue empty object', function () {
    expect(vgl.defaultValue.EMPTY_OBJECT).toEqual({});
  });
});
