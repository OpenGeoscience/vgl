/* global describe, it, expect, vgl, mockVGLRenderer */

describe('vgl.mapper', function () {
  describe('Create', function () {
    it('create function', function () {
      var map = vgl.mapper();
      expect(map instanceof vgl.mapper).toBe(true);
      map = vgl.mapper({dynamicDraw: true});
      expect(map instanceof vgl.mapper).toBe(true);
    });
  });
  describe('Public methods', function () {
    var mapper, renderState, glCounts;
    it('computeBounds', function () {
      mockVGLRenderer();
      mapper = vgl.mapper();
      var viewer = vgl.viewer($('<canvas/>')[0]);
      viewer.init();
      var renderer = viewer.renderWindow().activeRenderer(),
          material = vgl.material(),
          geom = vgl.geometryData(),
          data = vgl.vertexAttribute('data'),
          prog = material.shaderProgram(),
          sourceData = vgl.sourceDataAnyfv(
            2, vgl.vertexAttributeKeysIndexed.One, {'name': 'data'});
      prog.addVertexAttribute(data, vgl.vertexAttributeKeysIndexed.One);
      material.addAttribute(prog);
      geom.addSource(sourceData);
      mapper.computeBounds();
      mapper.setGeometryData(geom);
      renderState = new vgl.renderState();
      renderState.m_renderer = renderer;
      renderState.m_context = renderer.renderWindow().context();
      renderState.m_mapper = mapper;
      renderState.m_material = material;
      expect(mapper.bounds()[0]).toBe(Number.MAX_VALUE);
      expect(mapper.bounds()[5]).toBe(-Number.MAX_VALUE);
      mapper.computeBounds();
      expect(mapper.bounds()).toEqual([0, 0, 0, 0, 0, 0]);
      mapper.setGeometryData(null);
      mapper.computeBounds();
      expect(mapper.bounds()[0]).toBe(Number.MAX_VALUE);
      expect(mapper.bounds()[5]).toBe(-Number.MAX_VALUE);
      mapper.setGeometryData(geom);
    });
    it('color and setColor', function () {
      expect(mapper.color()).toEqual([0, 1, 1]);
      mapper.setColor(0.5, 0.25, 0.1);
      expect(mapper.color()).toEqual([0.5, 0.25, 0.1]);
    });
    it('geometryData and setGeometryData', function () {
      var geom1 = vgl.geometryData(),
          geom2 = vgl.geometryData(),
          lasttime;
      lasttime = mapper.getMTime();
      mapper.setGeometryData(geom1);
      expect(mapper.geometryData()).toBe(geom1);
      expect(mapper.getMTime()).toBeGreaterThan(lasttime);
      lasttime = mapper.getMTime();
      mapper.setGeometryData(geom1);
      expect(mapper.geometryData()).toBe(geom1);
      expect(mapper.getMTime()).toBe(lasttime);
      mapper.setGeometryData(geom2);
      expect(mapper.geometryData()).toBe(geom2);
      expect(mapper.getMTime()).toBeGreaterThan(lasttime);
    });
    it('getSourceBuffer', function () {
      mapper.geometryData().addSource(vgl.sourceDataAnyfv(
            2, vgl.vertexAttributeKeysIndexed.One, {'name': 'source1'}));
      expect(mapper.getSourceBuffer('source1') instanceof Float32Array).toBe(true);
      expect(mapper.getSourceBuffer('not a source') instanceof Float32Array).toBe(true);
    });
    it('updateSourceBuffer', function () {
      expect(mapper.updateSourceBuffer()).toBe(false);
      expect(mapper.updateSourceBuffer('not a source', [], renderState)).toBe(false);
      mapper.render(renderState);
      expect(mapper.updateSourceBuffer('source1', undefined, renderState)).toBe(true);
      var src1 = new Float32Array([1, 1, 2, 3, 5, 8, 13, 21]);
      glCounts = $.extend({}, vgl.mockCounts());
      expect(mapper.updateSourceBuffer('source1', src1, renderState)).toBe(true);
      expect(vgl.mockCounts().bufferSubData).toBe((glCounts.bufferSubData || 0) + 1);
      glCounts = $.extend({}, vgl.mockCounts());
      expect(mapper.updateSourceBuffer('source1', [1, 1, 2, 3, 5, 8, 13, 21], renderState)).toBe(true);
      expect(vgl.mockCounts().bufferSubData).toBe((glCounts.bufferSubData || 0) + 1);
    });
    it('render and undoBindVertexData', function () {
      var triStrip = new vgl.triangleStrip(),
          tri = new vgl.triangles(),
          lineStrip = new vgl.lineStrip(),
          line = new vgl.lines(),
          point = new vgl.points(),
          src2 = vgl.sourceDataAnyfv(
            2, vgl.vertexAttributeKeysIndexed.One, {'name': 'source1'});
      triStrip.setIndices([0, 1, 2, 3, 4, 5, 6, 7]);
      tri.setIndices([0, 1, 2, 3, 4, 5, 6, 7]);
      lineStrip.setIndices([0, 1, 2, 3, 4, 5, 6, 7]);
      line.setIndices([0, 1, 2, 3, 4, 5, 6, 7]);
      point.setIndices([0, 1, 2, 3, 4, 5, 6, 7]);
      mapper.geometryData().addPrimitive(triStrip);
      glCounts = $.extend({}, vgl.mockCounts());
      mapper.modified();
      mapper.render(renderState);
      expect(vgl.mockCounts().drawArrays).toBe((glCounts.drawArrays || 0) + 1);

      mapper.geometryData().addPrimitive(tri);
      glCounts = $.extend({}, vgl.mockCounts());
      mapper.modified();
      mapper.render(renderState);
      expect(vgl.mockCounts().drawArrays).toBe((glCounts.drawArrays || 0) + 2);

      mapper.geometryData().addPrimitive(lineStrip);
      mapper.geometryData().addPrimitive(line);
      mapper.geometryData().addPrimitive(point);
      glCounts = $.extend({}, vgl.mockCounts());
      mapper.modified();
      mapper.render(renderState);
      expect(vgl.mockCounts().drawArrays).toBe((glCounts.drawArrays || 0) + 5);

      glCounts = $.extend({}, vgl.mockCounts());
      mapper.render(renderState);
      expect(vgl.mockCounts().disableVertexAttribArray).toBe((glCounts.disableVertexAttribArray || 0) + 1);
      mapper.render(renderState, true);
      expect(vgl.mockCounts().disableVertexAttribArray).toBe((glCounts.disableVertexAttribArray || 0) + 1);
      mapper.undoBindVertexData(renderState);
      expect(vgl.mockCounts().disableVertexAttribArray).toBe((glCounts.disableVertexAttribArray || 0) + 2);

      src2.setData([0, 1, 2, 3]);  // not Float32Array
      mapper.geometryData().addSource(src2);
      mapper.modified();
      mapper.render(renderState);
    });
    it('deleteVertexBufferObjects', function () {
      mapper.render(renderState);
      glCounts = $.extend({}, vgl.mockCounts());
      mapper.deleteVertexBufferObjects(renderState);
      expect(vgl.mockCounts().deleteBuffer).toBe((glCounts.deleteBuffer || 0) + 7);
    });
  });
});
