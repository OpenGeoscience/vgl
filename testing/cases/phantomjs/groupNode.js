/*global describe, it, expect, vgl*/
describe('vgl.groupNode', function () {

  var visitor = function () {
    this.CullVisitor = 1;
    this.UpdateVisitor = 2;
    this.IgnoreVisitor = 3;
    this.TraverseAllChildren = 4;

    this.visitorType = this.CullVisitor;
    this.visitorMode = this.TraverseAllChildren;
    this.visitCount = 0;
    this.visit = function () {
      this.visitCount += 1;
    };
    this.mode = function () {
      return this.visitorMode;
    };
    this.type = function () {
      return this.visitorType;
    };
    return this;
  };

  describe('Create', function () {
    it('create function', function () {
      var node = vgl.groupNode();
      expect(node instanceof vgl.groupNode).toBe(true);
      expect(node.material()).toBe(null);
    });
  });
  describe('Public methods', function () {
    var node, children = [], vis, lasttime, parent;
    it('child methods', function () {
      var i;
      node = vgl.groupNode();
      for (i = 0; i < 6; i += 1) {
        children.push(vgl.node());
        children[children.length - 1].setBounds(-i, i, -i, i, -i, i);
        if (i === 5) {
          children[children.length - 1].setOverlay(true);
        }
      }
      expect(node.children()).toEqual([]);
      expect(node.addChild(children[0])).toBe(true);
      expect(node.addChild(children[0])).toBe(false);
      expect(node.addChild('not a node')).toBe(false);
      for (i = 0; i < children.length; i += 1) {
        node.addChild(children[i]);
      }
      expect(node.children().length).toBe(children.length);
      expect(node.removeChild(children[0])).toBe(true);
      expect(node.removeChild(children[0])).toBe(undefined);
      expect(node.children().length).toBe(children.length - 1);
      expect(function () { node.removeChild('not a node'); }).toThrow();
      expect(node.hasChild(children[0])).toBe(false);
      expect(node.hasChild(children[1])).toBe(true);
      node.removeChildren();
      expect(node.children().length).toBe(0);
      for (i = 0; i < children.length; i += 1) {
        node.addChild(children[i]);
      }
      expect(node.children().length).toBe(children.length);
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
    it('accept and traverse functions', function () {
      vis = new visitor();
      expect(vis.visitCount).toBe(0);
      node.accept(vis);
      expect(vis.visitCount).toBe(1);
      lasttime = node.computeBoundsTimestamp().getMTime();
      node.traverse(vis);
      expect(node.computeBoundsTimestamp().getMTime()).toBe(lasttime);
      vis.visitorType = vis.UpdateVisitor;
      node.traverse(vis);
      expect(node.computeBoundsTimestamp().getMTime()).toBeGreaterThan(lasttime);
      parent = vgl.groupNode();
      node.setParent(parent);
      node.boundsDirtyTimestamp().modified();
      lasttime = parent.boundsDirtyTimestamp().getMTime();
      node.traverse(vis);
      expect(parent.boundsDirtyTimestamp().getMTime()).toBeGreaterThan(lasttime);
      vis.visitorType = vis.IgnoreVisitor;
      lasttime = node.computeBoundsTimestamp().getMTime();
      node.traverse(vis);
      expect(node.computeBoundsTimestamp().getMTime()).toBe(lasttime);
    });
    it('computeBounds and updateBounds', function () {
      node.setBounds(0, 0, 0, 0, 0, 0);
      node.boundsDirtyTimestamp().modified();
      node.computeBounds();
      expect(node.children().length).toBe(6);
      expect(node.bounds()).toEqual([-4, 4, -4, 4, -4, 4]);
      node.setBounds(0, 0, 0, 0, 0, 0);
      node.computeBoundsTimestamp().modified();
      node.computeBounds();
      expect(node.bounds()).toEqual([0, 0, 0, 0, 0, 0]);
    });
  });
});
