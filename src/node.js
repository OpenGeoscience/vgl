//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*global vgl, inherit*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class node
 *
 * @class
 * @returns {vgl.node}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.node = function () {
  'use strict';

  if (!(this instanceof vgl.node)) {
    return new vgl.node();
  }
  vgl.boundingObject.call(this);

  /** @private */
  var m_parent = null,
      m_material = null,
      m_visible = true,
      m_overlay = false;

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Accept visitor for scene traversal
   */
  ////////////////////////////////////////////////////////////////////////////
  this.accept = function (visitor) {
    visitor.visit(this);
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return active material used by the node
   */
  ////////////////////////////////////////////////////////////////////////////
  this.material = function () {
    return m_material;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set material to be used the node
   *
   * @param material
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setMaterial = function (material) {
    if (material !== m_material) {
      m_material = material;
      this.modified();
      return true;
    }

    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Check if the node is visible or node
   *
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.visible = function () {
    return m_visible;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Turn ON/OFF visibility of the node
   *
   * @param flag
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setVisible = function (flag) {
    if (flag !== m_visible) {
      m_visible = flag;
      this.modified();
      return true;
    }

    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return current parent of the node
   *
   * @returns {null}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.parent = function () {
    return m_parent;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set parent of the node
   *
   * @param parent
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setParent = function (parent) {
    if (parent !== m_parent) {
      if (m_parent !== null) {
        m_parent.removeChild(this);
      }
      m_parent = parent;
      this.modified();
      return true;
    }

    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Check if the node is an overlay node
   *
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.overlay = function () {
    return m_overlay;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set if the node is an overlay node or not
   *
   * @param flag
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setOverlay = function (flag) {
    if (m_overlay !== flag) {
      m_overlay = flag;
      this.modified();
      return true;
    }

    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /*
   * Traverse parent and their parent and so on
   */
  ////////////////////////////////////////////////////////////////////////////
  this.ascend = function (visitor) {
    visitor = visitor; /* unused parameter */
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Traverse children
   */
  ////////////////////////////////////////////////////////////////////////////
  this.traverse = function (visitor) {
    visitor = visitor; /* unused parameter */
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Mark that the bounds are modified
   *
   */
  ////////////////////////////////////////////////////////////////////////////
  this.boundsModified = function () {
    // @todo Implement this
    this.boundsDirtyTimestamp().modified();

    if (m_parent !== null) {
      m_parent.boundsModified();
    }
  };

  return this;
};

inherit(vgl.node, vgl.boundingObject);
