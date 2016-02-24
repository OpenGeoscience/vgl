/*global describe, it, expect, vgl*/
describe('vgl.dataBuffers', function () {

  /* Phantomjs doesn't slice Float32Arrays, so this is a substitute */
  function sliceFloat32Array(arr, start, end) {
    var i, newarr = [];
    for (i = start; i < end && i < arr.length; i += 1) {
      newarr.push(arr[i]);
    }
    return newarr;
  }

  describe('Create', function () {
    it('create function', function () {
      var db = vgl.DataBuffers();
      expect(db instanceof vgl.DataBuffers).toBe(true);
      expect(db.create('test', 1).length).toBe(256);
      db = vgl.DataBuffers(100);
      expect(db.create('test', 1).length).toBe(100);
    });
  });
  describe('Public methods', function () {
    var db;
    it('create', function () {
      db = vgl.DataBuffers(10);
      expect(db.create('test', 1).length).toBe(10);
      expect(db.create('test2', 3).length).toBe(10 * 3);
      expect(function () { db.create('test', 0); }).toThrow('Length of buffer must be a positive integer');
      expect(function () { db.create('test', -3); }).toThrow('Length of buffer must be a positive integer');
    });
    it('get and data', function () {
      expect(db.get('test').length).toBe(10);
      expect(db.get('test') instanceof Float32Array).toBe(true);
      expect(db.get('test2').length).toBe(10 * 3);
      expect(function () { db.get('test3'); }).toThrow();
      expect(db.data('test').length).toBe(10);
      expect(db.data('test2').length).toBe(10 * 3);
      expect(function () { db.data('test3'); }).toThrow();
    });
    it('write', function () {
      db.write('test', [0, 1, 2, 3], 0, 4);
      expect(sliceFloat32Array(db.get('test'), 0, 4)).toEqual([0, 1, 2, 3]);
      db.write('test', [4, 5, 6, 7], 0, 3);
      expect(sliceFloat32Array(db.get('test'), 0, 4)).toEqual([4, 5, 6, 3]);
      db.write('test', [8, 9, 10, 11], 2, 4);
      expect(sliceFloat32Array(db.get('test'), 0, 6)).toEqual([4, 5, 8, 9, 10, 11]);
      db.write('test2', [0, 1, 2, 3, 4, 5], 0, 2);
      expect(sliceFloat32Array(db.get('test2'), 0, 6)).toEqual([0, 1, 2, 3, 4, 5]);
      expect(function () { db.write('test2', [0], 100, 1); }).toThrow('Write would exceed buffer size');
      expect(function () { db.write('test3', [0], 0, 1); }).toThrow();
    });
    it('repeat', function () {
      db.repeat('test', [1], 0, 4);
      expect(sliceFloat32Array(db.get('test'), 0, 4)).toEqual([1, 1, 1, 1]);
      db.repeat('test', [2], 0, 3);
      expect(sliceFloat32Array(db.get('test'), 0, 4)).toEqual([2, 2, 2, 1]);
      db.repeat('test', [3], 2, 4);
      expect(sliceFloat32Array(db.get('test'), 0, 6)).toEqual([2, 2, 3, 3, 3, 3]);
      db.repeat('test2', [1, 2, 3], 0, 2);
      expect(sliceFloat32Array(db.get('test2'), 0, 6)).toEqual([1, 2, 3, 1, 2, 3]);
      expect(function () { db.repeat('test2', [0], 100, 1); }).toThrow('Repeat would exceed buffer size');
      expect(function () { db.repeat('test3', [0], 0, 1); }).toThrow();
    });
    it('alloc and count', function () {
      expect(db.count()).toBe(0);
      expect(db.alloc(5)).toBe(0);
      expect(db.count()).toBe(5);
      expect(db.create('test', 1).length).toBe(10);
      expect(db.create('test2', 3).length).toBe(10 * 3);
      expect(db.alloc(5)).toBe(5);
      expect(db.count()).toBe(10);
      expect(db.create('test', 1).length).toBe(10);
      expect(db.create('test2', 3).length).toBe(10 * 3);
      expect(db.alloc(5)).toBe(10);
      expect(db.count()).toBe(15);
      expect(db.create('test', 1).length).toBe(20);
      expect(db.create('test2', 3).length).toBe(20 * 3);
      expect(db.alloc(30)).toBe(15);
      expect(db.count()).toBe(45);
      expect(db.create('test', 1).length).toBe(45);
      expect(db.create('test2', 3).length).toBe(45 * 3);
    });
  });
});
