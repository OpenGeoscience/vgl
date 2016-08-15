/*global describe, it, expect, vgl, mockVGLRenderer*/

describe('vgl.uniform', function () {

  describe('Create', function () {
    it('create function', function () {
      var uni = vgl.uniform();
      expect(uni instanceof vgl.uniform).toBe(true);
      expect(uni.name()).toBe(undefined);
      expect(uni.type()).toBe(undefined);
      expect(uni.get().length).toBe(0);
      uni = vgl.uniform(vgl.GL.FLOAT, 'sample');
      expect(uni instanceof vgl.uniform).toBe(true);
      expect(uni.name()).toBe('sample');
      expect(uni.type()).toBe(vgl.GL.FLOAT);
      expect(uni.get().length).toBe(1);
      uni = new vgl.uniform(vgl.GL.INT_VEC2, 'sample2');
      expect(uni instanceof vgl.uniform).toBe(true);
      expect(uni.name()).toBe('sample2');
      expect(uni.type()).toBe(vgl.GL.INT_VEC2);
      expect(uni.get().length).toBe(2);
    });
  });
  describe('Public methods', function () {
    var types = [
      {type: vgl.GL.BOOL, comp: 1, uniform: 'uniform1iv'},
      {type: vgl.GL.FLOAT, comp: 1, uniform: 'uniform1fv'},
      {type: vgl.GL.INT, comp: 1, uniform: 'uniform1iv'},
      {type: vgl.GL.BOOL_VEC2, comp: 2, uniform: 'uniform2iv'},
      {type: vgl.GL.FLOAT_VEC2, comp: 2, uniform: 'uniform2fv'},
      {type: vgl.GL.INT_VEC2, comp: 2, uniform: 'uniform2iv'},
      {type: vgl.GL.BOOL_VEC3, comp: 3, uniform: 'uniform3iv'},
      {type: vgl.GL.FLOAT_VEC3, comp: 3, uniform: 'uniform3fv'},
      {type: vgl.GL.INT_VEC3, comp: 3, uniform: 'uniform3iv'},
      {type: vgl.GL.BOOL_VEC4, comp: 4, uniform: 'uniform4iv'},
      {type: vgl.GL.FLOAT_VEC4, comp: 4, uniform: 'uniform4fv'},
      {type: vgl.GL.INT_VEC4, comp: 4, uniform: 'uniform4iv'},
      {type: vgl.GL.FLOAT_MAT3, comp: 9, uniform: 'uniformMatrix3fv'},
      {type: vgl.GL.FLOAT_MAT4, comp: 16, uniform: 'uniformMatrix4fv'},
      {type: 'unknown', comp: 0}
    ];
    it('getTypeNumberOfComponents', function () {
      var uni = vgl.uniform(), i;
      for (i = 0; i < types.length; i += 1) {
        expect(uni.getTypeNumberOfComponents(types[i].type)).toBe(types[i].comp);
      }
    });
    it('name', function () {
      var uni, i;
      for (i = 0; i < types.length; i += 1) {
        uni = vgl.uniform(types[i].type, 'uniform_' + i);
        expect(uni.name()).toBe('uniform_' + i);
      }
    });
    it('type', function () {
      var uni, i;
      for (i = 0; i < types.length; i += 1) {
        uni = vgl.uniform(types[i].type, 'uniform_' + i);
        expect(uni.type()).toBe(types[i].type);
      }
    });
    it('set and get', function () {
      var uni, i, j, counter = 0, data;
      for (i = 0; i < types.length; i += 1) {
        uni = vgl.uniform(types[i].type, 'uniform_' + i);
        data = new Array(types[i].comp);
        for (j = 0; j < types[i].comp; j += 1, counter += 1) {
          data[j] = counter;
        }
        if (types[i].comp !== 1) {
          uni.set(data);
        } else {
          uni.set(data[0]);
        }
        expect(uni.get()).toEqual(data);
      }
    });
    it('callGL', function () {
      mockVGLRenderer();
      var viewer = vgl.viewer($('<canvas/>')[0]);
      viewer.init();
      var renderer = viewer.renderWindow().activeRenderer();
      var renderState = new vgl.renderState();
      renderState.m_renderer = renderer;
      renderState.m_context = renderer.renderWindow().context();
      var uni, i, glCounts;
      for (i = 0; i < types.length; i += 1) {
        glCounts = $.extend({}, vgl.mockCounts());
        uni = vgl.uniform(types[i].type, 'uniform_' + i);
        uni.callGL(renderState, 'location');
        if (types[i].uniform) {
          expect(vgl.mockCounts()[types[i].uniform]).toBe((glCounts[types[i].uniform] || 0) + 1);
        }
      }
    });
    it('update', function () {
      var uni, i;
      for (i = 0; i < types.length; i += 1) {
        uni = vgl.uniform(types[i].type, 'uniform_' + i);
        expect(uni.update()).toBe(undefined);
      }
    });
  });
});

