/* global describe, it, expect, vgl, mockVGLRenderer */

describe('vgl.material', function () {
  describe('Create', function () {
    it('create function', function () {
      var mat = vgl.material();
      expect(mat instanceof vgl.material).toBe(true);
    });
  });
  describe('Public methods', function () {
    var mat, renderState, glCounts;
    it('binNumber and setBinNumber', function () {
      mat = vgl.material();
      expect(mat.binNumber()).toBe(100);
      var lasttime = mat.getMTime();
      mat.setBinNumber(vgl.material.RenderBin.Transparent);
      expect(mat.getMTime()).toBeGreaterThan(lasttime);
      expect(mat.binNumber()).toBe(1000);
    });
    it('addAttribute, exists, attribute, setAttribute, and shaderProgram', function () {
      var blend1 = new vgl.blend(),
          blend2 = new vgl.blend(),
          tex1 = new vgl.texture(),
          tex2 = new vgl.texture(),
          prog1 = new vgl.shaderProgram(),
          prog2 = new vgl.shaderProgram();
      expect(mat.attribute(vgl.materialAttributeType.Blend)).toBe(null);
      expect(mat.exists(blend1)).toBe(false);
      expect(mat.addAttribute(blend1)).toBe(true);
      expect(mat.attribute(vgl.materialAttributeType.Blend)).toBe(blend1);
      expect(mat.exists(blend1)).toBe(true);
      expect(mat.addAttribute(blend1)).toBe(false);
      expect(mat.addAttribute(blend2)).toBe(false);
      expect(mat.attribute(vgl.materialAttributeType.Blend)).toBe(blend1);
      expect(mat.setAttribute(blend2)).toBe(true);
      expect(mat.attribute(vgl.materialAttributeType.Blend)).toBe(blend2);
      expect(mat.setAttribute(blend2)).toBe(false);
      expect(mat.attribute(vgl.materialAttributeType.Blend)).toBe(blend2);
      expect(mat.attribute(vgl.materialAttributeType.Texture, 0)).toBe(null);
      expect(mat.attribute(vgl.materialAttributeType.Texture, 1)).toBe(null);
      expect(mat.exists(tex1)).toBe(false);
      expect(mat.addAttribute(tex1)).toBe(true);
      expect(mat.attribute(vgl.materialAttributeType.Texture, 0)).toBe(tex1);
      expect(mat.attribute(vgl.materialAttributeType.Texture, 1)).toBe(null);
      expect(mat.exists(tex1)).toBe(true);
      expect(mat.addAttribute(tex1)).toBe(false);
      expect(mat.setAttribute(tex2)).toBe(true);
      expect(mat.attribute(vgl.materialAttributeType.Texture, 0)).toBe(tex2);
      expect(mat.attribute(vgl.materialAttributeType.Texture, 1)).toBe(null);
      expect(mat.setAttribute(tex2)).toBe(false);
      tex1.setTextureUnit(1);
      expect(mat.setAttribute(tex1)).toBe(true);
      expect(mat.attribute(vgl.materialAttributeType.Texture, 0)).toBe(tex2);
      expect(mat.attribute(vgl.materialAttributeType.Texture, 1)).toBe(tex1);
      /* Even though there is a default shader program, it isn't listed in the
       * attributes.  New shader programs are, though. */
      expect(mat.shaderProgram()).not.toBe(null);
      expect(mat.exists(mat.shaderProgram())).toBe(false);
      expect(mat.attribute(vgl.materialAttributeType.ShaderProgram)).toBe(null);
      expect(mat.addAttribute(prog1)).toBe(true);
      expect(mat.exists(prog1)).toBe(true);
      expect(mat.attribute(vgl.materialAttributeType.ShaderProgram)).toBe(prog1);
      expect(mat.addAttribute(prog1)).toBe(false);
      expect(mat.attribute(vgl.materialAttributeType.ShaderProgram)).toBe(prog1);
      expect(mat.setAttribute(prog2)).toBe(true);
      expect(mat.attribute(vgl.materialAttributeType.ShaderProgram)).toBe(prog2);
      expect(mat.shaderProgram()).toBe(prog2);
      expect(mat.setAttribute(prog2)).toBe(false);
      expect(mat.shaderProgram()).toBe(prog2);
    });
    it('uniform', function () {
      var prog = mat.shaderProgram(),
          uni = new vgl.floatUniform('aspect', 1.0);
      expect(mat.uniform('aspect')).toBe(null);
      prog.addUniform(uni);
      expect(mat.uniform('aspect')).toBe(uni);
    });
    it('bind', function () {
      mockVGLRenderer();
      var viewer = vgl.viewer($('<canvas/>')[0]);
      viewer.init();
      var renderer = viewer.renderWindow().activeRenderer(),
          mapper = vgl.mapper(),
          geom = vgl.geometryData(),
          data = vgl.vertexAttribute('data'),
          prog = mat.shaderProgram(),
          sourceData = vgl.sourceDataAnyfv(
            2, vgl.vertexAttributeKeysIndexed.One, {'name': 'data'});
      prog.addVertexAttribute(data, vgl.vertexAttributeKeysIndexed.One);
      geom.addSource(sourceData);
      mapper.setGeometryData(geom);
      renderState = new vgl.renderState();
      renderState.m_renderer = renderer;
      renderState.m_context = renderer.renderWindow().context();
      renderState.m_mapper = mapper;
      renderState.m_material = mat;
      glCounts = $.extend({}, vgl.mockCounts());
      mat.bind(renderState);
      expect(vgl.mockCounts().bindTexture).toBe((glCounts.bindTexture || 0) + 6);
    });
    it('unbind', function () {
      glCounts = $.extend({}, vgl.mockCounts());
      mat.undoBind(renderState);
      expect(vgl.mockCounts().bindTexture).toBe((glCounts.bindTexture || 0) + 2);
    });
    it('bindVertexData', function () {
      glCounts = $.extend({}, vgl.mockCounts());
      mat.bindVertexData(renderState, 1);
      expect(vgl.mockCounts().enableVertexAttribArray).toBe((glCounts.enableVertexAttribArray || 0) + 1);
      mat.bindVertexData(renderState, 'not an attrib');
      expect(vgl.mockCounts().enableVertexAttribArray).toBe((glCounts.enableVertexAttribArray || 0) + 1);
    });
    it('undoBindVertexData', function () {
      glCounts = $.extend({}, vgl.mockCounts());
      mat.undoBindVertexData(renderState, 1);
      expect(vgl.mockCounts().disableVertexAttribArray).toBe((glCounts.disableVertexAttribArray || 0) + 1);
      mat.undoBindVertexData(renderState, 'not an attrib');
      expect(vgl.mockCounts().disableVertexAttribArray).toBe((glCounts.disableVertexAttribArray || 0) + 1);
    });
  });
  describe('Private methods', function () {
    it('_setup', function () {
      var mat = vgl.material();
      expect(mat._setup()).toBe(false);
    });
    it('_cleanup', function () {
      mockVGLRenderer();
      var mat = vgl.material(), glCounts, renderState;

      var viewer = vgl.viewer($('<canvas/>')[0]);
      viewer.init();
      var renderer = viewer.renderWindow().activeRenderer();
      renderState = new vgl.renderState();
      renderState.m_renderer = renderer;
      renderState.m_context = renderer.renderWindow().context();
      var blend = new vgl.blend(),
          tex = new vgl.texture(),
          prog = new vgl.shaderProgram();
      mat.addAttribute(blend);
      mat.addAttribute(tex);
      mat.setAttribute(prog);
      glCounts = $.extend({}, vgl.mockCounts());
      mat._cleanup(renderState);
      expect(vgl.mockCounts().deleteProgram).toBe((glCounts.deleteProgram || 0) + 1);
    });
  });
});
