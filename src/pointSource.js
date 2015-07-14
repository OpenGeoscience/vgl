//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*global vgl, inherit*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class pointSource
 *
 * @class
 * @returns {vgl.pointSource}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.pointSource = function () {
  'use strict';

  if (!(this instanceof vgl.pointSource)) {
    return new vgl.pointSource();
  }
  vgl.source.call(this);

  var m_this = this,
      m_positions = [],
      m_colors = [],
      m_textureCoords = [],
      m_size = [],
      m_geom = null;

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get positions for the points
   */
  ////////////////////////////////////////////////////////////////////////////
  this.getPositions = function () {
    return m_positions;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set positions for the source
   *
   * @param positions
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setPositions = function (positions) {
    if (positions instanceof Array) {
      m_positions = positions;
    } else {
      console
          .log('[ERROR] Invalid data type for positions. Array is required.');
    }
    m_this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get colors for the points
   */
  ////////////////////////////////////////////////////////////////////////////
  this.getColors = function () {
    return m_colors;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set colors for the points
   *
   * @param colors
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setColors = function (colors) {
    if (colors instanceof Array) {
      m_colors = colors;
    } else {
      console.log('[ERROR] Invalid data type for colors. Array is required.');
    }

    m_this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get size for the points
   */
  ////////////////////////////////////////////////////////////////////////////
  this.getSize = function () {
    return m_size;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set colors for the points
   *
   * @param colors
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setSize = function (size) {
    m_size = size;
    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set texture coordinates for the points
   *
   * @param texcoords
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setTextureCoordinates = function (texcoords) {
    if (texcoords instanceof Array) {
      m_textureCoords = texcoords;
    } else {
      console.log('[ERROR] Invalid data type for ' +
                  'texture coordinates. Array is required.');
    }
    m_this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Create a point geometry given input parameters
   */
  ////////////////////////////////////////////////////////////////////////////
  this.create = function () {
    m_geom = new vgl.geometryData();

    if (m_positions.length % 3 !== 0) {
      console.log('[ERROR] Invalid length of the points array');
      return;
    }

    var numPts = m_positions.length / 3,
        i = 0,
        indices = [],
        pointsPrimitive,
        sourcePositions,
        sourceColors,
        sourceTexCoords,
        sourceSize;

    indices.length = numPts;
    for (i = 0; i < numPts; i += 1) {
      indices[i] = i;
    }

    /// Generate array of size if needed
    sourceSize = vgl.sourceDataDf();
    if (numPts !== m_size.length) {
      for (i = 0; i < numPts; i += 1) {
        sourceSize.pushBack(m_size);
      }
    } else {
      sourceSize.setData(m_size);
    }
    m_geom.addSource(sourceSize);

    pointsPrimitive = new vgl.points();
    pointsPrimitive.setIndices(indices);

    sourcePositions = vgl.sourceDataP3fv();
    sourcePositions.pushBack(m_positions);
    m_geom.addSource(sourcePositions);

    if ((m_colors.length > 0) && m_colors.length === m_positions.length) {
      sourceColors = vgl.sourceDataC3fv();
      sourceColors.pushBack(m_colors);
      m_geom.addSource(sourceColors);
    } else if ((m_colors.length > 0) && m_colors.length !== m_positions.length) {
      console
          .log('[ERROR] Number of colors are different than number of points');
    }

    if (m_textureCoords.length > 0 &&
        m_textureCoords.length === m_positions.length) {
      sourceTexCoords = vgl.sourceDataT2fv();
      sourceTexCoords.pushBack(m_textureCoords);
      m_geom.addSource(sourceTexCoords);
    } else if (m_textureCoords.length > 0 &&
        (m_textureCoords.length / 2) !== (m_positions.length / 3)) {
      console
          .log('[ERROR] Number of texture coordinates are different than ' +
               'number of points');
    }


    m_geom.addPrimitive(pointsPrimitive);

    return m_geom;
  };
};

inherit(vgl.pointSource, vgl.source);
