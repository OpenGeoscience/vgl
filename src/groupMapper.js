//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global vgl, ogs, vec4, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

vgl.groupMapper = function() {
  'use strict';

  if (!(this instanceof vgl.groupMapper)) {
    return new vgl.groupMapper();
  }
  vgl.mapper.call(this);

  /** @private */
  var m_createMappersTimestamp = vgl.timestamp(),
      m_mappers = [],
      m_geomDataArray = [];

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return stored geometry data if any
   *
   * @param index optional
   */
  ////////////////////////////////////////////////////////////////////////////
  this.geometryData = function(index) {
    if (index !== undefined && index < m_geomDataArray.length ) {
      return m_geomDataArray[index];
    }

    if (m_geomDataArray.length > 0) {
      return m_geomDataArray[0];
    }

    return null;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Connect mapper to its geometry data
   *
   * @param geom {vgl.geomData}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setGeometryData = function(geom) {
    if (m_geomDataArray.length === 1) {
      if (m_geomDataArray[0] === geom) {
        return;
      }
    }
    m_geomDataArray = [];
    m_geomDataArray.push(geom);
    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return stored geometry data array if any
   */
  ////////////////////////////////////////////////////////////////////////////
  this.geometryDataArray = function() {
    return m_geomDataArray;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Connect mapper to its geometry data
   *
   * @param geoms {Array}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setGeometryDataArray = function(geoms) {
    if (geoms instanceof Array) {
      if (m_geomDataArray !== geoms) {
        m_geomDataArray = [];
        m_geomDataArray = geoms;
        this.modified();
        return true;
      }
    } else {
      console.log('[error] Requies array of geometry data');
    }

    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Compute bounds of the data
   */
  ////////////////////////////////////////////////////////////////////////////
  this.computeBounds = function() {
    if (m_geomDataArray === null ||
        m_geomDataArray === undefined) {
      this.resetBounds();
      return;
    }

    var computeBoundsTimestamp = this.computeBoundsTimestamp(),
        boundsDirtyTimestamp = this.boundsDirtyTimestamp(),
        m_bounds = this.bounds(),
        geomBounds = null,
        i = null;

    if (boundsDirtyTimestamp.getMTime() >
        computeBoundsTimestamp.getMTime()) {

      for (i = 0; i < m_geomDataArray.length; ++i) {
        geomBounds = m_geomDataArray[i].bounds();

        if (m_bounds[0] > geomBounds[0]) {
          m_bounds[0] = geomBounds[0];
        }
        if (m_bounds[1] < geomBounds[1]) {
          m_bounds[1] = geomBounds[1];
        }
        if (m_bounds[2] > geomBounds[2]) {
          m_bounds[2] = geomBounds[2];
        }
        if (m_bounds[3] < geomBounds[3]) {
          m_bounds[3] = geomBounds[3];
        }
        if (m_bounds[4] > geomBounds[4]) {
          m_bounds[4] = geomBounds[4];
        }
        if (m_bounds[5] < geomBounds[5]) {
          m_bounds[5] = geomBounds[5];
        }
      }

      this.modified();
      computeBoundsTimestamp.modified();
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Render the mapper
   */
  ////////////////////////////////////////////////////////////////////////////
  this.render = function(renderState) {
    var i = null;

    if (this.getMTime() > m_createMappersTimestamp.getMTime()) {
      // NOTE Hoping that it will release the graphics resources
      for (i = 0; i < m_geomDataArray.length; ++i) {
        m_mappers.push(vgl.mapper());
        m_mappers[i].setGeometryData(m_geomDataArray[i]);
      }
        m_createMappersTimestamp.modified();
    }

    for (i = 0; i < m_mappers.length; ++i) {
      m_mappers[i].render(renderState);
    }
  };

  return this;
};

inherit(vgl.groupMapper, vgl.mapper);
