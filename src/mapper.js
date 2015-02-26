//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global vgl, gl, ogs, vec4, Float32Array, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class mapper
 *
 * @class
 * @returns {vgl.mapper}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.mapper = function(arg) {
  'use strict';

  if (!(this instanceof vgl.mapper)) {
    return new vgl.mapper(arg);
  }
  vgl.boundingObject.call(this);

  /** @private */
  arg = arg || {};

  var m_dirty = true,
      m_color = [ 0.0, 1.0, 1.0 ],
      m_geomData = null,
      m_buffers = [],
      m_bufferVertexAttributeMap = {},
      m_dynamicDraw = arg.dynamicDraw === undefined ? false : arg.dynamicDraw,
      m_glCompileTimestamp = vgl.timestamp();

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Delete cached VBO if any
   *
   * @private
   */
  ////////////////////////////////////////////////////////////////////////////
  function deleteVertexBufferObjects() {
    var i;
    for (i = 0; i < m_buffers.length; ++i) {
      gl.deleteBuffer(m_buffers[i]);
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Create new VBO for all its geometryData sources and primitives
   *
   * @private
   */
  ////////////////////////////////////////////////////////////////////////////
  function createVertexBufferObjects() {
    if (m_geomData) {
      var numberOfSources = m_geomData.numberOfSources(),
          i, j, k, bufferId = null, keys, ks, numberOfPrimitives;

      for (i = 0; i < numberOfSources; ++i) {
        bufferId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        gl.bufferData(gl.ARRAY_BUFFER,
          new Float32Array(m_geomData.source(i).data()),
                           m_dynamicDraw ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);

        keys = m_geomData.source(i).keys();
        ks = [];

        for (j = 0; j < keys.length; ++j) {
          ks.push(keys[j]);
        }

        m_bufferVertexAttributeMap[i] = ks;
        m_buffers[i] = bufferId;
      }

      numberOfPrimitives = m_geomData.numberOfPrimitives();
      for (k = 0; k < numberOfPrimitives; ++k) {
        bufferId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        gl.bufferData(gl.ARRAY_BUFFER, m_geomData.primitive(k)
            .indices(), gl.STATIC_DRAW);
        m_buffers[i++] = bufferId;
      }

      m_glCompileTimestamp.modified();
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Clear cache related to buffers
   *
   * @private
   */
  ////////////////////////////////////////////////////////////////////////////
  function cleanUpDrawObjects() {
    m_bufferVertexAttributeMap = {};
    m_buffers = [];
  }

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Setup draw objects; Delete old ones and create new ones
   *
   * @private
   */
  ////////////////////////////////////////////////////////////////////////////
  function setupDrawObjects() {
    // Delete buffer objects from past if any.
    deleteVertexBufferObjects();

    // Clear any cache related to buffers
    cleanUpDrawObjects();

    // Now construct the new ones.
    createVertexBufferObjects();

    m_dirty = false;
  }

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Compute bounds of the data
   */
  ////////////////////////////////////////////////////////////////////////////
  this.computeBounds = function() {
    if (m_geomData === null || typeof m_geomData === 'undefined') {
      this.resetBounds();
      return;
    }

    var computeBoundsTimestamp = this.computeBoundsTimestamp(),
        boundsDirtyTimestamp = this.boundsDirtyTimestamp(),
        geomBounds = null;

    if (boundsDirtyTimestamp.getMTime() > computeBoundsTimestamp.getMTime()) {
      geomBounds = m_geomData.bounds();

      this.setBounds(geomBounds[0], geomBounds[1], geomBounds[2],
        geomBounds[3], geomBounds[4], geomBounds[5]) ;

      computeBoundsTimestamp.modified();
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get solid color of the geometry
   */
  ////////////////////////////////////////////////////////////////////////////
  this.color = function() {
    return m_color;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set solid color of the geometry. Default is teal [1.0, 1.0, 1.0]
   *
   * @param r Red component of the color [0.0 - 1.0]
   * @param g Green component of the color [0.0 - 1.0]
   * @param b Blue component of the color [0.0 - 1.0]
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setColor = function(r, g, b) {
    m_color[0] = r;
    m_color[1] = g;
    m_color[2] = b;

    this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return stored geometry data if any
   */
  ////////////////////////////////////////////////////////////////////////////
  this.geometryData = function() {
    return m_geomData;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Connect mapper to its geometry data
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setGeometryData = function(geom) {
    if (m_geomData !== geom) {
      m_geomData = geom;

      this.modified();
      this.boundsDirtyTimestamp().modified();
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Update the buffer used for a named source.
   *
   * @param {String} sourceName The name of the source to update.
   * @param {Object[] or Float32Array} vakues The values to use for the source.
   */
  ////////////////////////////////////////////////////////////////////////////
  this.updateSourceBuffer = function (sourceName, values) {
    var bufferIndex = -1;
    for (var i = 0; i < m_geomData.numberOfSources(); i += 1) {
      if (m_geomData.source(i).name() === sourceName) {
        bufferIndex = i;
        break;
      }
    }
    if (bufferIndex < 0 || bufferIndex >= m_buffers.lengh) {
        return false;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, m_buffers[bufferIndex]);
    if (Object.prototype.toString.call(values) === "[object Float32Array]") {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, values);
    } else {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(values));
    }
    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Render the mapper
   */
  ////////////////////////////////////////////////////////////////////////////
  this.render = function(renderState) {
    if (this.getMTime() > m_glCompileTimestamp.getMTime()) {
      setupDrawObjects(renderState);
    }

    // Fixed vertex color
    gl.vertexAttrib3fv(vgl.vertexAttributeKeys.Color, this.color());

    // TODO Use renderState
    var bufferIndex = 0,
        j = 0, i, noOfPrimitives = null, primitive = null;

    for (i in m_bufferVertexAttributeMap) {
      if (m_bufferVertexAttributeMap.hasOwnProperty(i)) {
        gl.bindBuffer(gl.ARRAY_BUFFER, m_buffers[bufferIndex]);
        for (j = 0; j < m_bufferVertexAttributeMap[i].length; ++j) {
          renderState.m_material
              .bindVertexData(renderState, m_bufferVertexAttributeMap[i][j]);
        }
        ++bufferIndex;
      }
    }

    noOfPrimitives = m_geomData.numberOfPrimitives();
    for (j = 0; j < noOfPrimitives; ++j) {
      gl.bindBuffer(gl.ARRAY_BUFFER, m_buffers[bufferIndex++]);
      primitive = m_geomData.primitive(j);
      switch(primitive.primitiveType()) {
        case gl.POINTS:
          gl.drawArrays (gl.TRIANGLES, 0, primitive.numberOfIndices());
          break;
        case gl.LINES:
          gl.drawArrays (gl.LINES, 0, primitive.numberOfIndices());
          break;
        case gl.LINE_STRIP:
          gl.drawArrays (gl.LINE_STRIP, 0, primitive.numberOfIndices());
          break;
        case gl.TRIANGLES:
          gl.drawArrays (gl.TRIANGLES, 0, primitive.numberOfIndices());
          break;
        case gl.TRIANGLE_STRIP:
          gl.drawArrays (gl.TRIANGLE_STRIP, 0, primitive.numberOfIndices());
          break;
      }
      gl.bindBuffer (gl.ARRAY_BUFFER, null);
    }
  };

  return this;
};

inherit(vgl.mapper, vgl.boundingObject);
