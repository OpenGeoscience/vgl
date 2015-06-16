//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global vgl, gl, ogs, vec4, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Keys to identify vertex attributes
 *
 * @type {{Position: number, Normal: number, TextureCoordinate: number,
 *         Color: number, Scalar: number, Scalar2: number, Scalar3: number,
 *         Scalar4: number, Scalar5: number, Scalar6: number, Scalar7: number,
 *         CountAttributeIndex: number}}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.vertexAttributeKeys = {
  "Position" : 0,
  "Normal" : 1,
  "TextureCoordinate" : 2,
  "Color" : 3,
  "CountAttributeIndex" : 4
};

vgl.vertexAttributeKeysIndexed = {
  "Zero" : 0,
  "One" : 1,
  "Two" : 2,
  "Three" : 3,
  "Four" : 4,
  "Five" : 5,
  "Six" : 6,
  "Seven" : 7,
  "Eight" : 8,
  "Nine" : 9
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of vertexAttribute
 *
 * @param {string} name
 * @returns {vgl.vertexAttribute}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.vertexAttribute = function(name) {
  'use strict';

  if (!(this instanceof vgl.vertexAttribute)) {
    return new vgl.vertexAttribute(name);
  }

  var m_name = name;

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get name of the vertex attribute
   *
   * @returns {string}
   */
  //////////////////////////////////////////////////////////////////////////////
  this.name = function() {
    return m_name;
  };

  //////////////////////////////////////////////////////////////////////////////
  /**
   * Bind vertex data to the given render state
   *
   * @param {vgl.renderState} renderState
   * @param {vgl.vertexAttributeKeys} key
   */
  //////////////////////////////////////////////////////////////////////////////
  this.bindVertexData = function(renderState, key) {
    var geometryData = renderState.m_mapper.geometryData(),
        sourceData = geometryData.sourceData(key),
        program = renderState.m_material.shaderProgram();

    renderState.m_context.vertexAttribPointer(program.attributeLocation(m_name), sourceData
        .attributeNumberOfComponents(key), sourceData.attributeDataType(key),
                           sourceData.normalized(key), sourceData
                               .attributeStride(key), sourceData
                               .attributeOffset(key));

    renderState.m_context.enableVertexAttribArray(program.attributeLocation(m_name));
  };

  //////////////////////////////////////////////////////////////////////////////
  /**
   * Undo bind vertex data for a given render state
   *
   * @param {vgl.renderState} renderState
   * @param {vgl.vertexAttributeKeys} key
   */
  //////////////////////////////////////////////////////////////////////////////
  this.undoBindVertexData = function(renderState, key) {
    var program = renderState.m_material.shaderProgram();

    renderState.m_context.disableVertexAttribArray(program.attributeLocation(m_name));
  };
};
