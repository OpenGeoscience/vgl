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
 * Create a new instace of class shaderProgram
 *
 * @class
 * @returns {vgl.shaderProgram}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.shaderProgram = function() {
  'use strict';

  if (!(this instanceof vgl.shaderProgram)) {
    return new vgl.shaderProgram();
  }
  vgl.materialAttribute.call(
    this, vgl.materialAttributeType.ShaderProgram);

  /** @private */
  var m_this = this,
      m_programHandle = 0,
      m_compileTimestamp = vgl.timestamp(),
      m_bindTimestamp = vgl.timestamp(),
      m_shaders = [],
      m_uniforms = [],
      m_vertexAttributes = {},
      m_uniformNameToLocation = {},
      m_vertexAttributeNameToLocation = {};

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Create a particular shader type using GLSL shader strings from a file
   */
  /////////////////////////////////////////////////////////////////////////////
  this.loadFromFile = function(type, sourceUrl) {
    var shader;
    $.ajax({
      url: sourceUrl,
      type: "GET",
      async: false,
      success: function(result) {
        //console.log(result);
        shader = vgl.shader(type);
        shader.setShaderSource(result);
        m_this.addShader(shader);
      }
    });
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Query uniform location in the program
   *
   * @param name
   * @returns {*}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.queryUniformLocation = function(name) {
    return gl.getUniformLocation(m_programHandle, name);
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Query attribute location in the program
   *
   * @param name
   * @returns {*}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.queryAttributeLocation = function(name) {
    return gl.getAttribLocation(m_programHandle, name);
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Add a new shader to the program
   *
   * @param shader
   * @returns {boolean}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.addShader = function(shader) {
    if (m_shaders.indexOf(shader) > -1) {
      return false;
    }

    var i;
    for (i = 0; i < m_shaders.length; ++i) {
      if (m_shaders[i].shaderType() === shader.shaderType()) {
        m_shaders.splice(m_shaders.indexOf(shader), 1);
      }
    }

    m_shaders.push(shader);
    m_this.modified();
    return true;
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Add a new uniform to the program
   *
   * @param uniform
   * @returns {boolean}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.addUniform = function(uniform) {
    if (m_uniforms.indexOf(uniform) > -1) {
      return false;
    }

    m_uniforms.push(uniform);
    m_this.modified();
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Add a new vertex attribute to the program
   *
   * @param attr
   * @param key
   */
  /////////////////////////////////////////////////////////////////////////////
  this.addVertexAttribute = function(attr, key) {
    m_vertexAttributes[key] = attr;
    m_this.modified();
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Get uniform location
   *
   * This method does not perform any query into the program but relies on
   * the fact that it depends on a call to queryUniformLocation earlier.
   *
   * @param name
   * @returns {number}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.uniformLocation = function(name) {
    return m_uniformNameToLocation[name];
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Get attribute location
   *
   * This method does not perform any query into the program but relies on the
   * fact that it depends on a call to queryUniformLocation earlier.
   *
   * @param name
   * @returns {number}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.attributeLocation = function(name) {
    return m_vertexAttributeNameToLocation[name];
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Get uniform object using name as the key
   *
   * @param name
   * @returns {*}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.uniform = function(name) {
    var i;
    for (i = 0; i < m_uniforms.length; ++i) {
      if (m_uniforms[i].name() === name) {
        return m_uniforms[i];
      }
    }

    return null;
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Update all uniforms
   *
   * This method should be used directly unless required
   */
  /////////////////////////////////////////////////////////////////////////////
  this.updateUniforms = function() {
    var i;

    for (i = 0; i < m_uniforms.length; ++i) {
      m_uniforms[i].callGL(m_uniformNameToLocation[m_uniforms[i].name()]);
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Link shader program
   *
   * @returns {boolean}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.link = function() {
    gl.linkProgram(m_programHandle);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(m_programHandle, gl.LINK_STATUS)) {
      console.log("[ERROR] Unable to initialize the shader program.");
      return false;
    }

    return true;
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Use the shader program
   */
  /////////////////////////////////////////////////////////////////////////////
  this.use = function() {
    gl.useProgram(m_programHandle);
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Peform any initialization required
   */
  /////////////////////////////////////////////////////////////////////////////
  this._setup = function(renderState) {
    if (m_programHandle === 0) {
      m_programHandle = gl.createProgram();
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Peform any clean up required when the program gets deleted
   */
  /////////////////////////////////////////////////////////////////////////////
  this._cleanup = function(renderState) {
    m_this.deleteVertexAndFragment();
    m_this.deleteProgram();
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Delete the shader program
   */
  /////////////////////////////////////////////////////////////////////////////
  this.deleteProgram = function() {
    gl.deleteProgram(m_programHandle);
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Delete vertex and fragment shaders
   */
  /////////////////////////////////////////////////////////////////////////////
  this.deleteVertexAndFragment = function() {
    var i;
    for (i = 0; i < m_shaders.length; ++i) {
      gl.detachShader(m_shaders[i].shaderHandle());
      gl.deleteShader(m_shaders[i].shaderHandle());
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Compile and link a shader
   */
  /////////////////////////////////////////////////////////////////////////////
  this.compileAndLink = function(renderState) {
    var i;

    if (m_compileTimestamp.getMTime() >= this.getMTime()) {
      return;
    }

    m_this._setup(renderState);

    // Compile shaders
    for (i = 0; i < m_shaders.length; ++i) {
      m_shaders[i].compile();
      m_shaders[i].attachShader(m_programHandle);
    }

    m_this.bindAttributes();

    // link program
    if (!m_this.link()) {
      console.log("[ERROR] Failed to link Program");
      m_this._cleanup();
    }

    m_compileTimestamp.modified();
  }

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Bind the program with its shaders
   *
   * @param renderState
   * @returns {boolean}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.bind = function(renderState) {
    var i = 0;

    if (m_bindTimestamp.getMTime() < m_this.getMTime()) {

      // Compile shaders
      m_this.compileAndLink();

      m_this.use();
      m_this.bindUniforms();
      m_bindTimestamp.modified();
    }
    else {
      m_this.use();
    }

    // Call update callback.
    for (i = 0; i < m_uniforms.length; ++i) {
      m_uniforms[i].update(renderState, m_this);
    }

    // Now update values to GL.
    m_this.updateUniforms();
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Undo binding of the shader program
   *
   * @param renderState
   */
  /////////////////////////////////////////////////////////////////////////////
  this.undoBind = function(renderState) {
    // REF https://www.khronos.org/opengles/sdk/docs/man/xhtml/glUseProgram.xml
    // If program is 0, then the current rendering state refers to an invalid
    // program object, and the results of vertex and fragment shader execution
    // due to any glDrawArrays or glDrawElements commands are undefined
    gl.useProgram(null);
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Bind vertex data
   *
   * @param renderState
   * @param key
   */
  /////////////////////////////////////////////////////////////////////////////
  this.bindVertexData = function(renderState, key) {
    if (m_vertexAttributes.hasOwnProperty(key)) {
      m_vertexAttributes[key].bindVertexData(renderState, key);
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Undo bind vetex data
   *
   * @param renderState
   * @param key
   */
  /////////////////////////////////////////////////////////////////////////////
  this.undoBindVertexData = function(renderState, key) {
    if (m_vertexAttributes.hasOwnProperty(key)) {
      m_vertexAttributes[key].undoBindVertexData(renderState, key);
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Bind uniforms
   */
  /////////////////////////////////////////////////////////////////////////////
  this.bindUniforms = function() {
    var i;
    for (i = 0; i < m_uniforms.length; ++i) {
      m_uniformNameToLocation[m_uniforms[i].name()] = this
          .queryUniformLocation(m_uniforms[i].name());
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Bind vertex attributes
   */
  /////////////////////////////////////////////////////////////////////////////
  this.bindAttributes = function() {
    var key, name;
    for (key in m_vertexAttributes) {
      name = m_vertexAttributes[key].name();
      gl.bindAttribLocation(m_programHandle, key, name);
      m_vertexAttributeNameToLocation[name] = key;
    }
  };

  return m_this;
};

inherit(vgl.shaderProgram, vgl.materialAttribute);
