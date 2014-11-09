//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, bitwise:true, indent: 2*/

/*global vgl, gl, ogs, vec2, vec3, vec4, mat4, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class renderState
 *
 * @returns {vgl.renderState}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.renderState = function() {
  'use strict';

  this.m_modelViewMatrix = mat4.create();
  this.m_normalMatrix = mat4.create();
  this.m_projectionMatrix = null;
  this.m_material = null;
  this.m_mapper = null;
};

////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class renderer *
 *
 * @returns {vgl.renderer}
 */
////////////////////////////////////////////////////////////////////////////
vgl.renderer = function() {
  'use strict';

  if (!(this instanceof vgl.renderer)) {
    return new vgl.renderer();
  }
  vgl.object.call(this);

  /** @private */
  var m_this = this;
  m_this.m_sceneRoot = new vgl.groupNode(),
  m_this.m_camera = new vgl.camera(),
  m_this.m_nearClippingPlaneTolerance = null,
  m_this.m_x = 0,
  m_this.m_y = 0,
  m_this.m_width = 0,
  m_this.m_height = 0,
  m_this.m_resizable = true,
  m_this.m_resetScene = true,
  m_this.m_layer = 0,
  m_this.m_renderPasses = null,
  m_this.m_resetClippingRange = true;

  m_this.m_camera.addChild(m_this.m_sceneRoot);

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get width of the renderer
   */
  ////////////////////////////////////////////////////////////////////////////
  this.width = function() {
    return m_this.m_width;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get height of the renderer
   */
  ////////////////////////////////////////////////////////////////////////////
  this.height = function() {
    return m_this.m_height;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get layer this renderer is associated with
   *
   * @return {Number}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.layer = function () {
     return m_this.m_layer;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set the layer this renderer is associated with.
   *
   * @param layerNo
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setLayer = function(layerNo) {
    m_this.m_layer = layerNo;
    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  ////////////////////////////////////////////////////////////////////////////
  this.isResizable = function() {
    return m_this.m_resizable;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setResizable = function(r) {
    m_this.m_resizable = r;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get background color
   */
  ////////////////////////////////////////////////////////////////////////////
  this.backgroundColor = function() {
    return m_this.m_camera.clearColor();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set background color of the renderer
   *
   * @param r
   * @param g
   * @param b
   * @param a
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setBackgroundColor = function(r, g, b, a) {
    m_this.m_camera.setClearColor(r, g, b, a);
    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get scene root
   *
   * @returns {vgl.groupNode}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.sceneRoot = function() {
    return m_this.m_sceneRoot;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get main camera of the renderer
   *
   * @returns {vgl.camera}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.camera = function() {
    return m_this.m_camera;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Render the scene
   */
  ////////////////////////////////////////////////////////////////////////////
  this.render = function() {
    var i, renSt, children, actor = null, sortedActors = [],
        mvMatrixInv = mat4.create(), clearColor = null;

    renSt = new vgl.renderState();

    if (m_this.m_renderPasses)  {
      for (i = 0; i < m_this.m_renderPasses.length; ++i) {
        if (m_this.m_renderPasses[i].render(renSt)) {
          // Stop the rendering if render pass returns false
          console.log("returning");
          m_this.m_renderPasses[i].remove(renSt);
          return;
        }
        m_this.m_renderPasses[i].remove(renSt);
      }
    }

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    if (m_this.m_camera.clearMask() & vgl.GL.COLOR_BUFFER_BIT) {
      clearColor = m_this.m_camera.clearColor();
      gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
    }

    if (m_this.m_camera.clearMask() & vgl.GL.DEPTH_BUFFER_BIT) {
      gl.clearDepth(m_this.m_camera.clearDepth());
    }

    gl.clear(m_this.m_camera.clearMask());

    // Set the viewport for this renderer
    gl.viewport(m_this.m_x, m_this.m_y, m_this.m_width, m_this.m_height);

    children = m_this.m_sceneRoot.children();

    if (children.length > 0 && m_this.m_resetScene) {
      this.resetCamera();
      m_this.m_resetScene = false;
    }

    for ( i = 0; i < children.length; ++i) {
      actor = children[i];
      actor.computeBounds();
      if (!actor.visible()) {
        continue;
      }

      sortedActors.push([actor.material().binNumber(), actor]);
    }

    // Now perform sorting
    sortedActors.sort(function(a, b) {return a[0] - b[0];});

    for ( i = 0; i < sortedActors.length; ++i) {
      actor = sortedActors[i][1];

      if (actor.referenceFrame() ===
          vgl.boundingObject.ReferenceFrame.Relative) {
        mat4.multiply(renSt.m_modelViewMatrix, m_this.m_camera.viewMatrix(),
          actor.matrix());
        renSt.m_projectionMatrix = m_this.m_camera.projectionMatrix();
      } else {
        renSt.m_modelViewMatrix = actor.matrix();
        renSt.m_projectionMatrix = mat4.create();
        mat4.ortho(renSt.m_projectionMatrix, 0, m_this.m_width, 0, m_this.m_height, -1, 1);
      }

      mat4.invert(mvMatrixInv, renSt.m_modelViewMatrix);
      mat4.transpose(renSt.m_normalMatrix, mvMatrixInv);
      renSt.m_material = actor.material();
      renSt.m_mapper = actor.mapper();

      // TODO Fix this shortcut
      renSt.m_material.bind(renSt);
      renSt.m_mapper.render(renSt);
      renSt.m_material.undoBind(renSt);
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Automatically set up the camera based on visible actors
   */
  ////////////////////////////////////////////////////////////////////////////
  this.resetCamera = function() {
    m_this.m_camera.computeBounds();

    var vn = m_this.m_camera.directionOfProjection(),
        visibleBounds = m_this.m_camera.bounds(),
        center = [
          (visibleBounds[0] + visibleBounds[1]) / 2.0,
          (visibleBounds[2] + visibleBounds[3]) / 2.0,
          (visibleBounds[4] + visibleBounds[5]) / 2.0
        ],
        diagonals = [
          visibleBounds[1] - visibleBounds[0],
          visibleBounds[3] - visibleBounds[2],
          visibleBounds[5] - visibleBounds[4]
        ],
        radius = 0.0,
        aspect = m_this.m_camera.viewAspect(),
        angle = m_this.m_camera.viewAngle(),
        distance = null,
        vup = null;

    if (diagonals[0] > diagonals[1]) {
      if (diagonals[0] > diagonals[2]) {
        radius = diagonals[0] / 2.0;
      } else {
        radius = diagonals[2] / 2.0;
      }
    } else {
      if (diagonals[1] > diagonals[2]) {
        radius = diagonals[1] / 2.0;
      } else {
        radius = diagonals[2] / 2.0;
      }
    }

    // @todo Need to figure out what's happening here
    if (aspect >= 1.0) {
      angle = 2.0 * Math.atan(Math.tan(angle * 0.5) / aspect);
    } else {
      angle = 2.0 * Math.atan(Math.tan(angle * 0.5) * aspect);
    }

    distance = radius / Math.sin(angle * 0.5);
    vup = m_this.m_camera.viewUpDirection();

    if (Math.abs(vec3.dot(vup, vn)) > 0.999) {
      m_this.m_camera.setViewUpDirection(-vup[2], vup[0], vup[1]);
    }

    m_this.m_camera.setFocalPoint(center[0], center[1], center[2]);
    m_this.m_camera.setPosition(center[0] + distance * -vn[0],
      center[1] + distance * -vn[1], center[2] + distance * -vn[2]);

    this.resetCameraClippingRange(visibleBounds);
  };

  this.hasValidBounds = function(bounds) {
    if (bounds[0] == Number.MAX_VALUE ||
        bounds[1] == -Number.MAX_VALUE ||
        bounds[2] == Number.MAX_VALUE ||
        bounds[3] == -Number.MAX_VALUE ||
        bounds[4] == Number.MAX_VALUE ||
        bounds[5] == -Number.MAX_VALUE)  {
      return false;
    }

    return true;
  }

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Recalculate camera's clipping range
   */
  ////////////////////////////////////////////////////////////////////////////
  this.resetCameraClippingRange = function(bounds) {
    if (typeof bounds === 'undefined') {
      m_this.m_camera.computeBounds();
      bounds = m_this.m_camera.bounds();
    }

    if (!this.hasValidBounds(bounds)) {
      return;
    }

    var vn = m_this.m_camera.viewPlaneNormal(),
        position = m_this.m_camera.position(),
        a = -vn[0],
        b = -vn[1],
        c = -vn[2],
        d = -(a*position[0] + b*position[1] + c*position[2]),
        range = vec2.create(),
        dist = null,
        i = null,
        j = null,
        k = null;

    if (!m_this.m_resetClippingRange) {
        return;
    }

    // Set the max near clipping plane and the min far clipping plane
    range[0] = a * bounds[0] + b * bounds[2] + c * bounds[4] + d;
    range[1] = 1e-18;

    // Find the closest / farthest bounding box vertex
    for (k = 0; k < 2; k++ ) {
      for (j = 0; j < 2; j++) {
        for (i = 0; i < 2; i++) {
          dist = a * bounds[i] + b * bounds[2 + j] + c * bounds[4 + k] + d;
          range[0] = (dist < range[0]) ? (dist) : (range[0]);
          range[1] = (dist > range[1]) ? (dist) : (range[1]);
        }
      }
    }

    // Do not let the range behind the camera throw off the calculation.
    if (range[0] < 0.0) {
      range[0] = 0.0;
    }

    // Give ourselves a little breathing room
    range[0] = 0.99 * range[0] - (range[1] - range[0]) * 0.5;
    range[1] = 1.01 * range[1] + (range[1] - range[0]) * 0.5;

    // Make sure near is not bigger than far
    range[0] = (range[0] >= range[1]) ? (0.01 * range[1]) : (range[0]);

    // Make sure near is at least some fraction of far - this prevents near
    // from being behind the camera or too close in front. How close is too
    // close depends on the resolution of the depth buffer.
    if (!m_this.m_nearClippingPlaneTolerance) {
      m_this.m_nearClippingPlaneTolerance = 0.01;

      if (gl !== null && gl.getParameter(gl.DEPTH_BITS) > 16) {
        m_this.m_nearClippingPlaneTolerance = 0.001;
      }
    }

    // make sure the front clipping range is not too far from the far clippnig
    // range, this is to make sure that the zbuffer resolution is effectively
    // used.
    if (range[0] < m_this.m_nearClippingPlaneTolerance*range[1]) {
       range[0] = m_this.m_nearClippingPlaneTolerance*range[1];
    }

    m_this.m_camera.setClippingRange(range[0], range[1]);
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Resize viewport given a width and height
   */
  ////////////////////////////////////////////////////////////////////////////
  this.resize = function(width, height) {
    // @note: where do m_this.m_x and m_this.m_y come from?
    this.positionAndResize(m_this.m_x, m_this.m_y, width, height);
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Resize viewport given a position, width and height
   */
  ////////////////////////////////////////////////////////////////////////////
  this.positionAndResize = function(x, y, width, height) {
    var i;

    // TODO move this code to camera
    if (x < 0 || y < 0 || width < 0 || height < 0) {
      console.log('[error] Invalid position and resize values',
        x, y, width, height);
    }

    //If we're allowing this renderer to resize ...
    if (m_this.m_resizable) {
      m_this.m_width = width;
      m_this.m_height = height;

      m_this.m_camera.setViewAspect(m_this.m_width / m_this.m_height);
      this.modified();
    }

    if (m_this.m_renderPasses) {
      for (i = 0; i < m_this.m_renderPasses.length; ++i) {
        m_this.m_renderPasses[i].resize(width, height);
        m_this.m_renderPasses[i].renderer().positionAndResize(x, y, width, height);
      }
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Add new actor to the collection
   *
   * @param actor
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.addActor = function(actor) {
    if (actor instanceof vgl.actor) {
      m_this.m_sceneRoot.addChild(actor);
      this.modified();
      return true;
    }

    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return true if this renderer has this actor attached, false otherwise.
   *
   * @param actor
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.hasActor = function(actor) {
      return m_this.m_sceneRoot.hasChild(actor);
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Add an array of actors to the collection
   */
  ////////////////////////////////////////////////////////////////////////////
  this.addActors = function(actors) {
    var i = null;
    if (actors instanceof Array) {
      for (i = 0; i < actors.length; ++i) {
        m_this.m_sceneRoot.addChild(actors[i]);
      }
      this.modified();
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Remove the actor from the collection
   *
   * @param actor
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.removeActor = function(actor) {
    if (m_this.m_sceneRoot.children().indexOf(actor) !== -1) {
      m_this.m_sceneRoot.removeChild(actor);
      this.modified();
      return true;
    }

    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Remove actors from the collection
   *
   * @param actors
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.removeActors = function(actors) {
    if (!(actors instanceof Array)) {
      return false;
    }

    var i;
    for (i = 0; i < actors.length; ++i) {
      m_this.m_sceneRoot.removeChild(actors[i]);
    }
    this.modified();
    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Remove all actors for a renderer
   *
   * @returns {*}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.removeAllActors = function() {
    return m_this.m_sceneRoot.removeChildren();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Transform a point in the world space to display space
   */
  ////////////////////////////////////////////////////////////////////////////
  this.worldToDisplay = function(worldPt, viewMatrix, projectionMatrix, width,
                                 height) {
    var viewProjectionMatrix = mat4.create(),
        winX = null,
        winY = null,
        winZ = null,
        winW = null,
        clipPt = null;


    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

    // Transform world to clipping coordinates
    clipPt = vec4.create();
    vec4.transformMat4(clipPt, worldPt, viewProjectionMatrix);

    if (clipPt[3] !== 0.0) {
      clipPt[0] = clipPt[0] / clipPt[3];
      clipPt[1] = clipPt[1] / clipPt[3];
      clipPt[2] = clipPt[2] / clipPt[3];
      clipPt[3] = 1.0;
    }

    winX = (((clipPt[0]) + 1) / 2.0) * width;
    // We calculate -point3D.getY() because the screen Y axis is
    // oriented top->down
    winY = ((1 - clipPt[1]) / 2.0) * height;
    winZ = clipPt[2];
    winW = clipPt[3];

    return vec4.fromValues(winX, winY, winZ, winW);
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Transform a point in display space to world space
   * @param displayPt
   * @param viewMatrix
   * @param projectionMatrix
   * @param width
   * @param height
   * @returns {vec4}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.displayToWorld = function(displayPt, viewMatrix, projectionMatrix,
                                 width, height) {
    var x = (2.0 * displayPt[0] / width) - 1,
        y = -(2.0 * displayPt[1] / height) + 1,
        z = displayPt[2],
        viewProjectionInverse = mat4.create(),
        worldPt = null;

    mat4.multiply(viewProjectionInverse, projectionMatrix, viewMatrix);
    mat4.invert(viewProjectionInverse, viewProjectionInverse);

    worldPt = vec4.fromValues(x, y, z, 1);
    vec4.transformMat4(worldPt, worldPt, viewProjectionInverse);
    if (worldPt[3] !== 0.0) {
      worldPt[0] = worldPt[0] / worldPt[3];
      worldPt[1] = worldPt[1] / worldPt[3];
      worldPt[2] = worldPt[2] / worldPt[3];
      worldPt[3] = 1.0;
    }

    return worldPt;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get the focusDisplayPoint
   * @returns {vec4}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.focusDisplayPoint = function() {
    var focalPoint = m_this.m_camera.focalPoint(),
      focusWorldPt = vec4.fromValues(
        focalPoint[0], focalPoint[1], focalPoint[2], 1);

    return this.worldToDisplay(
      focusWorldPt, m_this.m_camera.viewMatrix(),
      m_this.m_camera.projectionMatrix(), m_this.m_width, m_this.m_height);
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Will the scene be reset.
   * @returns {bool}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.resetScene = function() {
    return m_this.m_resetScene;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * If true the scene will be reset, otherwise the scene will not be
   * automatically reset.
   *
   * @param reset
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setResetScene = function(reset) {
     if (m_this.m_resetScene !== reset) {
       m_this.m_resetScene = reset;
       this.modified()
     }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Will the clipping range be reset
   * @returns {bool}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.resetClippingRange = function() {
    return m_this.m_resetClippingRange;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * If true the camera clipping range will be reset, otherwise the scene will
   * not be automatically reset.
   *
   * @param reset
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setResetClippingRange = function(reset) {
     if (m_this.m_resetClippingRange !== reset) {
       m_this.m_resetClippingRange = reset;
       this.modified()
     }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  ////////////////////////////////////////////////////////////////////////////
  this.addRenderPass = function(renPass) {
    var i;

    if (m_this.m_renderPasses) {
      for (i = 0; i < m_this.m_renderPasses.length; ++i) {
        if (renPass === m_this.m_renderPasses[i]) {
          return;
        }
      }
    }

    m_this.m_renderPasses = [];
    m_this.m_renderPasses.push(renPass);
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  ////////////////////////////////////////////////////////////////////////////
  this.removeRenderPass = function(renPass) {
    // TODO Implement this
  };

  return this;
};

inherit(vgl.renderer, vgl.object);
