//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global vgl, ogs, vec3, vec4, mat4, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class actor
 *
 * @class
 * @returns {vgl.actor}
 */
////////////////////////////////////////////////////////////////////////////
vgl.actor = function() {
  'use strict';

  if (!(this instanceof vgl.actor)) {
    return new vgl.actor();
  }
  vgl.node.call(this);

  /** @private */
  var m_this = this,
      m_transformMatrix = mat4.create(),
      m_referenceFrame = vgl.boundingObject.ReferenceFrame.Relative,
      m_mapper = null;

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get transformation matrix used by the actor
   *
   * @returns {mat4}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.matrix = function() {
    return m_transformMatrix;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set transformation matrix for the actor
   *
   * @param {mat4} 4X4 transformation matrix
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setMatrix = function(tmatrix) {
    if (tmatrix !== m_transformMatrix) {
      m_transformMatrix = tmatrix;
      m_this.modified();
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get reference frame for the transformations
   *
   * @returns {String} Possible values are Absolute or Relative
   */
  ////////////////////////////////////////////////////////////////////////////
  this.referenceFrame = function() {
    return m_referenceFrame;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set reference frame for the transformations
   *
   * @param {vgl.boundingObject.ReferenceFrame}
   * referenceFrame Possible values are (Absolute | Relative)
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setReferenceFrame = function(referenceFrame) {
    if (referenceFrame !== m_referenceFrame) {
      m_referenceFrame = referenceFrame;
      m_this.modified();
      return true;
    }
    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return mapper where actor gets it behavior and data
   *
   * @returns {vgl.mapper}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.mapper = function() {
    return m_mapper;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Connect an actor to its data source
   *
   * @param {vgl.mapper}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setMapper = function(mapper) {
    if (mapper !== m_mapper) {
      m_mapper = mapper;
      m_this.boundsModified();
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * @todo
   */
  ////////////////////////////////////////////////////////////////////////////
  this.accept = function(visitor) {
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * @todo
   */
  ////////////////////////////////////////////////////////////////////////////
  this.ascend = function(visitor) {
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Compute object space to world space matrix
   * @todo
   */
  ////////////////////////////////////////////////////////////////////////////
  this.computeLocalToWorldMatrix = function(matrix, visitor) {
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Compute world space to object space matrix
   * @todo
   */
  ////////////////////////////////////////////////////////////////////////////
  this.computeWorldToLocalMatrix = function(matrix, visitor) {
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Compute actor bounds
   */
  ////////////////////////////////////////////////////////////////////////////
  this.computeBounds = function() {
    if (m_mapper === null || m_mapper === undefined) {
      m_this.resetBounds();
      return;
    }

    var computeBoundsTimestamp = m_this.computeBoundsTimestamp(),
        mapperBounds, minPt, maxPt, actorMatrix, newBounds;

    if (m_this.boundsDirtyTimestamp().getMTime() > computeBoundsTimestamp.getMTime() ||
      m_mapper.boundsDirtyTimestamp().getMTime() > computeBoundsTimestamp.getMTime()) {

      m_mapper.computeBounds();
      mapperBounds = m_mapper.bounds();

      minPt = [mapperBounds[0], mapperBounds[2], mapperBounds[4]];
      maxPt = [mapperBounds[1], mapperBounds[3], mapperBounds[5]];

      vec3.transformMat4(minPt, minPt, m_transformMatrix);
      vec3.transformMat4(maxPt, maxPt, m_transformMatrix);

      newBounds = [
        minPt[0] > maxPt[0] ? maxPt[0] : minPt[0],
        minPt[0] > maxPt[0] ? minPt[0] : maxPt[0],
        minPt[1] > maxPt[1] ? maxPt[1] : minPt[1],
        minPt[1] > maxPt[1] ? minPt[1] : maxPt[1],
        minPt[2] > maxPt[2] ? maxPt[2] : minPt[2],
        minPt[2] > maxPt[2] ? minPt[2] : maxPt[2]
      ];

      m_this.setBounds(newBounds[0], newBounds[1],
                     newBounds[2], newBounds[3],
                     newBounds[4], newBounds[5]);

      computeBoundsTimestamp.modified();
    }
  };

  return m_this;
};

inherit(vgl.actor, vgl.node);
