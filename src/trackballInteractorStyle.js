//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global vgl, ogs, vec4, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of trackballInteractorStyle
 *
 * @class vgl.trackballInteractorStyle
 * @returns {vgl.trackballInteractorStyle}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.trackballInteractorStyle = function() {
  'use strict';

  if (!(this instanceof vgl.trackballInteractorStyle)) {
    return new vgl.trackballInteractorStyle();
  }
  vgl.interactorStyle.call(this);
  var m_that = this,
      m_leftMouseBtnDown = false,
      m_rightMouseBtnDown = false,
      m_midMouseBtnDown = false,
      m_outsideCanvas,
      m_currPos = {x: 0, y: 0},
      m_lastPos = {x: 0, y: 0};


  /////////////////////////////////////////////////////////////////////////////
  /**
   * Handle mouse move event
   *
   * @param event
   * @returns {boolean}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.handleMouseMove = function(event) {
    var canvas = m_that.viewer().canvas(),
        width = m_that.viewer().renderWindow().windowSize()[0],
        height = m_that.viewer().renderWindow().windowSize()[1],
        ren = m_that.viewer().renderWindow().activeRenderer(),
        cam = ren.camera(), coords = m_that.viewer().relMouseCoords(event),
        fp, fdp, fwp, dp1, dp2, wp1, wp2, coords, dx, dy, dz,
        coords, m_zTrans;

    m_outsideCanvas = false;
    m_currPos = {x: 0, y: 0};

    if ((coords.x < 0) || (coords.x > width)) {
      m_currPos.x = 0;
      m_outsideCanvas = true;
    } else {
      m_currPos.x = coords.x;
    }
    if ((coords.y < 0) || (coords.y > height)) {
      m_currPos.y = 0;
      m_outsideCanvas = true;
    } else {
      m_currPos.y = coords.y;
    }
    if (m_outsideCanvas === true) {
      return;
    }

    fp = cam.focalPoint();
    fwp = vec4.fromValues(fp[0], fp[1], fp[2], 1);
    fdp = ren.worldToDisplay(fwp, cam.viewMatrix(),
                              cam.projectionMatrix(), width, height);

    dp1 = vec4.fromValues(m_currPos.x, m_currPos.y, fdp[2], 1.0);
    dp2 = vec4.fromValues(m_lastPos.x, m_lastPos.y, fdp[2], 1.0);

    wp1 = ren.displayToWorld(dp1, cam.viewMatrix(), cam.projectionMatrix(),
                             width, height);
    wp2 = ren.displayToWorld(dp2, cam.viewMatrix(), cam.projectionMatrix(),
                             width, height);

    dx = wp1[0] - wp2[0];
    dy = wp1[1] - wp2[1];
    dz = wp1[2] - wp2[2];

    if (m_midMouseBtnDown) {
      cam.pan(-dx, -dy, -dz);
      m_that.viewer().render();
    }
    if (m_leftMouseBtnDown) {
      cam.rotate((m_lastPos.x - m_currPos.x),
      (m_lastPos.y - m_currPos.y));
      ren.resetCameraClippingRange();
      m_that.viewer().render();
    }
    if (m_rightMouseBtnDown) {
      m_zTrans = (m_currPos.y - m_lastPos.y) / height;

      // Calculate zoom scale here
      if (m_zTrans > 0) {
        cam.zoom(1 - Math.abs(m_zTrans));
      } else {
        cam.zoom(1 + Math.abs(m_zTrans));
      }
      ren.resetCameraClippingRange();
      m_that.viewer().render();
    }
    m_lastPos.x = m_currPos.x;
    m_lastPos.y = m_currPos.y;
    return false;
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Handle mouse down event
   *
   * @param event
   * @returns {boolean}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.handleMouseDown = function(event) {
    var canvas = m_that.viewer().canvas(), coords;

    if (event.button === 0) {
      m_leftMouseBtnDown = true;
    }
    if (event.button === 1) {
      m_midMouseBtnDown = true;
    }
    if (event.button === 2) {
      m_rightMouseBtnDown = true;
    }
    coords = canvas.relMouseCoords(event);
    if (coords.x < 0) {
      m_lastPos.x = 0;
    } else {
      m_lastPos.x = coords.x;
    }
    if (coords.y < 0) {
      m_lastPos.y = 0;
    } else {
      m_lastPos.y = coords.y;
    }
    return false;
  };

  // @note We never get mouse up from scroll bar: See the bug report here
  // http://bugs.jquery.com/ticket/8184
  /////////////////////////////////////////////////////////////////////////////
  /**
   * Handle mouse up event
   *
   * @param event
   * @returns {boolean}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.handleMouseUp = function(event) {
    if (event.button === 0) {
      m_leftMouseBtnDown = false;
    }
    if (event.button === 1) {
      m_midMouseBtnDown = false;
    }
    if (event.button === 2) {
      m_rightMouseBtnDown = false;
    }
    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Handle mouse wheel event
   *
   * @param event
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.handleMouseWheel = function(event) {
    var ren = m_that.viewer().renderWindow().activeRenderer(),
        cam = ren.camera();

    // TODO Compute zoom factor intelligently
    if (event.originalEvent.wheelDelta < 0) {
      cam.zoom(0.9);
    } else {
      cam.zoom(1.1);
    }
    ren.resetCameraClippingRange();
    m_that.viewer().render();
    return true;
  };

  return this;
};
inherit(vgl.trackballInteractorStyle, vgl.interactorStyle);
