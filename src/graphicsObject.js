//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class graphicsObject
 *
 * @class
 * @param type
 * @returns {vgl.graphicsObject}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.graphicsObject = function(type) {
  'use strict';

  if (!(this instanceof vgl.graphicsObject)) {
    return new vgl.graphicsObject();
  }
  vgl.object.call(this);

  var m_this = this;

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Setup (initialize) the object
   *
   * @param renderState
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this._setup = function(renderState) {
    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Remove any resources acquired before deletion
   *
   * @param renderState
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this._cleanup = function(renderState) {
    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Bind and activate
   *
   * @param renderState
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.bind = function(renderState) {
    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Undo bind and deactivate
   *
   * @param renderState
   * @returns {boolean}
   *
   * TODO: Change it to unbind (simple)
   */
  ////////////////////////////////////////////////////////////////////////////
  this.undoBind = function(renderState) {
    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Render the object
   */
  ////////////////////////////////////////////////////////////////////////////
  this.render = function(renderState) {
    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Remove the object and release its graphics resources
   */
  ////////////////////////////////////////////////////////////////////////////
  this.remove = function(renderState) {
    m_this._cleanup(renderState);
  }

  return m_this;
};

inherit(vgl.graphicsObject, vgl.object);