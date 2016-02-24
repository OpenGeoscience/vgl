/*global describe, it, expect, vgl*/
describe('vgl.boundingObject', function () {
  describe('Create', function () {
    it('create function', function () {
      var obj = vgl.boundingObject();
      expect(obj instanceof vgl.boundingObject).toBe(true);
      expect(obj.getMTime()).toBeGreaterThan(0);
    });
  });
  describe('Public methods', function () {
    var obj;
    it('bounds', function () {
      var lasttime, lastcomptime;
      obj = vgl.boundingObject();
      expect(obj.bounds()).toEqual([
        Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE,
        -Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE
      ]);
      lasttime = obj.getMTime();
      lastcomptime = obj.computeBoundsTimestamp().getMTime();
      expect(obj.setBounds(Number.MAX_VALUE)).toBe(undefined);
      expect(obj.getMTime()).toBe(lasttime);
      expect(obj.computeBoundsTimestamp().getMTime()).toBe(lastcomptime);
      expect(obj.setBounds()).toBe(true);
      expect(obj.getMTime()).toBeGreaterThan(lasttime);
      expect(obj.computeBoundsTimestamp().getMTime()).toBeGreaterThan(lastcomptime);
      expect(obj.bounds()).toEqual([undefined, undefined, undefined, undefined,
                                    undefined, undefined]);
      expect(obj.setBounds(0, 1, 2, 3, 4, 5)).toBe(true);
      expect(obj.bounds()).toEqual([0, 1, 2, 3, 4, 5]);
      obj.resetBounds();
      expect(obj.bounds()).toEqual([
        Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE,
        -Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE
      ]);
    });
    it('hasValidBounds', function () {
      var bounds = [
        {valid: true, bds: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]},
        {valid: false, bds: [Number.MAX_VALUE, 0.0, 0.0, 0.0, 0.0, 0.0]},
        {valid: true, bds: [-Number.MAX_VALUE, 0.0, 0.0, 0.0, 0.0, 0.0]},
        {valid: true, bds: [0, Number.MAX_VALUE, 0.0, 0.0, 0.0, 0.0]},
        {valid: false, bds: [0, -Number.MAX_VALUE, 0.0, 0.0, 0.0, 0.0]},
        {valid: false, bds: [0, 0, Number.MAX_VALUE, 0.0, 0.0, 0.0]},
        {valid: true, bds: [0, 0, -Number.MAX_VALUE, 0.0, 0.0, 0.0]},
        {valid: true, bds: [0, 0, 0, Number.MAX_VALUE, 0.0, 0.0]},
        {valid: false, bds: [0, 0, 0, -Number.MAX_VALUE, 0.0, 0.0]},
        {valid: false, bds: [0, 0, 0, 0, Number.MAX_VALUE, 0.0]},
        {valid: true, bds: [0, 0, 0, 0, -Number.MAX_VALUE, 0.0]},
        {valid: true, bds: [0, 0, 0, 0, 0, Number.MAX_VALUE]},
        {valid: false, bds: [0, 0, 0, 0, 0, -Number.MAX_VALUE]},
        {valid: false, bds: [Number.MAX_VALUE, 0, 0, 0, Number.MAX_VALUE, 0]}
      ];
      for (var i = 0; i < bounds.length; i += 1) {
        expect(obj.hasValidBounds(bounds[i].bds)).toBe(bounds[i].valid);
      }
    });
    it('boundsDirtyTimestamp', function () {
      expect(obj.boundsDirtyTimestamp() instanceof vgl.timestamp).toBe(true);
    });
  });
});
