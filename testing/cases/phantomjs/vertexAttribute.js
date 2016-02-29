/* global describe, it, expect, vgl, mockVGLRenderer */

describe('vgl.vertexAttribute', function () {
  describe('Create', function () {
    it('create function', function () {
      var va = vgl.vertexAttribute();
      expect(va instanceof vgl.vertexAttribute).toBe(true);
      expect(va.name()).toBe(undefined);
      va = vgl.vertexAttribute('name');
      expect(va.name()).toBe('name');
    });
  });
  describe('Public methods', function () {
    var va, renderState, glCounts;
    it('bindVertexData', function () {
      mockVGLRenderer();
      va = vgl.vertexAttribute();
      var viewer = vgl.viewer($('<canvas/>')[0]);
      viewer.init();
      var renderer = viewer.renderWindow().activeRenderer(),
          mapper = vgl.mapper(),
          material = vgl.material(),
          geom = vgl.geometryData(),
          data = vgl.vertexAttribute('data'),
          prog = vgl.shaderProgram(),
          sourceData = vgl.sourceDataAnyfv(
            2, vgl.vertexAttributeKeysIndexed.One, {'name': 'data'});
      prog.addVertexAttribute(data, vgl.vertexAttributeKeysIndexed.One);
      material.addAttribute(prog);
      geom.addSource(sourceData);
      mapper.setGeometryData(geom);
      renderState = new vgl.renderState();
      renderState.m_renderer = renderer;
      renderState.m_context = renderer.renderWindow().context();
      renderState.m_mapper = mapper;
      renderState.m_material = material;
      glCounts = $.extend({}, vgl.mockCounts());
      va.bindVertexData(renderState, 1);
      expect(vgl.mockCounts().vertexAttribPointer).toBe((glCounts.vertexAttribPointer || 0) + 1);
      expect(vgl.mockCounts().enableVertexAttribArray).toBe((glCounts.enableVertexAttribArray || 0) + 1);
    });
    it('undoBindVertexData', function () {
      glCounts = $.extend({}, vgl.mockCounts());
      va.undoBindVertexData(renderState, 1);
      expect(vgl.mockCounts().disableVertexAttribArray).toBe((glCounts.disableVertexAttribArray || 0) + 1);
    });
  });
});
