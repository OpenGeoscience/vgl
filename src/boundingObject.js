//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*global vgl, inherit*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class boundingObject
 *
 * @class
 * @return {boundingObject}
 */
//////////////////////////////////////////////////////////////////////////////
var object = require('./object');
var inherit = require('./inherit')

var boundingObject = function () {
  'use strict';

  if (!(this instanceof boundingObject)) {
    return new boundingObject();
  }
  object.call(this);

  /** @private */
  var m_bounds = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      m_computeBoundsTimestamp = vgl.timestamp(),
      m_boundsDirtyTimestamp = vgl.timestamp();

  m_computeBoundsTimestamp.modified();
  m_boundsDirtyTimestamp.modified();

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get current bounds of the object
   */
  ////////////////////////////////////////////////////////////////////////////
  this.bounds = function () {
    return m_bounds;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Check if bounds are valid
   */
  ////////////////////////////////////////////////////////////////////////////
  this.hasValidBounds = function (bounds) {
    if (bounds[0] === Number.MAX_VALUE ||
        bounds[1] === -Number.MAX_VALUE ||
        bounds[2] === Number.MAX_VALUE ||
        bounds[3] === -Number.MAX_VALUE ||
        bounds[4] === Number.MAX_VALUE ||
        bounds[5] === -Number.MAX_VALUE) {
      return false;
    }

    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set current bounds of the object
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setBounds = function (minX, maxX, minY, maxY, minZ, maxZ) {
    if (!this.hasValidBounds([minX, maxX, minY, maxY, minZ, maxZ])) {
      return;
    }

    m_bounds[0] = minX;
    m_bounds[1] = maxX;
    m_bounds[2] = minY;
    m_bounds[3] = maxY;
    m_bounds[4] = minZ;
    m_bounds[5] = maxZ;

    this.modified();
    m_computeBoundsTimestamp.modified();

    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Reset bounds to default values
   */
  ////////////////////////////////////////////////////////////////////////////
  this.resetBounds = function () {
    m_bounds[0] = Number.MAX_VALUE;
    m_bounds[1] = -Number.MAX_VALUE;
    m_bounds[2] = Number.MAX_VALUE;
    m_bounds[3] = -Number.MAX_VALUE;
    m_bounds[4] = Number.MAX_VALUE;
    m_bounds[5] = -Number.MAX_VALUE;

    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Compute bounds of the object
   *
   * Should be implemented by the concrete class
   */
  ////////////////////////////////////////////////////////////////////////////
  this.computeBounds = function () {
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return bounds computation modification time
   *
   * @returns {vgl.timestamp}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.computeBoundsTimestamp = function () {
    return m_computeBoundsTimestamp;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return bounds dirty timestamp
   *
   * @returns {vgl.timestamp}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.boundsDirtyTimestamp = function () {
    return m_boundsDirtyTimestamp;
  };

  this.resetBounds();

  return this;
};

boundingObject.ReferenceFrame = {
  'Relative' : 0,
  'Absolute' : 1
};

inherit(boundingObject, object);
