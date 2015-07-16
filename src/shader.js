//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*global vgl, inherit*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class shader
 *
 * @param type
 * @returns {vgl.shader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.shader = function (type) {
  'use strict';

  if (!(this instanceof vgl.shader)) {
    return new vgl.shader(type);
  }
  vgl.object.call(this);

  var m_shaderHandle = null,
      m_compileTimestamp = vgl.timestamp(),
      m_shaderType = type,
      m_shaderSource = '';

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Get shader handle
   */
  /////////////////////////////////////////////////////////////////////////////
  this.shaderHandle = function () {
    return m_shaderHandle;
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Get type of the shader
   *
   * @returns {*}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.shaderType = function () {
    return m_shaderType;
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Get shader source
   *
   * @returns {string}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.shaderSource = function () {
    return m_shaderSource;
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Set shader source
   *
   * @param {string} source
   */
  /////////////////////////////////////////////////////////////////////////////
  this.setShaderSource = function (source) {
    m_shaderSource = source;
    this.modified();
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Compile the shader
   *
   * @returns {null}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.compile = function (renderState) {
    if (this.getMTime() < m_compileTimestamp.getMTime()) {
      return m_shaderHandle;
    }

    renderState.m_context.deleteShader(m_shaderHandle);
    m_shaderHandle = renderState.m_context.createShader(m_shaderType);
    renderState.m_context.shaderSource(m_shaderHandle, m_shaderSource);
    renderState.m_context.compileShader(m_shaderHandle);

    // See if it compiled successfully
    if (!renderState.m_context.getShaderParameter(m_shaderHandle,
        vgl.GL.COMPILE_STATUS)) {
      console.log('[ERROR] An error occurred compiling the shaders: ' +
                  renderState.m_context.getShaderInfoLog(m_shaderHandle));
      console.log(m_shaderSource);
      renderState.m_context.deleteShader(m_shaderHandle);
      return null;
    }

    m_compileTimestamp.modified();

    return m_shaderHandle;
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Attach shader to the program
   *
   * @param programHandle
   */
  /////////////////////////////////////////////////////////////////////////////
  this.attachShader = function (renderState, programHandle) {
    renderState.m_context.attachShader(programHandle, m_shaderHandle);
  };
};

inherit(vgl.shader, vgl.object);
