//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global window, vgl, ogs, vec4, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class viewer
 *
 * @param canvas
 * @returns {vgl.viewer}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.viewer = function(canvas) {
  'use strict';

  if (!(this instanceof vgl.viewer)) {
    return new vgl.viewer(canvas);
  }

  vgl.object.call(this);

  var m_that = this,
      m_canvas = canvas,
      m_ready = true,
      m_interactorStyle = null,
      m_renderer = vgl.renderer(),
      m_renderWindow = vgl.renderWindow(m_canvas);

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get canvas of the viewer
   *
   * @returns {*}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.canvas = function() {
    return m_canvas;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return render window of the viewer
   *
   * @returns {vgl.renderWindow}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.renderWindow = function() {
    return m_renderWindow;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Initialize the viewer
   *
   * This is a must call or otherwise render context may not initialized
   * properly.
   */
  ////////////////////////////////////////////////////////////////////////////
  this.init = function() {
    if (m_renderWindow !== null) {
      m_renderWindow.createWindow();
    }
    else {
      console.log("[ERROR] No render window attached");
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get interactor style of the viewer
   *
   * @returns {vgl.interactorStyle}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.interactorStyle = function() {
    return m_interactorStyle;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set interactor style to be used by the viewer
   *
   * @param {vgl.interactorStyle} style
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setInteractorStyle = function(style) {
    if (style !== m_interactorStyle) {
      m_interactorStyle = style;
      m_interactorStyle.setViewer(this);
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
  this.handleMouseDown = function(event) {
    if (m_ready === true) {
      var fixedEvent = $.event.fix(event || window.event);
      // Only prevent default action for right mouse button
      if (event.button === 2) {
        fixedEvent.preventDefault();
      }
      fixedEvent.state = 'down';
      fixedEvent.type = vgl.event.mousePress;
      $(m_that).trigger(fixedEvent);
    }

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
  this.handleMouseUp = function(event) {
    if (m_ready === true) {
      var fixedEvent = $.event.fix(event || window.event);
      fixedEvent.preventDefault();
      fixedEvent.state = 'up';
      fixedEvent.type = vgl.event.mouseRelease;
      $(m_that).trigger(fixedEvent);
    }

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
  this.handleMouseMove = function(event) {
    if (m_ready === true) {
      var fixedEvent = $.event.fix(event || window.event);
      fixedEvent.preventDefault();
      fixedEvent.type = vgl.event.mouseMove;
      $(m_that).trigger(fixedEvent);
    }

    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Handle mouse wheel scroll
   *
   * @param event
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.handleMouseWheel = function(event) {
    if (m_ready === true) {
      var fixedEvent = $.event.fix(event || window.event);
      fixedEvent.preventDefault();
      fixedEvent.type = vgl.event.mouseWheel;
      $(m_that).trigger(fixedEvent);
    }

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
  this.handleMouseOut = function(event) {
    if (m_ready === true) {
      var fixedEvent = $.event.fix(event || window.event);
      fixedEvent.preventDefault();
      fixedEvent.type = vgl.event.mouseOut;
      $(m_that).trigger(fixedEvent);
    }

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
  this.handleKeyPress = function(event) {
    if (m_ready === true) {
      var fixedEvent = $.event.fix(event || window.event);
      fixedEvent.preventDefault();
      fixedEvent.type = vgl.event.keyPress;
      $(m_that).trigger(fixedEvent);
    }

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
  this.handleContextMenu = function(event) {
    if (m_ready === true) {
      var fixedEvent = $.event.fix(event || window.event);
      fixedEvent.preventDefault();
      fixedEvent.type = vgl.event.contextMenu;
      $(m_that).trigger(fixedEvent);
    }

    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get mouse coodinates related to canvas
   *
   * @param event
   * @returns {{x: number, y: number}}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.relMouseCoords = function(event) {
    var totalOffsetX = 0,
        totalOffsetY = 0,
        canvasX = 0,
        canvasY = 0,
        currentElement = m_canvas;

    do {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    } while (currentElement = currentElement.offsetParent);

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {
      x: canvasX,
      y: canvasY
    };
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Render
   */
  ////////////////////////////////////////////////////////////////////////////
  this.render = function() {
    m_renderWindow.render();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Bind canvas mouse events to their default handlers
   */
  ////////////////////////////////////////////////////////////////////////////
  this.bindEventHandlers = function() {
    $(m_canvas).on('mousedown', this.handleMouseDown);
    $(m_canvas).on('mouseup', this.handleMouseUp);
    $(m_canvas).on('mousemove', this.handleMouseMove);
    $(m_canvas).on('mousewheel', this.handleMouseWheel);
    $(m_canvas).on('contextmenu', this.handleContextMenu);
  }

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Undo earlier binded  handlers for canvas mouse events
   */
  ////////////////////////////////////////////////////////////////////////////
  this.unbindEventHandlers = function() {
    $(m_canvas).off('mousedown', this.handleMouseDown);
    $(m_canvas).off('mouseup', this.handleMouseUp);
    $(m_canvas).off('mousemove', this.handleMouseMove);
    $(m_canvas).off('mousewheel', this.handleMouseWheel);
    $(m_canvas).off('contextmenu', this.handleContextMenu);
  }

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Initialize
   */
  ////////////////////////////////////////////////////////////////////////////
  this._init = function() {
    this.bindEventHandlers();
    m_renderWindow.addRenderer(m_renderer);
  }

  this._init();
  return this;
};

inherit(vgl.viewer, vgl.object);
