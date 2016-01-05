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

  var m_shaderContexts = [],
      m_shaderType = type,
      m_shaderSource = '';

  /**
   * A shader can be associated with multiple contexts.  Each context needs to
   * be compiled and attached separately.  These are tracked in the
   * m_shaderContexts array.
   *
   * @param renderState a renderState that includes a m_context value.
   * @return an object with context, compileTimestamp, and, if compiled, a
   *    shaderHandle entry.
   */
  this._getContextEntry = function (renderState) {
    var context = renderState.m_context, i, entry;
    for (i = 0; i < m_shaderContexts.length; i += 1) {
      if (m_shaderContexts[i].context === context) {
        return m_shaderContexts[i];
      }
    }
    entry = {
      context: context,
      compileTimestamp: vgl.timestamp()
    };
    m_shaderContexts.push(entry);
    return entry;
  };

  /**
   * Remove the context from the list of tracked contexts.  This allows the
   * associated shader handle to be GCed.  Does nothing if the context is not
   * in the list of tracked contexts.
   *
   * @param renderState a renderState that includes a m_context value.
   */
  this.removeContext = function (renderState) {
    var context = renderState.m_context, i;
    for (i = 0; i < m_shaderContexts.length; i += 1) {
      if (m_shaderContexts[i].context === context) {
        m_shaderContexts.splice(i, 1);
        return;
      }
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Get shader handle
   */
  /////////////////////////////////////////////////////////////////////////////
  this.shaderHandle = function (renderState) {
    var entry = this._getContextEntry(renderState);
    return entry.shaderHandle;
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
    var entry = this._getContextEntry(renderState);
    if (this.getMTime() < entry.compileTimestamp.getMTime()) {
      return entry.shaderHandle;
    }

    renderState.m_context.deleteShader(entry.shaderHandle);
    entry.shaderHandle = renderState.m_context.createShader(m_shaderType);
    renderState.m_context.shaderSource(entry.shaderHandle, m_shaderSource);
    renderState.m_context.compileShader(entry.shaderHandle);

    // See if it compiled successfully
    if (!renderState.m_context.getShaderParameter(entry.shaderHandle,
        vgl.GL.COMPILE_STATUS)) {
      console.log('[ERROR] An error occurred compiling the shaders: ' +
                  renderState.m_context.getShaderInfoLog(entry.shaderHandle));
      console.log(m_shaderSource);
      renderState.m_context.deleteShader(entry.shaderHandle);
      return null;
    }

    entry.compileTimestamp.modified();

    return entry.shaderHandle;
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Attach shader to the program
   *
   * @param programHandle
   */
  /////////////////////////////////////////////////////////////////////////////
  this.attachShader = function (renderState, programHandle) {
    renderState.m_context.attachShader(
        programHandle, this.shaderHandle(renderState));
  };
};

inherit(vgl.shader, vgl.object);


/* We can use the same shader multiple times if it is identical.  This caches
 * the last N shaders and will reuse them when possible.  The cache keeps the
 * most recently requested shader at the front.  If you are doing anything more
 * to a shader then creating it and setting its source once, do not use this
 * cache.
 */
(function () {
  'use strict';
  var m_shaderCache = [],
      m_shaderCacheMaxSize = 10;

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Get a shader from the cache.  Create a new shader if necessary using a
   * specific source.
   *
   * @param type One of vgl.GL.*_SHADER
   * @param context the GL context for the shader.
   * @param {string} source the source code of the shader.
   */
  /////////////////////////////////////////////////////////////////////////////
  vgl.getCachedShader = function (type, context, source) {
    for (var i = 0; i < m_shaderCache.length; i += 1) {
      if (m_shaderCache[i].type === type &&
          m_shaderCache[i].context === context &&
          m_shaderCache[i].source === source) {
        if (i) {
          m_shaderCache.splice(0, 0, m_shaderCache.splice(i, 1)[0]);
        }
        return m_shaderCache[0].shader;
      }
    }
    var shader = new vgl.shader(type);
    shader.setShaderSource(source);
    m_shaderCache.unshift({
      type: type,
      context: context,
      source: source,
      shader: shader
    });
    if (m_shaderCache.length >= m_shaderCacheMaxSize) {
      m_shaderCache.splice(m_shaderCacheMaxSize,
                           m_shaderCache.length - m_shaderCacheMaxSize);
    }
    return shader;
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Clear the shader cache.
   *
   * @param context the GL context to clear, or null for clear all.
   */
  /////////////////////////////////////////////////////////////////////////////
  vgl.clearCachedShaders = function (context) {
    for (var i = m_shaderCache.length - 1; i >= 0; i -= 1) {
      if (context === null || context === undefined ||
          m_shaderCache[i].context === context) {
        m_shaderCache.splice(i, 1);
      }
    }
  };
})();
