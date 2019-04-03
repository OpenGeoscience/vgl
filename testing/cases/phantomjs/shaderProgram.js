/* global describe, it, expect, vgl, mockVGLRenderer, getBaseUrl */

describe('vgl.shaderProgram', function () {
  describe('Create', function () {
    it('create function', function () {
      var sp = vgl.shaderProgram();
      expect(sp instanceof vgl.shaderProgram).toBe(true);
    });
  });
  describe('Public methods', function () {
    var sp, renderState, glCounts;
    var vertexShaderSource = 'varying vec4 color; void main () { gl_FragColor = colorVar; }';
    it('loadFromFile and loadShader', function () {
      sp = vgl.shaderProgram();
      /* Temporarily reroute $.ajax so we can test our function */
      var ajax = $.ajax, results;
      $.ajax = function (opts) {
        opts.success(opts.url);
        results = opts;
      };
      expect(sp.loadFromFile(vgl.GL.FRAGMENT_SHADER, 'testurl')).toBe(true);
      expect(results.url).toBe('testurl');
      expect(sp.loadShader(vgl.GL.FRAGMENT_SHADER, 'filename')).toBe(true);
      expect(results.url).toBe(getBaseUrl() + '/shaders/filename');
      $.ajax = ajax;
      expect(sp.loadFromFile(vgl.GL.FRAGMENT_SHADER, 'not a url')).toBe(false);
      expect(sp.loadShader(vgl.GL.FRAGMENT_SHADER, 'filename')).toBe(false);
    });
    it('queryUniformLocation and addVertexAttribute', function () {
      mockVGLRenderer();
      var viewer = vgl.viewer($('<canvas/>')[0]);
      viewer.init();
      var renderer = viewer.renderWindow().activeRenderer(),
          mapper = vgl.mapper(),
          material = vgl.material(),
          geom = vgl.geometryData(),
          data = vgl.vertexAttribute('data'),
          sourceData = vgl.sourceDataAnyfv(
            2, vgl.vertexAttributeKeysIndexed.One, {'name': 'data'});
      // addVertexAttribute doesn't return anything, so this just exercises the
      // code without any further test.
      sp.addVertexAttribute(data, vgl.vertexAttributeKeysIndexed.One);
      material.addAttribute(sp);
      geom.addSource(sourceData);
      mapper.setGeometryData(geom);
      renderState = new vgl.renderState();
      renderState.m_renderer = renderer;
      renderState.m_context = renderer.renderWindow().context();
      renderState.m_mapper = mapper;
      renderState.m_material = material;
      var mvi = new vgl.modelViewUniform('modelViewMatrix');
      glCounts = $.extend({}, vgl.mockCounts());
      // mock VGL just increments the location each time
      expect(sp.queryUniformLocation(renderState, mvi)).toBe(1);
      expect(vgl.mockCounts().getUniformLocation).toBe((glCounts.getUniformLocation || 0) + 1);
      expect(sp.queryUniformLocation(renderState, mvi)).toBe(2);
      expect(vgl.mockCounts().getUniformLocation).toBe((glCounts.getUniformLocation || 0) + 2);
    });
    it('queryAttributeLocation', function () {
      glCounts = $.extend({}, vgl.mockCounts());
      // mock VGL just increments the location each time
      expect(sp.queryAttributeLocation(renderState, 'name1')).toBe(3);
      expect(vgl.mockCounts().getAttribLocation).toBe((glCounts.getAttribLocation || 0) + 1);
      expect(sp.queryAttributeLocation(renderState, 'name2')).toBe(4);
      expect(vgl.mockCounts().getAttribLocation).toBe((glCounts.getAttribLocation || 0) + 2);
    });
    it('addShader', function () {
      var shader1 = vgl.shader(vgl.GL.FRAGMENT_SHADER),
          shader2 = vgl.shader(vgl.GL.VERTEX_SHADER),
          shader3 = vgl.shader(vgl.GL.FRAGMENT_SHADER);
      shader1.setShaderSource(vertexShaderSource);
      expect(sp.addShader(shader1)).toBe(true);
      expect(sp.addShader(shader1)).toBe(false);
      expect(sp.addShader(shader2)).toBe(true);
      expect(sp.addShader(shader1)).toBe(false);
      expect(sp.addShader(shader3)).toBe(true);
      expect(sp.addShader(shader1)).toBe(true);
    });
    it('addUniform and uniform', function () {
      var mvi = new vgl.modelViewUniform('modelViewMatrix'),
          floatuni = new vgl.floatUniform('aspect', 1.0);
      expect(sp.addUniform(mvi)).toBe(true);
      expect(sp.addUniform(mvi)).toBe(false);
      expect(sp.uniform('aspect')).toBe(null);
      expect(sp.addUniform(floatuni)).toBe(true);
      expect(sp.uniform('aspect')).toBe(floatuni);
    });
    it('uniformLocation, bindUniforms, and updateUniforms', function () {
      expect(sp.uniformLocation('aspect')).toBe(undefined);
      sp.bindUniforms(renderState);
      var val = sp.uniformLocation('aspect');
      expect(val).toBeGreaterThan(1);
      sp.bindUniforms(renderState);
      expect(sp.uniformLocation('aspect')).toBeGreaterThan(val);
      glCounts = $.extend({}, vgl.mockCounts());
      sp.updateUniforms(renderState);
      expect(vgl.mockCounts().uniform1fv).toBe((glCounts.uniform1fv || 0) + 1);
      expect(vgl.mockCounts().uniformMatrix4fv).toBe((glCounts.uniformMatrix4fv || 0) + 1);
    });
    it('attributeLocation and bindAttributes', function () {
      var posAttr = vgl.vertexAttribute('pos'),
          clrAttr = vgl.vertexAttribute('color');
      expect(sp.attributeLocation('color')).toBe(undefined);
      sp.addVertexAttribute(posAttr, vgl.vertexAttributeKeys.Position);
      sp.addVertexAttribute(clrAttr, vgl.vertexAttributeKeysIndexed.One);
      expect(sp.attributeLocation('color')).toBe(undefined);
      glCounts = $.extend({}, vgl.mockCounts());
      sp.bindAttributes(renderState);
      expect(vgl.mockCounts().bindAttribLocation).toBe((glCounts.bindAttribLocation || 0) + 2);
      expect(sp.attributeLocation('pos')).toBe('0');
      expect(sp.attributeLocation('color')).toBe('1');
      // we added data earlier and repalced it with color
      expect(sp.attributeLocation('data')).toBe(undefined);
    });
    it('link', function () {
      glCounts = $.extend({}, vgl.mockCounts());
      expect(sp.link(renderState)).toBe(true);
      expect(vgl.mockCounts().linkProgram).toBe((glCounts.linkProgram || 0) + 1);
      var oldGPP = renderState.m_context.getProgramParameter;
      renderState.m_context.getProgramParameter = function () { };
      expect(sp.link(renderState)).toBe(false);
      renderState.m_context.getProgramParameter = oldGPP;
    });
    it('use', function () {
      glCounts = $.extend({}, vgl.mockCounts());
      sp.use(renderState);
      expect(vgl.mockCounts().useProgram).toBe((glCounts.useProgram || 0) + 1);
    });
    it('deleteProgram', function () {
      sp._setup(renderState);
      glCounts = $.extend({}, vgl.mockCounts());
      sp.deleteProgram(renderState);
      expect(vgl.mockCounts().deleteProgram).toBe((glCounts.deleteProgram || 0) + 1);
    });
    it('deleteVertexAndFragment', function () {
      glCounts = $.extend({}, vgl.mockCounts());
      sp.deleteVertexAndFragment(renderState);
      expect(vgl.mockCounts().deleteShader).toBe((glCounts.deleteShader || 0) + 3);
    });
    it('compileAndLink', function () {
      glCounts = $.extend({}, vgl.mockCounts());
      sp.compileAndLink(renderState);
      expect(vgl.mockCounts().attachShader).toBe((glCounts.attachShader || 0) + 3);
      sp.compileAndLink(renderState);
      expect(vgl.mockCounts().attachShader).toBe((glCounts.attachShader || 0) + 3);
      var oldGPP = renderState.m_context.getProgramParameter;
      renderState.m_context.getProgramParameter = function () { };
      sp.modified();
      glCounts = $.extend({}, vgl.mockCounts());
      sp.compileAndLink(renderState);
      renderState.m_context.getProgramParameter = oldGPP;
      expect(vgl.mockCounts().deleteProgram).toBe((glCounts.deleteProgram || 0) + 1);
    });
    it('bind', function () {
      sp.modified();
      glCounts = $.extend({}, vgl.mockCounts());
      sp.bind(renderState);
      expect(vgl.mockCounts().attachShader).toBe((glCounts.attachShader || 0) + 3);
      expect(vgl.mockCounts().uniform1fv).toBe((glCounts.uniform1fv || 0) + 1);
      glCounts = $.extend({}, vgl.mockCounts());
      sp.bind(renderState);
      expect(vgl.mockCounts().attachShader).toBe(glCounts.attachShader);
      expect(vgl.mockCounts().uniform1fv).toBe((glCounts.uniform1fv || 0) + 1);
    });
    it('undoBind', function () {
      glCounts = $.extend({}, vgl.mockCounts());
      sp.undoBind(renderState);
      expect(vgl.mockCounts().useProgram).toBe((glCounts.useProgram || 0) + 1);
    });
    it('bindVertexData', function () {
      glCounts = $.extend({}, vgl.mockCounts());
      sp.bindVertexData(renderState, '1');
      expect(vgl.mockCounts().vertexAttribPointer).toBe((glCounts.vertexAttribPointer || 0) + 1);
      expect(vgl.mockCounts().enableVertexAttribArray).toBe((glCounts.enableVertexAttribArray || 0) + 1);
      sp.bindVertexData(renderState, 'not an attrib');
      expect(vgl.mockCounts().vertexAttribPointer).toBe((glCounts.vertexAttribPointer || 0) + 1);
      expect(vgl.mockCounts().enableVertexAttribArray).toBe((glCounts.enableVertexAttribArray || 0) + 1);
    });
    it('undoBindVertexData', function () {
      glCounts = $.extend({}, vgl.mockCounts());
      sp.undoBindVertexData(renderState, '1');
      expect(vgl.mockCounts().disableVertexAttribArray).toBe((glCounts.disableVertexAttribArray || 0) + 1);
      sp.undoBindVertexData(renderState, 'not an attrib');
      expect(vgl.mockCounts().disableVertexAttribArray).toBe((glCounts.disableVertexAttribArray || 0) + 1);
    });
  });
  describe('Private methods', function () {
    it('_setup and _cleanup', function () {
      mockVGLRenderer();
      var sp = vgl.shaderProgram(), glCounts, renderState;
      var viewer = vgl.viewer($('<canvas/>')[0]);
      viewer.init();
      var renderer = viewer.renderWindow().activeRenderer();
      renderState = new vgl.renderState();
      renderState.m_renderer = renderer;
      renderState.m_context = renderer.renderWindow().context();
      glCounts = $.extend({}, vgl.mockCounts());
      sp._setup(renderState);
      expect(vgl.mockCounts().createProgram).toBe((glCounts.createProgram || 0) + 1);
      sp._setup(renderState);
      expect(vgl.mockCounts().createProgram).toBe((glCounts.createProgram || 0) + 1);
      sp._cleanup(renderState);
      sp._setup(renderState);
      expect(vgl.mockCounts().createProgram).toBe((glCounts.createProgram || 0) + 2);
    });
  });
  describe('Global functions', function () {
    it('getBaseUrl', function () {
      /* In our test environment, this is the empty string. */
      expect(getBaseUrl()).toBe('');
    });
  });
});
