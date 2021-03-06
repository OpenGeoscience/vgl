//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*global vgl, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class interactorStyle
 *
 * @class vgl.interactorStyle
 * interactorStyle is a base class for all interactor styles
 * @returns {vgl.interactorStyle}
 */
////////////////////////////////////////////////////////////////////////////
vgl.interactorStyle = function () {
  'use strict';

  if (!(this instanceof vgl.interactorStyle)) {
    return new vgl.interactorStyle();
  }
  vgl.object.call(this);

  // Private member variables
  var m_that = this,
      m_viewer = null;

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return viewer referenced by the interactor style
   *
   * @returns {null}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.viewer = function () {
    return m_viewer;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set viewer for the interactor style
   *
   * @param viewer
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setViewer = function (viewer) {
    if (viewer !== m_viewer) {
      m_viewer = viewer;
      $(m_viewer).on(vgl.event.mousePress, m_that.handleMouseDown);
      $(m_viewer).on(vgl.event.mouseRelease, m_that.handleMouseUp);
      $(m_viewer).on(vgl.event.mouseMove, m_that.handleMouseMove);
      $(m_viewer).on(vgl.event.mouseOut, m_that.handleMouseOut);
      $(m_viewer).on(vgl.event.mouseWheel, m_that.handleMouseWheel);
      $(m_viewer).on(vgl.event.keyPress, m_that.handleKeyPress);
      $(m_viewer).on(vgl.event.mouseContextMenu, m_that.handleContextMenu);
      $(m_viewer).on(vgl.event.click, m_that.handleClick);
      $(m_viewer).on(vgl.event.dblClick, m_that.handleDoubleClick);
      this.modified();
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Handle mouse down event
   *
   * @param event
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.handleMouseDown = function (event) {
    event = event; /* unused parameter */
    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Handle mouse up event
   *
   * @param event
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.handleMouseUp = function (event) {
    event = event; /* unused parameter */
    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Handle mouse move event
   *
   * @param event
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.handleMouseMove = function (event) {
    event = event; /* unused parameter */
    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Handle mouse move event
   *
   * @param event
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.handleMouseOut = function (event) {
    event = event; /* unused parameter */
    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Handle mouse wheel event
   *
   * @param event
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.handleMouseWheel = function (event) {
    event = event; /* unused parameter */
    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Handle click event
   *
   * @param event
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.handleClick = function (event) {
    event = event; /* unused parameter */
    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Handle double click event
   *
   * @param event
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.handleDoubleClick = function (event) {
    event = event; /* unused parameter */
    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Handle key press event
   *
   * @param event
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.handleKeyPress = function (event) {
    event = event; /* unused parameter */
    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Handle context menu event
   *
   * @param event
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.handleContextMenu = function (event) {
    event = event; /* unused parameter */
    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Reset to default
   */
  ////////////////////////////////////////////////////////////////////////////
  this.reset = function () {
    return true;
  };

  return this;
};

inherit(vgl.interactorStyle, vgl.object);
