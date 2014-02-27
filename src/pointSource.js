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
 * Create a new instance of class pointSource
 *
 * @class
 * @returns {vgl.pointSource}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.pointSource = function() {
  'use strict';

  if (!(this instanceof vgl.pointSource)) {
    return new vgl.pointSource();
  }
  vgl.source.call(this);

  var m_positions = [],
      m_colors = [],
      m_textureCoords = [],
      m_geom = null;

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set positions for the source
   *
   * @param positions
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setPositions = function(positions) {
    if (positions instanceof Array) {
      m_positions = positions;
    }
    else {
      console
          .log("[ERROR] Invalid data type for positions. Array is required.");
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set colors for the points
   *
   * @param colors
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setColors = function(colors) {
    if (colors instanceof Array) {
      m_colors = colors;
    }
    else {
      console.log("[ERROR] Invalid data type for colors. Array is required.");
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set texture coordinates for the points
   *
   * @param texcoords
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setTextureCoordinates = function(texcoords) {
    if (texcoords instanceof Array) {
      m_textureCoords = texcoords;
    }
    else {
      console.log("[ERROR] Invalid data type for "
                  + "texture coordinates. Array is required.");
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Create a point geometry given input parameters
   */
  ////////////////////////////////////////////////////////////////////////////
  this.create = function() {
    m_geom = new vgl.geometryData();

    if (m_positions.length % 3 !== 0) {
      console.log("[ERROR] Invalid length of the points array");
      return;
    }

    var numPts = m_positions.length / 3,
        i = 0,
        indices = [],
        pointsPrimitive,
        sourcePositions,
        sourceColors,
        sourceTexCoords;

    indices.length = numPts;
    for (i = 0; i < numPts; ++i) {
      indices[i] = i;
    }

    pointsPrimitive = new vgl.points();
    pointsPrimitive.setIndices(indices);

    sourcePositions = vgl.sourceDataP3fv();
    sourcePositions.pushBack(m_positions);
    m_geom.addSource(sourcePositions);

    if ((m_colors.length > 0) && m_colors.length === m_positions.length) {
      sourceColors = vgl.sourceDataC3fv();
      sourceColors.pushBack(m_colors);
      m_geom.addSource(sourceColors);
    }
    else if ((m_colors.length > 0) && m_colors.length !== m_positions.length) {
      console
          .log("[ERROR] Number of colors are different than number of points");
    }

    if ((m_textureCoords.length > 0)
        && m_textureCoords.length === m_positions.length) {
      sourceTexCoords = vgl.sourceDataT2fv();
      sourceTexCoords.pushBack(m_textureCoords);
      m_geom.addSource(sourceTexCoords);
    }
    else if ((m_textureCoords.length > 0)
             && (m_textureCoords.length / 2) !== (m_positions.length / 3)) {
      console
          .log("[ERROR] Number of texture coordinates are different than number of points");
    }

    m_geom.addPrimitive(pointsPrimitive);

    return m_geom;
  };
};

inherit(vgl.pointSource, vgl.source);
