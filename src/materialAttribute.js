//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*global vgl, inherit*/
//////////////////////////////////////////////////////////////////////////////

vgl.materialAttributeType = {
  'Undefined' : 0x0,
  'ShaderProgram' : 0x1,
  'Texture' : 0x2,
  'Blend' : 0x3,
  'Depth' : 0x4
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class materialAttribute
 *
 * @class
 * @param type
 * @returns {vgl.materialAttribute}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.materialAttribute = function (type) {
  'use strict';

  if (!(this instanceof vgl.materialAttribute)) {
    return new vgl.materialAttribute(type);
  }
  vgl.graphicsObject.call(this);

  /** @private */
  var m_this = this,
      m_type = type,
      m_enabled = true;

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return tyep of the material attribute
   *
   * @returns {*}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.type = function () {
    return m_type;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return if material attribute is enabled or not
   *
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.enabled = function () {
    return m_enabled;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Bind and activate vertex specific data
   *
   * @param renderState
   * @param key
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.bindVertexData = function (renderState, key) {
    renderState = renderState; /* unused parameter */
    key = key; /* unused parameter */
    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Undo bind and deactivate vertex specific data
   *
   * @param renderState
   * @param key
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.undoBindVertexData = function (renderState, key) {
    renderState = renderState; /* unused parameter */
    key = key; /* unused parameter */
    return false;
  };

  return m_this;
};

inherit(vgl.materialAttribute, vgl.graphicsObject);
