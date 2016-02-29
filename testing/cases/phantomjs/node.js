/*global describe, it, expect, vgl*/
describe('vgl.node', function () {

  var visitor = function () {
    this.visitCount = 0;
    this.visit = function () {
      this.visitCount += 1;
    };
    return this;
  };

  var parentNode = function () {
    this.removeChildCount = 0;
    this.removeChild = function () {
      this.removeChildCount += 1;
    };
    this.boundsModifiedCount = 0;
    this.boundsModified = function () {
      this.boundsModifiedCount += 1;
    };
    return this;
  };

  describe('Create', function () {
    it('create function', function () {
      var node = vgl.node();
      expect(node instanceof vgl.node).toBe(true);
      expect(node.bounds()).toEqual([
        Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE,
        -Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE
      ]);
    });
  });
  describe('Public methods', function () {
    var node, vis, par, lasttime;
    it('accept', function () {
      node = vgl.node();
      vis = new visitor();
      expect(vis.visitCount).toBe(0);
      node.accept(vis);
      expect(vis.visitCount).toBe(1);
    });
    it('material and setMaterial', function () {
      lasttime = node.getMTime();
      expect(node.material()).toBe(null);
      expect(node.setMaterial('test')).toBe(true);
      expect(node.getMTime()).toBeGreaterThan(lasttime);
      lasttime = node.getMTime();
      expect(node.material()).toBe('test');
      expect(node.setMaterial('test')).toBe(false);
      expect(node.getMTime()).toEqual(lasttime);
      expect(node.material()).toBe('test');
      expect(node.setMaterial('test2')).toBe(true);
      expect(node.material()).toBe('test2');
    });
    it('visible and setVisible', function () {
      lasttime = node.getMTime();
      expect(node.visible()).toBe(true);
      expect(node.setVisible(false)).toBe(true);
      expect(node.getMTime()).toBeGreaterThan(lasttime);
      lasttime = node.getMTime();
      expect(node.visible()).toBe(false);
      expect(node.setVisible(false)).toBe(false);
      expect(node.getMTime()).toEqual(lasttime);
      expect(node.visible()).toBe(false);
      expect(node.setVisible(true)).toBe(true);
      expect(node.visible()).toBe(true);
    });
    it('overlay and setOverlay', function () {
      lasttime = node.getMTime();
      expect(node.overlay()).toBe(false);
      expect(node.setOverlay(true)).toBe(true);
      expect(node.getMTime()).toBeGreaterThan(lasttime);
      lasttime = node.getMTime();
      expect(node.overlay()).toBe(true);
      expect(node.setOverlay(true)).toBe(false);
      expect(node.getMTime()).toEqual(lasttime);
      expect(node.overlay()).toBe(true);
      expect(node.setOverlay(false)).toBe(true);
      expect(node.overlay()).toBe(false);
    });
    it('parent and setParent', function () {
      par = new parentNode();
      lasttime = node.getMTime();
      expect(node.parent()).toBe(null);
      expect(node.setParent(par)).toBe(true);
      expect(node.getMTime()).toBeGreaterThan(lasttime);
      lasttime = node.getMTime();
      expect(node.parent()).toBe(par);
      expect(node.setParent(par)).toBe(false);
      expect(node.getMTime()).toEqual(lasttime);
      expect(node.parent()).toBe(par);
      expect(par.removeChildCount).toBe(0);
      expect(node.setParent(null)).toBe(true);
      expect(node.parent()).toBe(null);
      expect(par.removeChildCount).toBe(1);
    });
    it('ascend and traverse', function () {
      expect(node.ascend()).toBe(undefined);
      expect(node.traverse()).toBe(undefined);
    });
    it('boundsModified', function () {
      lasttime = node.boundsDirtyTimestamp().getMTime();
      node.boundsModified();
      expect(node.boundsDirtyTimestamp().getMTime()).toBeGreaterThan(lasttime);
      expect(par.boundsModifiedCount).toBe(0);
      node.setParent(par);
      node.boundsModified();
      expect(par.boundsModifiedCount).toBe(1);
    });
  });
});
