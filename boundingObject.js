/**
 * @module ogs.vgl
 */

/**
 * Create a new instance of class boundingObject
 *
 * @class
 * @return {vglModule.boundingObject}
 */
vglModule.boundingObject = function() {

  if (!(this instanceof vglModule.boundingObject)) {
    return new vglModule.boundingObject();
  }
  vglModule.object.call(this);

  /** @private */
  var m_bounds = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

  /** @private */
  var m_computeBoundsTimestamp = vglModule.timestamp();

  /** @private */
  var m_boundsDirtyTimestamp = vglModule.timestamp();

  /**
   * Get current bounds of the object
   */
  this.bounds = function() {
    return m_bounds;
  };

  /**
   * Set current bounds of the object
   */
  this.setBounds = function(minX, maxX, minY, maxY, minZ, maxZ) {
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

  /**
   * Reset bounds to default values
   */
  this.resetBounds = function() {
    m_bounds[0] = Number.MAX_VALUE;
    m_bounds[1] = -Number.MAX_VALUE;
    m_bounds[2] = Number.MAX_VALUE;
    m_bounds[3] = -Number.MAX_VALUE;
    m_bounds[4] = Number.MAX_VALUE;
    m_bounds[5] = -Number.MAX_VALUE;

    this.modified();
  };

  /**
   * Compute bounds of the object
   *
   * @desc Should be implemented by the concrete class
   */
  this.computeBounds = function() {
  };

  /**
   * Return bounds computation modification time
   * @returns {vglModule.timestamp}
   */
  this.computeBoundsTimestamp = function() {
    return m_computeBoundsTimestamp;
  };

  /**
   * Return bounds dirty timestamp
   * @returns {vglModule.timestamp}
   */
  this.boundsDirtyTimestamp = function() {
    return m_boundsDirtyTimestamp;
  };

  this.resetBounds();

  return this;
};

inherit(vglModule.boundingObject, vglModule.object);