describe('vgl.modelViewUniform', function () {
  describe('Create', function () {
    it('create function', function () {
      var uni = vgl.modelViewUniform();
      expect(uni instanceof vgl.modelViewUniform).toBe(true);
      expect(uni instanceof vgl.uniform).toBe(true);
      expect(uni.name()).toBe('modelViewMatrix');
      expect(uni.type()).toBe(vgl.GL.FLOAT_MAT4);
      expect(uni.get().length).toBe(16);
      expect(Array.prototype.slice.call(uni.get())).toEqual([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      uni = vgl.modelViewUniform('sample');
      expect(uni instanceof vgl.modelViewUniform).toBe(true);
      expect(uni.name()).toBe('sample');
    });
  });
  describe('Public methods', function () {
    it('update', function () {
      var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      var renderState = {m_modelViewMatrix: data};
      var uni = vgl.modelViewUniform();
      uni.update(renderState);
      expect(uni.get()).toEqual(data);
    });
  });
});

describe('vgl.modelViewOriginUniform', function () {
  describe('Create', function () {
    it('create function', function () {
      var uni = vgl.modelViewOriginUniform();
      expect(uni instanceof vgl.modelViewOriginUniform).toBe(true);
      expect(uni instanceof vgl.uniform).toBe(true);
      expect(uni.name()).toBe('modelViewMatrix');
      expect(uni.type()).toBe(vgl.GL.FLOAT_MAT4);
      expect(uni.get().length).toBe(16);
      expect(Array.prototype.slice.call(uni.get())).toEqual([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      uni = vgl.modelViewUniform('sample', [1, 2, 3]);
      expect(uni instanceof vgl.modelViewUniform).toBe(true);
      expect(uni.name()).toBe('sample');
    });
  });
  describe('Public methods', function () {
    it('setOrigin', function () {
      var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      var renderState = {m_modelViewMatrix: data};
      var uni = vgl.modelViewOriginUniform('sample', [1, 2, 3]);
      uni.setOrigin([4, 5]);
      uni.update(renderState);
      expect(uni.get()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 42, 52, 62, 72]);
    });
    it('update', function () {
      var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      var renderState = {m_modelViewMatrix: data};
      var uni = vgl.modelViewOriginUniform('sample', [1, 2, 3]);
      uni.update(renderState);
      expect(uni.get()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 51, 58, 65, 72]);

      renderState.m_modelViewAlignment = {
        roundx: 4, dx: 0,
        roundy: 5, dy: 0
      };
      uni.update(renderState);
      expect(uni.get()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 50, 59, 65, 72]);
      renderState.m_modelViewAlignment = {
        roundx: 5, dx: 100,
        roundy: 6, dy: 200
      };
      uni.update(renderState);
      expect(uni.get()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 153, 256, 65, 72]);
    });
  });
});

describe('vgl.projectionUniform', function () {
  describe('Create', function () {
    it('create function', function () {
      var uni = vgl.projectionUniform();
      expect(uni instanceof vgl.projectionUniform).toBe(true);
      expect(uni instanceof vgl.uniform).toBe(true);
      expect(uni.name()).toBe('projectionMatrix');
      expect(uni.type()).toBe(vgl.GL.FLOAT_MAT4);
      expect(uni.get().length).toBe(16);
      expect(Array.prototype.slice.call(uni.get())).toEqual([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      uni = vgl.projectionUniform('sample');
      expect(uni instanceof vgl.projectionUniform).toBe(true);
      expect(uni.name()).toBe('sample');
    });
  });
  describe('Public methods', function () {
    it('update', function () {
      var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      var renderState = {m_projectionMatrix: data};
      var uni = vgl.projectionUniform();
      uni.update(renderState);
      expect(uni.get()).toEqual(data);
    });
  });
});

describe('vgl.floatUniform', function () {
  describe('Create', function () {
    it('create function', function () {
      var uni = vgl.floatUniform();
      expect(uni instanceof vgl.floatUniform).toBe(true);
      expect(uni instanceof vgl.uniform).toBe(true);
      expect(uni.name()).toBe('floatUniform');
      expect(uni.type()).toBe(vgl.GL.FLOAT);
      expect(uni.get().length).toBe(1);
      expect(uni.get()).toEqual([1]);
      uni = vgl.floatUniform('sample', 5);
      expect(uni instanceof vgl.floatUniform).toBe(true);
      expect(uni.name()).toBe('sample');
      expect(uni.get()).toEqual([5]);
    });
  });
});

describe('vgl.normalMatrixUniform', function () {
  describe('Create', function () {
    it('create function', function () {
      var uni = vgl.normalMatrixUniform();
      expect(uni instanceof vgl.normalMatrixUniform).toBe(true);
      expect(uni instanceof vgl.uniform).toBe(true);
      expect(uni.name()).toBe('normalMatrix');
      expect(uni.type()).toBe(vgl.GL.FLOAT_MAT4);
      expect(uni.get().length).toBe(16);
      expect(Array.prototype.slice.call(uni.get())).toEqual([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      uni = vgl.normalMatrixUniform('sample');
      expect(uni instanceof vgl.normalMatrixUniform).toBe(true);
      expect(uni.name()).toBe('sample');
    });
  });
  describe('Public methods', function () {
    it('update', function () {
      var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      var renderState = {m_normalMatrix: data};
      var uni = vgl.normalMatrixUniform();
      uni.update(renderState);
      expect(uni.get()).toEqual(data);
    });
  });
});
