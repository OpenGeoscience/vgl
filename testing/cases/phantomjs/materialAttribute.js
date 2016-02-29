/*global describe, it, expect, vgl*/
describe('vgl.materialAttribute', function () {
  describe('Create', function () {
    it('create function', function () {
      var ma = vgl.materialAttribute();
      expect(ma instanceof vgl.materialAttribute).toBe(true);
      expect(ma.render()).toBe(false);
      expect(ma.type()).toBe(undefined);
      ma = vgl.materialAttribute(vgl.materialAttributeType.Texture);
      expect(ma.type()).toBe(vgl.materialAttributeType.Texture);
    });
  });
  describe('Public methods', function () {
    var ma;
    it('type', function () {
      ma = vgl.materialAttribute(vgl.materialAttributeType.ShaderProgram);
      expect(ma.type()).toBe(vgl.materialAttributeType.ShaderProgram);
    });
    it('enabled', function () {
      expect(ma.enabled()).toBe(true);
    });
    it('bindVertexData', function () {
      expect(ma.bindVertexData()).toBe(false);
    });
    it('undoBindVertexData', function () {
      expect(ma.undoBindVertexData()).toBe(false);
    });
  });
});
