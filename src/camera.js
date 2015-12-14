//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*global vgl, vec3, vec4, mat4, inherit*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class camera
 *
 * @class
 * @returns {vgl.camera}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.camera = function (arg) {
  'use strict';

  if (!(this instanceof vgl.camera)) {
    return new vgl.camera(arg);
  }
  vgl.groupNode.call(this);
  arg = arg || {};

  /** @private */
  var m_viewAngle = (Math.PI * 30) / 180.0,
      m_position = vec4.fromValues(0.0, 0.0, 1.0, 1.0),
      m_focalPoint = vec4.fromValues(0.0, 0.0, 0.0, 1.0),
      m_centerOfRotation = vec3.fromValues(0.0, 0.0, 0.0),
      m_viewUp = vec4.fromValues(0.0, 1.0, 0.0, 0.0),
      m_rightDir = vec4.fromValues(1.0, 0.0, 0.0, 0.0),
      m_near = 0.01,
      m_far = 10000.0,
      m_viewAspect = 1.0,
      m_directionOfProjection = vec4.fromValues(0.0, 0.0, -1.0, 0.0),
      m_viewPlaneNormal = vec4.fromValues(0.0, 0.0, 1.0, 0.0),
      m_viewMatrix = mat4.create(),
      m_projectionMatrix = mat4.create(),
      m_computeModelViewMatrixTime = vgl.timestamp(),
      m_computeProjectMatrixTime = vgl.timestamp(),
      m_left = -1.0,
      m_right = 1.0,
      m_top = +1.0,
      m_bottom = -1.0,
      m_parallelExtents = {zoom: 1, tilesize: 256},
      m_enableTranslation = true,
      m_enableRotation = true,
      m_enableScale = true,
      m_enableParallelProjection = false,
      m_clearColor = [0.0, 0.0, 0.0, 0.0],
      m_clearDepth = 1.0,
      /*jshint bitwise: false */
      m_clearMask = vgl.GL.COLOR_BUFFER_BIT |
                    vgl.GL.DEPTH_BUFFER_BIT;
  /*jshint bitwise: true */

  if (arg.parallelProjection !== undefined) {
    m_enableParallelProjection = arg.parallelProjection ? true : false;
  }

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get view angle of the camera
   */
  ////////////////////////////////////////////////////////////////////////////
  this.viewAngle = function () {
    return m_viewAngle;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set view angle of the camera in degrees, which is converted to radians.
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setViewAngleDegrees = function (a) {
    m_viewAngle = (Math.PI * a) / 180.0;
    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set view angle of the camera in degrees, which is converted to radians.
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setViewAngle = function (a) {
    if (m_enableScale) {
      m_viewAngle = a;
      this.modified();
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get position of the camera
   */
  ////////////////////////////////////////////////////////////////////////////
  this.position = function () {
    return m_position;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set position of the camera
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setPosition = function (x, y, z) {
    if (m_enableTranslation) {
      m_position = vec4.fromValues(x, y, z, 1.0);
      this.modified();
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get focal point of the camera
   */
  ////////////////////////////////////////////////////////////////////////////
  this.focalPoint = function () {
    return m_focalPoint;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set focal point of the camera
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setFocalPoint = function (x, y, z) {
    if (m_enableRotation && m_enableTranslation) {
      m_focalPoint = vec4.fromValues(x, y, z, 1.0);
      this.modified();
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get view-up direction of camera
   */
  ////////////////////////////////////////////////////////////////////////////
  this.viewUpDirection = function () {
    return m_viewUp;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set view-up direction of the camera
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setViewUpDirection = function (x, y, z) {
    m_viewUp = vec4.fromValues(x, y, z, 0);
    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get center of rotation for camera
   */
  ////////////////////////////////////////////////////////////////////////////
  this.centerOfRotation = function () {
    return m_centerOfRotation;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set center of rotation for camera
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setCenterOfRotation = function (centerOfRotation) {
    m_centerOfRotation = centerOfRotation;
    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get clipping range of the camera
   */
  ////////////////////////////////////////////////////////////////////////////
  this.clippingRange = function () {
    return [m_near, m_far];
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set clipping range of the camera
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setClippingRange = function (near, far) {
    m_near = near;
    m_far = far;
    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get view aspect
   */
  ////////////////////////////////////////////////////////////////////////////
  this.viewAspect = function () {
    return m_viewAspect;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set view aspect
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setViewAspect = function (aspect) {
    m_viewAspect = aspect;
    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return active mode for scaling (enabled / disabled)
   */
  ////////////////////////////////////////////////////////////////////////////
  this.enableScale = function () {
    return m_enableScale;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Enable/disable scaling
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setEnableScale = function (flag) {
    if (flag !== m_enableScale) {
      m_enableScale = flag;
      this.modified();
      return true;
    }

    return m_enableScale;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return active mode for rotation (enabled / disabled)
   */
  ////////////////////////////////////////////////////////////////////////////
  this.enableRotation = function () {
    return m_enableRotation;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Enable / disable rotation
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setEnableRotation = function (flag) {
    if (flag !== m_enableRotation) {
      m_enableRotation = flag;
      this.modified();
      return true;
    }

    return m_enableRotation;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return active mode for translation (enabled/disabled)
   */
  ////////////////////////////////////////////////////////////////////////////
  this.enableTranslation = function () {
    return m_enableTranslation;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Enable / disable translation
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setEnableTranslation = function (flag) {
    if (flag !== m_enableTranslation) {
      m_enableTranslation = flag;
      this.modified();
      return true;
    }

    return m_enableTranslation;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return if parallel projection is enabled
   */
  ////////////////////////////////////////////////////////////////////////////
  this.isEnabledParallelProjection = function () {
    return m_enableParallelProjection;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Enable / disable parallel projection
   */
  ////////////////////////////////////////////////////////////////////////////
  this.enableParallelProjection = function (flag) {
    if (flag !== m_enableParallelProjection) {
      m_enableParallelProjection = flag;
      this.modified();
      return true;
    }

    return m_enableParallelProjection;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Enable / disable parallel projection
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setEnableParallelProjection = function (flag) {
    return this.enableParallelProjection(flag);
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get parallel projection parameters
   */
  ////////////////////////////////////////////////////////////////////////////
  this.parallelProjection = function () {
    return {left: m_left, right: m_right, top: m_top, bottom: m_bottom};
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set parallel projection parameters
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setParallelProjection = function (left, right, top, bottom) {
    m_left = left;
    m_right = right;
    m_top = top;
    m_bottom = bottom;
    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get parallel projection extents parameters
   */
  ////////////////////////////////////////////////////////////////////////////
  this.parallelExtents = function () {
    return m_parallelExtents;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set parallel projection extents parameters
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setParallelExtents = function (extents) {
    var prop = ['width', 'height', 'zoom', 'tilesize'], mod = false, i, key;
    for (i = 0; i < prop.length; i += 1) {
      key = prop[i];
      if (extents[key] !== undefined &&
          extents[key] !== m_parallelExtents[key]) {
        m_parallelExtents[key] = extents[key];
        mod = true;
      }
    }
    if (mod && m_parallelExtents.width && m_parallelExtents.height &&
        m_parallelExtents.zoom !== undefined && m_parallelExtents.tilesize) {
      var unitsPerPixel = this.unitsPerPixel(m_parallelExtents.zoom,
                                             m_parallelExtents.tilesize);
      m_right = unitsPerPixel * m_parallelExtents.width / 2;
      m_left = -m_right;
      m_top = unitsPerPixel * m_parallelExtents.height / 2;
      m_bottom = -m_top;
      this.modified();
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Compute the units per pixel.
   *
   * @param zoom: tile zoom level.
   * @param tilesize: number of pixels per tile (defaults to 256).
   * @returns: unitsPerPixel.
   */
  ////////////////////////////////////////////////////////////////////////////
  this.unitsPerPixel = function (zoom, tilesize) {
    tilesize = tilesize || 256;
    return 360.0 * Math.pow(2, -zoom) / tilesize;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return direction of projection
   */
  ////////////////////////////////////////////////////////////////////////////
  this.directionOfProjection = function () {
    this.computeDirectionOfProjection();
    return m_directionOfProjection;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return view plane normal direction
   */
  ////////////////////////////////////////////////////////////////////////////
  this.viewPlaneNormal = function () {
    this.computeViewPlaneNormal();
    return m_viewPlaneNormal;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return view-matrix for the camera This method does not compute the
   * view-matrix for the camera. It is assumed that a call to computeViewMatrix
   * has been made earlier.
   *
   * @returns {mat4}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.viewMatrix = function () {
    return this.computeViewMatrix();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set the view-matrix for the camera and mark that it is up to date so that
   * it won't be recomputed unless something else changes.
   *
   * @param {mat4} view: new view matrix.
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setViewMatrix = function (view) {
    mat4.copy(m_viewMatrix, view);
    m_computeModelViewMatrixTime.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return camera projection matrix This method does not compute the
   * projection-matrix for the camera. It is assumed that a call to
   * computeProjectionMatrix has been made earlier.
   *
   * @returns {mat4}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.projectionMatrix = function () {
    return this.computeProjectionMatrix();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set the projection-matrix for the camera and mark that it is up to date so
   * that it won't be recomputed unless something else changes.
   *
   * @param {mat4} proj: new projection matrix.
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setProjectionMatrix = function (proj) {
    mat4.copy(m_projectionMatrix, proj);
    m_computeProjectMatrixTime.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return clear mask used by this camera
   *
   * @returns {number}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.clearMask = function () {
    return m_clearMask;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set clear mask for camera
   *
   * @param mask
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setClearMask = function (mask) {
    m_clearMask = mask;
    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get clear color (background color) of the camera
   *
   * @returns {Array}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.clearColor = function () {
    return m_clearColor;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set clear color (background color) for the camera
   *
   * @param color RGBA
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setClearColor = function (r, g, b, a) {
    m_clearColor[0] = r;
    m_clearColor[1] = g;
    m_clearColor[2] = b;
    m_clearColor[3] = a;

    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   *
   * @returns {{1.0: null}}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.clearDepth = function () {
    return m_clearDepth;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   *
   * @param depth
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setClearDepth = function (depth) {
    m_clearDepth = depth;
    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Compute direction of projection
   */
  ////////////////////////////////////////////////////////////////////////////
  this.computeDirectionOfProjection = function () {
    vec3.subtract(m_directionOfProjection, m_focalPoint, m_position);
    vec3.normalize(m_directionOfProjection, m_directionOfProjection);
    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Compute view plane normal
   */
  ////////////////////////////////////////////////////////////////////////////
  this.computeViewPlaneNormal = function () {
    m_viewPlaneNormal[0] = -m_directionOfProjection[0];
    m_viewPlaneNormal[1] = -m_directionOfProjection[1];
    m_viewPlaneNormal[2] = -m_directionOfProjection[2];
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Move camera closer or further away from the scene
   */
  ////////////////////////////////////////////////////////////////////////////
  this.zoom = function (d, dir) {
    if (d === 0) {
      return;
    }

    if (!m_enableTranslation) {
      return;
    }

    d = d * vec3.distance(m_focalPoint, m_position);
    if (!dir) {
      dir = m_directionOfProjection;
      m_position[0] = m_focalPoint[0] - d * dir[0];
      m_position[1] = m_focalPoint[1] - d * dir[1];
      m_position[2] = m_focalPoint[2] - d * dir[2];
    } else {
      m_position[0] = m_position[0]  + d * dir[0];
      m_position[1] = m_position[1]  + d * dir[1];
      m_position[2] = m_position[2]  + d * dir[2];
    }

    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Move camera sideways
   */
  ////////////////////////////////////////////////////////////////////////////
  this.pan = function (dx, dy, dz) {
    if (!m_enableTranslation) {
      return;
    }

    m_position[0] += dx;
    m_position[1] += dy;
    m_position[2] += dz;

    m_focalPoint[0] += dx;
    m_focalPoint[1] += dy;
    m_focalPoint[2] += dz;

    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Compute camera coordinate axes
   */
  ////////////////////////////////////////////////////////////////////////////
  this.computeOrthogonalAxes = function () {
    this.computeDirectionOfProjection();
    vec3.cross(m_rightDir, m_directionOfProjection, m_viewUp);
    vec3.normalize(m_rightDir, m_rightDir);
    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Rotate camera around center of rotation
   * @param dx Rotation around vertical axis in degrees
   * @param dy Rotation around horizontal axis in degrees
   */
  ////////////////////////////////////////////////////////////////////////////
  this.rotate = function (dx, dy) {
    if (!m_enableRotation) {
      return;
    }

    // Convert degrees into radians
    dx = 0.5 * dx * (Math.PI / 180.0);
    dy = 0.5 * dy * (Math.PI / 180.0);

    var mat = mat4.create(),
        inverseCenterOfRotation = new vec3.create();

    mat4.identity(mat);

    inverseCenterOfRotation[0] = -m_centerOfRotation[0];
    inverseCenterOfRotation[1] = -m_centerOfRotation[1];
    inverseCenterOfRotation[2] = -m_centerOfRotation[2];

    mat4.translate(mat, mat, m_centerOfRotation);
    mat4.rotate(mat, mat, dx, m_viewUp);
    mat4.rotate(mat, mat, dy, m_rightDir);
    mat4.translate(mat, mat, inverseCenterOfRotation);

    vec4.transformMat4(m_position, m_position, mat);
    vec4.transformMat4(m_focalPoint, m_focalPoint, mat);

    // Update viewup vector
    vec4.transformMat4(m_viewUp, m_viewUp, mat);
    vec4.normalize(m_viewUp, m_viewUp);

    // Update direction of projection
    this.computeOrthogonalAxes();

    // Mark modified
    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Compute camera view matrix
   */
  ////////////////////////////////////////////////////////////////////////////
  this.computeViewMatrix = function () {
    if (m_computeModelViewMatrixTime.getMTime() < this.getMTime()) {
      mat4.lookAt(m_viewMatrix, m_position, m_focalPoint, m_viewUp);
      m_computeModelViewMatrixTime.modified();
    }
    return m_viewMatrix;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Check if the texture should be aligned to the screen.  Alignment only
   * occurs if the parallel extents contain width, height, and a
   * close-to-integer zoom level, and if the units-per-pixel value has been
   * computed.  The camera must either be in parallel projection mode OR must
   * have a perspective camera which is oriented along the z-axis without any
   * rotation.
   *
   * @returns: either null if no alignment should occur, or an alignment object
   *           with the rounding value and offsets.
   */
  ////////////////////////////////////////////////////////////////////////////
  this.viewAlignment = function () {
    if (!m_enableParallelProjection) {
      /* If we aren't in parallel projection mode, ensure that the projection
       * matrix meets strict specifications */
      var proj = this.projectionMatrix();
      if (proj[1] || proj[2] || proj[3] || proj[4] || proj[6] || proj[7] ||
          proj[8] || proj[9] || proj[12] || proj[13] || proj[15]) {
        return null;
      }
    }
    var unitsPerPixel = this.unitsPerPixel(m_parallelExtents.zoom,
                                           m_parallelExtents.tilesize);
    /* If we don't have screen dimensions, we can't know how to align pixels */
    if (!m_parallelExtents.width || !m_parallelExtents.height ||
        !unitsPerPixel) {
      return null;
    }
    /* If we aren't at an integer zoom level, we shouldn't align pixels.  If
     * we are really close to an integer zoom level, that is good enough. */
    if (parseFloat(m_parallelExtents.zoom.toFixed(6)) !==
        parseFloat(m_parallelExtents.zoom.toFixed(0))) {
      return null;
    }
    var align = {roundx: unitsPerPixel, roundy: unitsPerPixel, dx: 0, dy: 0};
    /* If the screen is an odd number of pixels, shift the view center to the
     * center of a pixel so that the pixels fit discretely across the screen.
     * If an even number of pixels, align the view center between pixels for
     * the same reason. */
    if (m_parallelExtents.width % 2) {
      align.dx = unitsPerPixel * 0.5;
    }
    if (m_parallelExtents.height % 2) {
      align.dy = unitsPerPixel * 0.5;
    }
    return align;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Compute camera projection matrix
   */
  ////////////////////////////////////////////////////////////////////////////
  this.computeProjectionMatrix = function () {
    if (m_computeProjectMatrixTime.getMTime() < this.getMTime()) {
      if (!m_enableParallelProjection) {
        mat4.perspective(m_projectionMatrix, m_viewAngle, m_viewAspect, m_near, m_far);
      } else {
        mat4.ortho(m_projectionMatrix,
          m_left, m_right, m_bottom, m_top, m_near, m_far);
      }

      m_computeProjectMatrixTime.modified();
    }

    return m_projectionMatrix;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Convert a zoom level and window size to a camera height.
   */
  ////////////////////////////////////////////////////////////////////////////
  this.zoomToHeight = function (zoom, width, height) {
    return vgl.zoomToHeight(zoom, width, height, m_viewAngle);
  };

  this.computeDirectionOfProjection();

  return this;
};

inherit(vgl.camera, vgl.groupNode);

////////////////////////////////////////////////////////////////////////////
/**
 * Convert a zoom level and window size to a camera height.
 *
 * @param zoom: Zoom level, as used in OSM maps.
 * @param width: width of the window.
 * @param height: height of the window.
 * @returns: perspective camera height.
 */
////////////////////////////////////////////////////////////////////////////
vgl.zoomToHeight = function (zoom, width, height, viewAngle) {
  'use strict';
  viewAngle = viewAngle || (30 * Math.PI / 180.0);
  var newZ = 360 * Math.pow(2, -zoom);
  newZ /= Math.tan(viewAngle / 2) * 2 * 256 / height;
  return newZ;
};

////////////////////////////////////////////////////////////////////////////
/**
 * Convert a camera height and window size to a zoom level.
 *
 * @param z: perspective camera height.
 * @param width: width of the window.
 * @param height: height of the window.
 * @returns: zoom level.
 */
////////////////////////////////////////////////////////////////////////////
vgl.heightToZoom = function (z, width, height, viewAngle) {
  'use strict';
  viewAngle = viewAngle || (30 * Math.PI / 180.0);
  z *= Math.tan(viewAngle / 2) * 2 * 256 / height;
  var zoom = -Math.log2(z / 360);
  return zoom;
};
