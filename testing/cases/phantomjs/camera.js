/* global describe, it, expect, vgl, closeToArray, closeToEqual */
describe('vgl.camera', function () {

  describe('Create', function () {
    it('create function', function () {
      var camera = vgl.camera();
      expect(camera instanceof vgl.camera).toBe(true);
      expect(camera.children().length).toBe(0);
      expect(camera.isEnabledParallelProjection()).toBe(false);
      camera = vgl.camera({parallelProjection: true});
      expect(camera.isEnabledParallelProjection()).toBe(true);
    });
  });
  describe('Public methods', function () {
    var camera, lasttime;
    it('clearMask and setClearMask', function () {
      camera = vgl.camera();
      expect(camera.clearMask()).toBe(
        vgl.GL.COLOR_BUFFER_BIT | vgl.GL.DEPTH_BUFFER_BIT);
      lasttime = camera.getMTime();
      camera.setClearMask(vgl.GL.COLOR_BUFFER_BIT);
      expect(camera.clearMask()).toBe(vgl.GL.COLOR_BUFFER_BIT);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
    });
    it('clearColor and setClearColor', function () {
      expect(camera.clearColor()).toEqual([0, 0, 0, 0]);
      lasttime = camera.getMTime();
      camera.setClearColor(0.1, 0.2, 0.3, 0.4);
      expect(closeToArray(camera.clearColor(), [0.1, 0.2, 0.3, 0.4])).toBe(true);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
    });
    it('clearDepth and setClearDepth', function () {
      expect(camera.clearDepth()).toBe(1);
      lasttime = camera.getMTime();
      camera.setClearDepth(0.5);
      expect(camera.clearDepth()).toBe(0.5);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
    });
    it('enableScale and setEnableScale', function () {
      expect(camera.enableScale()).toBe(true);
      lasttime = camera.getMTime();
      expect(camera.setEnableScale(true)).toBe(true);
      expect(camera.getMTime()).toBe(lasttime);
      expect(camera.setEnableScale(false)).toBe(true);
      expect(camera.enableScale()).toBe(false);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
      expect(camera.setEnableScale(false)).toBe(false);
      expect(camera.setEnableScale(true)).toBe(true);
      expect(camera.enableScale()).toBe(true);
    });
    it('enableTranslation and setEnableTranslation', function () {
      expect(camera.enableTranslation()).toBe(true);
      lasttime = camera.getMTime();
      expect(camera.setEnableTranslation(true)).toBe(true);
      expect(camera.getMTime()).toBe(lasttime);
      expect(camera.setEnableTranslation(false)).toBe(true);
      expect(camera.enableTranslation()).toBe(false);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
      expect(camera.setEnableTranslation(false)).toBe(false);
      expect(camera.setEnableTranslation(true)).toBe(true);
      expect(camera.enableTranslation()).toBe(true);
    });
    it('enableRotation and setEnableRotation', function () {
      expect(camera.enableRotation()).toBe(true);
      lasttime = camera.getMTime();
      expect(camera.setEnableRotation(true)).toBe(true);
      expect(camera.getMTime()).toBe(lasttime);
      expect(camera.setEnableRotation(false)).toBe(true);
      expect(camera.enableRotation()).toBe(false);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
      expect(camera.setEnableRotation(false)).toBe(false);
      expect(camera.setEnableRotation(true)).toBe(true);
      expect(camera.enableRotation()).toBe(true);
    });
    it('isEnabledParallelProjection, setEnableParallelProjection, and isEnabledParallelProjection', function () {
      expect(camera.isEnabledParallelProjection()).toBe(false);
      lasttime = camera.getMTime();
      expect(camera.setEnableParallelProjection(false)).toBe(false);
      expect(camera.getMTime()).toBe(lasttime);
      expect(camera.setEnableParallelProjection(true)).toBe(true);
      expect(camera.isEnabledParallelProjection()).toBe(true);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
      expect(camera.setEnableParallelProjection(true)).toBe(true);
      expect(camera.setEnableParallelProjection(false)).toBe(true);
      expect(camera.isEnabledParallelProjection()).toBe(false);
      lasttime = camera.getMTime();
      expect(camera.enableParallelProjection(false)).toBe(false);
      expect(camera.getMTime()).toBe(lasttime);
      expect(camera.enableParallelProjection(true)).toBe(true);
      expect(camera.isEnabledParallelProjection()).toBe(true);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
      expect(camera.enableParallelProjection(true)).toBe(true);
      expect(camera.enableParallelProjection(false)).toBe(true);
      expect(camera.isEnabledParallelProjection()).toBe(false);
    });
    it('viewAngle, setViewAngle, and setViewAngleDegrees', function () {
      expect(camera.viewAngle()).toBeCloseTo(Math.PI * 30 / 180);
      camera.setEnableScale(false);
      lasttime = camera.getMTime();
      camera.setViewAngle(0.5);
      expect(camera.viewAngle()).toBeCloseTo(Math.PI * 30 / 180);
      expect(camera.getMTime()).toBe(lasttime);
      camera.setViewAngleDegrees(20);
      expect(camera.viewAngle()).toBeCloseTo(Math.PI * 30 / 180);
      expect(camera.getMTime()).toBe(lasttime);
      camera.setEnableScale(true);
      lasttime = camera.getMTime();
      camera.setViewAngle(0.6);
      expect(camera.viewAngle()).toBeCloseTo(0.6);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
      lasttime = camera.getMTime();
      camera.setViewAngleDegrees(30);
      expect(camera.viewAngle()).toBeCloseTo(Math.PI * 30 / 180);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
    });
    it('position and setPosition', function () {
      expect(closeToArray(camera.position(), [0, 0, 1, 1])).toBe(true);
      camera.setEnableTranslation(false);
      lasttime = camera.getMTime();
      camera.setPosition(1, 2, 3);
      expect(closeToArray(camera.position(), [0, 0, 1, 1])).toBe(true);
      expect(camera.getMTime()).toBe(lasttime);
      camera.setEnableTranslation(true);
      lasttime = camera.getMTime();
      camera.setPosition(1, 2, 3);
      expect(closeToArray(camera.position(), [1, 2, 3, 1])).toBe(true);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
      camera.setPosition(0, 0, 1);
    });
    it('focalPoint and setFocalPoint', function () {
      expect(closeToArray(camera.focalPoint(), [0, 0, 0, 1])).toBe(true);
      camera.setEnableTranslation(false);
      lasttime = camera.getMTime();
      camera.setFocalPoint(1, 2, 3);
      expect(closeToArray(camera.focalPoint(), [0, 0, 0, 1])).toBe(true);
      expect(camera.getMTime()).toBe(lasttime);
      camera.setEnableTranslation(true);
      camera.setEnableRotation(false);
      lasttime = camera.getMTime();
      camera.setFocalPoint(1, 2, 3);
      expect(closeToArray(camera.focalPoint(), [0, 0, 0, 1])).toBe(true);
      expect(camera.getMTime()).toBe(lasttime);
      camera.setEnableRotation(true);
      lasttime = camera.getMTime();
      camera.setFocalPoint(1, 2, 3);
      expect(closeToArray(camera.focalPoint(), [1, 2, 3, 1])).toBe(true);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
      camera.setFocalPoint(0, 0, 0);
    });
    it('viewUpDirection and setViewUpDirection', function () {
      expect(closeToArray(camera.viewUpDirection(), [0, 1, 0, 0])).toBe(true);
      lasttime = camera.getMTime();
      camera.setViewUpDirection(1, 2, 3);
      expect(closeToArray(camera.viewUpDirection(), [1, 2, 3, 0])).toBe(true);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
      camera.setViewUpDirection(0, 1, 0);
    });
    it('centerOfRotation and setCenterOfRotation', function () {
      expect(closeToArray(camera.centerOfRotation(), [0, 0, 0])).toBe(true);
      lasttime = camera.getMTime();
      camera.setCenterOfRotation([1, 2, 3]);
      expect(camera.centerOfRotation()).toEqual([1, 2, 3]);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
      camera.setCenterOfRotation(vec3.fromValues(0, 0, 0));
    });
    it('clippingRange and setClippingRange', function () {
      expect(closeToArray(camera.clippingRange(), [0.01, 10000])).toBe(true);
      lasttime = camera.getMTime();
      camera.setClippingRange(1, 100);
      expect(closeToArray(camera.clippingRange(), [1, 100])).toBe(true);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
      camera.setClippingRange(0.01, 10000);
    });
    it('viewAspect and setViewAspect', function () {
      expect(camera.viewAspect()).toBeCloseTo(1);
      lasttime = camera.getMTime();
      camera.setViewAspect(4.0 / 3);
      expect(camera.viewAspect()).toBeCloseTo(1.333);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
      camera.setViewAspect(1);
    });
    it('unitsPerPixel', function () {
      expect(camera.unitsPerPixel(0)).toBeCloseTo(1.40625);
      expect(camera.unitsPerPixel(0, 360)).toBeCloseTo(1.00);
      expect(camera.unitsPerPixel(2, 360)).toBeCloseTo(0.25);
      expect(camera.unitsPerPixel(8, 360)).toBeCloseTo(0.00390625, 4);
      expect(camera.unitsPerPixel(8, 90)).toBeCloseTo(0.015625, 4);
      expect(camera.unitsPerPixel(8)).toBeCloseTo(0.0054931640625, 4);
    });
    it('parallelProjection and setParallelProjection', function () {
      expect(camera.parallelProjection()).toEqual({left: -1, right: 1, top: 1, bottom: -1});
      lasttime = camera.getMTime();
      camera.setParallelProjection(2, 3, 4, 5);
      expect(camera.parallelProjection()).toEqual({left: 2, right: 3, top: 4, bottom: 5});
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
    });
    it('parallelExtents and setParallelExtents', function () {
      camera.setParallelProjection(-1, 1, 1, -1);
      expect(camera.parallelProjection()).toEqual({left: -1, right: 1, top: 1, bottom: -1});
      expect(camera.parallelExtents()).toEqual({zoom: 1, tilesize: 256});
      lasttime = camera.getMTime();
      camera.setParallelExtents({zoom: 4, tilesize: 90});
      expect(camera.parallelExtents()).toEqual({zoom: 4, tilesize: 90});
      expect(camera.parallelProjection()).toEqual({left: -1, right: 1, top: 1, bottom: -1});
      expect(camera.getMTime()).toBe(lasttime);
      camera.setParallelExtents({tilesize: 256, width: 1280, height: 720});
      expect(camera.parallelExtents()).toEqual({zoom: 4, tilesize: 256, width: 1280, height: 720});
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
      expect(closeToEqual(camera.parallelProjection(), {left: -56.25, right: 56.25, top: 31.640625, bottom: -31.640625})).toBe(true);
    });
    it('viewAlignment', function () {
      camera.setParallelExtents({zoom: 4, tilesize: 256, width: 1280, height: 720});
      camera.setEnableParallelProjection(false);
      expect(closeToEqual(camera.viewAlignment(), {roundx: 0.0879, roundy: 0.0879, dx: 0, dy: 0}, 3)).toBe(true);
      camera.setProjectionMatrix([0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]);
      expect(camera.viewAlignment()).toBe(null);
      camera.modified();
      expect(closeToEqual(camera.viewAlignment(), {roundx: 0.0879, roundy: 0.0879, dx: 0, dy: 0}, 3)).toBe(true);
      camera.setEnableParallelProjection(true);
      expect(closeToEqual(camera.viewAlignment(), {roundx: 0.0879, roundy: 0.0879, dx: 0, dy: 0}, 3)).toBe(true);
      camera.setParallelExtents({width: 0});
      expect(camera.viewAlignment()).toBe(null);
      camera.setParallelExtents({zoom: 2.5, width: 1280});
      expect(camera.viewAlignment()).toBe(null);
      camera.setParallelExtents({zoom: 2});
      expect(closeToEqual(camera.viewAlignment(), {roundx: 0.3516, roundy: 0.3516, dx: 0, dy: 0})).toBe(true);
      camera.setParallelExtents({width: 1001, height: 751});
      expect(closeToEqual(camera.viewAlignment(), {roundx: 0.3516, roundy: 0.3516, dx: 0.1758, dy: 0.1758})).toBe(true);
    });
    it('zoomToHeight', function () {
      expect(camera.zoomToHeight(0, 100, 100)).toBeCloseTo(262.410);
      expect(camera.zoomToHeight(0, undefined, 100)).toBeCloseTo(262.410);
      camera.setViewAngleDegrees(20);
      expect(camera.zoomToHeight(0, 100, 100)).toBeCloseTo(398.762);
      camera.setViewAngleDegrees(30);
      expect(camera.zoomToHeight(0, 100, 100)).toBeCloseTo(262.410);
      expect(camera.zoomToHeight(0, 0, 1024)).toBeCloseTo(2687.077);
      expect(camera.zoomToHeight(2, 0, 1024)).toBeCloseTo(671.769);
      expect(camera.zoomToHeight(8, 0, 1024)).toBeCloseTo(10.496);
    });
    it('directionOfProjection, computeDirectionOfProjection, viewPlaneNormal, and computeViewPlaneNormal', function () {
      expect(closeToArray(camera.directionOfProjection(), [0, 0, -1, 0])).toBe(true);
      expect(closeToArray(camera.viewPlaneNormal(), [0, 0, 1, 0])).toBe(true);
      camera.setPosition(-0.5, -0.4, 1.1);
      expect(closeToArray(camera.directionOfProjection(), [0.392, 0.314, -0.864, 0])).toBe(true);
      expect(closeToArray(camera.viewPlaneNormal(), [-0.392, -0.314, 0.864, 0])).toBe(true);
      camera.setFocalPoint(0.3, 0.2, -0.1);
      expect(closeToArray(camera.directionOfProjection(), [0.512, 0.384, -0.768, 0])).toBe(true);
      expect(closeToArray(camera.viewPlaneNormal(), [-0.512, -0.384, 0.768, 0])).toBe(true);
      camera.setPosition(0, 0, 1);
      camera.setFocalPoint(0, 0, 0);
      expect(closeToArray(camera.directionOfProjection(), [0, 0, -1, 0])).toBe(true);
      expect(closeToArray(camera.viewPlaneNormal(), [0, 0, 1, 0])).toBe(true);
    });
    it('projectionMatrix, computeProjectionMatrix, and setProjectionMatrix', function () {
      camera.setEnableParallelProjection(false);
      expect(closeToArray(camera.projectionMatrix(), [3.732, 0, 0, 0, 0, 3.732, 0, 0, 0, 0, -1, -1, 0, 0, -0.02, 0])).toBe(true);
      camera.setViewAngleDegrees(20);
      expect(closeToArray(camera.projectionMatrix(), [5.671, 0, 0, 0, 0, 5.671, 0, 0, 0, 0, -1, -1, 0, 0, -0.02, 0])).toBe(true);
      camera.setViewAspect(16.0 / 9);
      expect(closeToArray(camera.projectionMatrix(), [3.190, 0, 0, 0, 0, 5.671, 0, 0, 0, 0, -1, -1, 0, 0, -0.02, 0])).toBe(true);
      camera.setClippingRange(1, 100);
      expect(closeToArray(camera.projectionMatrix(), [3.190, 0, 0, 0, 0, 5.671, 0, 0, 0, 0, -1.02, -1, 0, 0, -2.02, 0])).toBe(true);
      camera.setEnableParallelProjection(true);
      expect(closeToArray(camera.projectionMatrix(), [0.00568, 0, 0, 0, 0, 0.00758, 0, 0, 0, 0, -0.0202, 0, 0, 0, -1.0202, 1]), 4).toBe(true);
      camera.setParallelProjection(-5, 4, 3, -2);
      expect(closeToArray(camera.projectionMatrix(), [0.222, 0, 0, 0, 0, 0.4, 0, 0, 0, 0, -0.0202, 0, 0.111, -0.2, -1.0202, 1])).toBe(true);
      camera.setClippingRange(0.01, 10000);
      expect(closeToArray(camera.projectionMatrix(), [0.222, 0, 0, 0, 0, 0.4, 0, 0, 0, 0, -0.0002, 0, 0.111, -0.2, -1, 1])).toBe(true);
      camera.setProjectionMatrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]);
      expect(closeToArray(camera.projectionMatrix(), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0])).toBe(true);
      camera.setEnableParallelProjection(false);
      expect(closeToArray(camera.projectionMatrix(), [3.190, 0, 0, 0, 0, 5.671, 0, 0, 0, 0, -1, -1, 0, 0, -0.02, 0])).toBe(true);
    });
    it('viewMatrix, computeViewMatrix and setViewMatrix', function () {
      expect(closeToArray(camera.viewMatrix(), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1, 1])).toBe(true);
      camera.setPosition(-0.5, -0.4, 1.1);
      expect(closeToArray(camera.viewMatrix(), [0.910, -0.130, -0.393, 0, 0, 0.949, -0.314, 0, 0.414, 0.286, 0.864, 0, 0, 0, -1.273, 1])).toBe(true);
      camera.setFocalPoint(0.3, 0.2, -0.1);
      expect(closeToArray(camera.viewMatrix(), [0.832, -0.213, -0.512, 0, 0, 0.923, -0.384, 0, 0.555, 0.320, 0.768, 0, -0.194, -0.089, -1.255, 1])).toBe(true);
      camera.setViewUpDirection(0.5, Math.sqrt(0.75), 0);
      expect(closeToArray(camera.viewMatrix(), [0.823, 0.246, -0.512, 0, -0.475, 0.792, -0.384, 0, 0.311, 0.560, 0.768, 0, -0.121, -0.176, -1.255, 1])).toBe(true);
      camera.setViewMatrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]);
      expect(closeToArray(camera.viewMatrix(), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0])).toBe(true);
      camera.setViewMatrix([1 + 1e-12, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]);
      expect(camera.viewMatrix() instanceof Float32Array).toBe(true);
      expect(camera.viewMatrix()[0]).toBe(1);
      camera.setViewMatrix([1 + 1e-12, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], true);
      expect(camera.viewMatrix()[0]).not.toBe(1);
      expect(camera.viewMatrix() instanceof Float32Array).toBe(false);
      camera.setViewMatrix(mat4.create());
      expect(camera.viewMatrix() instanceof Float32Array).toBe(false);
      camera.modified();
      expect(closeToArray(camera.viewMatrix(), [0.823, 0.246, -0.512, 0, -0.475, 0.792, -0.384, 0, 0.311, 0.560, 0.768, 0, -0.121, -0.176, -1.255, 1])).toBe(true);
    });
  });
  describe('Movement methods', function () {
    it('zoom', function () {
      var camera = vgl.camera(), lasttime;
      lasttime = camera.getMTime();
      camera.zoom(0);
      expect(camera.getMTime()).toBe(lasttime);
      camera.setEnableTranslation(false);
      lasttime = camera.getMTime();
      camera.zoom(1);
      expect(camera.getMTime()).toBe(lasttime);
      camera.setEnableTranslation(true);
      camera.zoom(2);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
      expect(closeToArray(camera.position(), [0, 0, 2, 1])).toBe(true);
      camera.zoom(2);
      expect(closeToArray(camera.position(), [0, 0, 4, 1])).toBe(true);
      camera.zoom(2, [0, 0, 1]);
      expect(closeToArray(camera.position(), [0, 0, 12, 1])).toBe(true);
      camera.zoom(0.1, [0.2, 0.3, 0.4]);
      expect(closeToArray(camera.position(), [0.240, 0.360, 12.480, 1])).toBe(true);
    });
    it('pan', function () {
      var camera = vgl.camera(), lasttime;
      expect(closeToArray(camera.position(), [0, 0, 1, 1])).toBe(true);
      expect(closeToArray(camera.focalPoint(), [0, 0, 0, 1])).toBe(true);
      camera.setEnableTranslation(false);
      lasttime = camera.getMTime();
      camera.pan(0.1, 0.2, 0.3);
      expect(camera.getMTime()).toBe(lasttime);
      expect(closeToArray(camera.position(), [0, 0, 1, 1])).toBe(true);
      expect(closeToArray(camera.focalPoint(), [0, 0, 0, 1])).toBe(true);
      camera.setEnableTranslation(true);
      camera.pan(0.1, 0.2, 0.3);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
      expect(closeToArray(camera.position(), [0.1, 0.2, 1.3, 1])).toBe(true);
      expect(closeToArray(camera.focalPoint(), [0.1, 0.2, 0.3, 1])).toBe(true);
    });
    it('rotate and computeOrthogonalAxes', function () {
      var camera = vgl.camera(), lasttime;
      expect(closeToArray(camera.position(), [0, 0, 1, 1])).toBe(true);
      expect(closeToArray(camera.focalPoint(), [0, 0, 0, 1])).toBe(true);
      expect(closeToArray(camera.viewUpDirection(), [0, 1, 0, 0])).toBe(true);
      camera.setEnableRotation(false);
      lasttime = camera.getMTime();
      camera.rotate(5, 6);
      expect(camera.getMTime()).toBe(lasttime);
      expect(closeToArray(camera.position(), [0, 0, 1, 1])).toBe(true);
      expect(closeToArray(camera.focalPoint(), [0, 0, 0, 1])).toBe(true);
      expect(closeToArray(camera.viewUpDirection(), [0, 1, 0, 0])).toBe(true);
      camera.setEnableRotation(true);
      camera.rotate(5, 6);
      expect(camera.getMTime()).toBeGreaterThan(lasttime);
      expect(closeToArray(camera.position(), [0.0436, -0.0523, 0.9977, 1], 3)).toBe(true);
      expect(closeToArray(camera.focalPoint(), [0, 0, 0, 1], 3)).toBe(true);
      expect(closeToArray(camera.viewUpDirection(), [0.0023, 0.9986, 0.0523, 0], 3)).toBe(true);
      camera.setCenterOfRotation([0.1, 0.2, 0.3]);
      camera.rotate(-4, -3);
      expect(closeToArray(camera.position(), [0.0189, -0.0339, 1.0017, 1], 3)).toBe(true);
      expect(closeToArray(camera.focalPoint(), [0.0102, -0.0077, 0.0020, 1], 3)).toBe(true);
      expect(closeToArray(camera.viewUpDirection(), [0.0021, 1, 0.0261, 0], 3)).toBe(true);
      camera.setPosition(-0.5, -0.4, 1.1);
      camera.rotate(-2, -1);
      expect(closeToArray(camera.position(), [-0.5142, -0.3927, 1.0946, 1], 3)).toBe(true);
      expect(closeToArray(camera.focalPoint(), [0.0153, -0.0103, 0.0024, 1], 3)).toBe(true);
      expect(closeToArray(camera.viewUpDirection(), [0.0021, 1, 0.0174, 0], 3)).toBe(true);
      camera.setFocalPoint(0.3, 0.2, -0.1);
      camera.rotate(7, -8);
      expect(closeToArray(camera.position(), [-0.4781, -0.3235, 1.1670, 1], 3)).toBe(true);
      expect(closeToArray(camera.focalPoint(), [0.2746, 0.1690, -0.1106, 1], 3)).toBe(true);
      expect(closeToArray(camera.viewUpDirection(), [0.0285, 0.9985, -0.0472, 0], 3)).toBe(true);
    });
  });
  describe('General methods', function () {
    it('zoomToHeight', function () {
      expect(vgl.zoomToHeight(0, 100, 100)).toBeCloseTo(262.410);
      expect(vgl.zoomToHeight(0, undefined, 100)).toBeCloseTo(262.410);
      expect(vgl.zoomToHeight(0, 100, 100, Math.PI * 30 / 180)).toBeCloseTo(262.410);
      expect(vgl.zoomToHeight(0, 100, 100, Math.PI * 20 / 180)).toBeCloseTo(398.762);
      expect(vgl.zoomToHeight(0, 0, 1024)).toBeCloseTo(2687.077);
      expect(vgl.zoomToHeight(2, 0, 1024)).toBeCloseTo(671.769);
      expect(vgl.zoomToHeight(8, 0, 1024)).toBeCloseTo(10.496);
    });
    it('heightToZoom', function () {
      expect(vgl.heightToZoom(262.410, 100, 100)).toBeCloseTo(0);
      expect(vgl.heightToZoom(262.410, undefined, 100)).toBeCloseTo(0);
      expect(vgl.heightToZoom(262.410, 100, 100, Math.PI * 30 / 180)).toBeCloseTo(0);
      expect(vgl.heightToZoom(398.762, 100, 100, Math.PI * 20 / 180)).toBeCloseTo(0);
      expect(vgl.heightToZoom(2500, 0, 1024)).toBeCloseTo(0.104);
      expect(vgl.heightToZoom(625, 0, 1024)).toBeCloseTo(2.104);
      expect(vgl.heightToZoom(10, 0, 1024)).toBeCloseTo(8.070);
    });
  });
});
