//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global vgl, gl, ogs, vec2, vec3, vec4, mat3, mat4, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class uniform
 *
 * @param type
 * @param name
 * @returns {vgl.uniform} OpenGL uniform encapsulation
 */
///////////////////////////////////////////////////////////////////////////////
vgl.uniform = function(type, name) {
  'use strict';

  if (!(this instanceof vgl.uniform)) {
    return new vgl.uniform();
  }

  this.getTypeNumberOfComponents = function(type) {
    switch (type) {
      case gl.FLOAT:
      case gl.INT:
      case gl.BOOL:
        return 1;

      case gl.FLOAT_VEC2:
      case gl.INT_VEC2:
      case gl.BOOL_VEC2:
        return 2;

      case gl.FLOAT_VEC3:
      case gl.INT_VEC3:
      case gl.BOOLT_VEC3:
        return 3;

      case gl.FLOAT_VEC4:
      case gl.INT_VEC4:
      case gl.BOOL_VEC4:
        return 4;

      case gl.FLOAT_MAT3:
        return 9;

      case gl.FLOAT_MAT4:
        return 16;

      default:
        return 0;
    }
  };

  var m_type = type,
      m_name = name,
      m_dataArray = [ this.getTypeNumberOfComponents(m_type) ],
      m_numberOfElements = 1;

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Get name of the uniform
   *
   * @returns {*}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.name = function() {
    return m_name;
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Get type of the uniform
   *
   * @returns {*}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.type = function() {
    return m_type;
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Get value of the uniform
   *
   * @returns {Array}
   */
  /////////////////////////////////////////////////////////////////////////////
  this.get = function() {
    return m_dataArray;
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Set value of the uniform
   *
   * @param value
   */
  /////////////////////////////////////////////////////////////////////////////
  this.set = function(value) {
    var i = 0;
    if (value instanceof mat4.constructor) {
      for (i = 0; i < 16; ++i) {
        m_dataArray[i] = value[i];
      }
    }
    else if (value instanceof mat3.constructor) {
      for (i = 0; i < 9; ++i) {
        m_dataArray[i] = value[i];
      }
    }
    else if (value instanceof vec4.constructor) {
      for (i = 0; i < 4; ++i) {
        m_dataArray[i] = value[i];
      }
    }
    else if (value instanceof vec3.constructor) {
      for (i = 0; i < 3; ++i) {
        m_dataArray[i] = value[i];
      }
    }
    else if (value instanceof vec2.constructor) {
      for (i = 0; i < 2; ++i) {
        m_dataArray[i] = value[i];
      }
    }
    else {
      m_dataArray[0] = value;
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Call GL and pass updated values to the current shader
   *
   * @param location
   */
  /////////////////////////////////////////////////////////////////////////////
  this.callGL = function(location) {
    if (this.m_numberElements < 1) {
      return;
    }

    switch (m_type) {
      case gl.BOOL:
      case gl.INT:
        gl.uniform1iv(location, m_dataArray);
        break;
      case gl.FLOAT:
        gl.uniform1fv(location, m_dataArray);
        break;
      case gl.FLOAT_VEC2:
        gl.uniform2fv(location, m_dataArray);
        break;
      case gl.FLOAT_VEC3:
        gl.uniform3fv(location, m_dataArray);
        break;
      case gl.FLOAT_VEC4:
        gl.uniform4fv(location, m_dataArray);
        break;
      case gl.FLOAT_MAT3:
        gl.uniformMatrix3fv(location, gl.FALSE, m_dataArray);
        break;
      case gl.FLOAT_MAT4:
        gl.uniformMatrix4fv(location, gl.FALSE, m_dataArray);
        break;
      default:
        break;
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Virtual method to update the uniform
   *
   * Should be implemented by the derived class.
   *
   * @param renderState
   * @param program
   */
  /////////////////////////////////////////////////////////////////////////////
  this.update = function(renderState, program) {
    // Should be implemented by the derived class
  };

  return this;
};

///////////////////////////////////////////////////////////////////////////////
/**
 * Create new instance of class modelViewUniform
 *
 * @param name
 * @returns {vgl.modelViewUniform}
 */
///////////////////////////////////////////////////////////////////////////////
vgl.modelViewUniform = function(name) {
  'use strict';

  if (!(this instanceof vgl.modelViewUniform)) {
    return new vgl.modelViewUniform(name);
  }

  if (name.length === 0) {
    name = "modelViewMatrix";
  }

  vgl.uniform.call(this, gl.FLOAT_MAT4, name);

  this.set(mat4.create());

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Update the uniform given a render state and shader program
   *
   * @param {vgl.renderState} renderState
   * @param {vgl.shaderProgram} program
   */
  /////////////////////////////////////////////////////////////////////////////
  this.update = function(renderState, program) {
    this.set(renderState.m_modelViewMatrix);
  };

  return this;
};

inherit(vgl.modelViewUniform, vgl.uniform);

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class projectionUniform
 *
 * @param name
 * @returns {vgl.projectionUniform}
 */
///////////////////////////////////////////////////////////////////////////////
vgl.projectionUniform = function(name) {
  'use strict';

  if (!(this instanceof vgl.projectionUniform)) {
    return new vgl.projectionUniform(name);
  }

  if (name.length === 0) {
    name = "projectionMatrix";
  }

  vgl.uniform.call(this, gl.FLOAT_MAT4, name);

  this.set(mat4.create());

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Update the uniform given a render state and shader program
   *
   * @param renderState
   * @param program
   */
  /////////////////////////////////////////////////////////////////////////////
  this.update = function(renderState, program) {
    this.set(renderState.m_projectionMatrix);
  };

  return this;
};

inherit(vgl.projectionUniform, vgl.uniform);

///////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class floatUniform
 *
 * @param name
 * @param value
 * @returns {vgl.floatUniform}
 */
///////////////////////////////////////////////////////////////////////////////
vgl.floatUniform = function(name, value) {
  'use strict';

  if (!(this instanceof vgl.floatUniform)) {
    return new vgl.floatUniform(name, value);
  }

  if (name.length === 0) {
    name = "floatUniform";
  }

  value = value === undefined ? 1.0 : value;

  vgl.uniform.call(this, gl.FLOAT, name);

  this.set(value);
};

inherit(vgl.floatUniform, vgl.uniform);


///////////////////////////////////////////////////////////////////////////////
/**
 * Create new instance of class normalMatrixUniform
 *
 * @param name
 * @returns {vgl.normalMatrixUniform}
 */
///////////////////////////////////////////////////////////////////////////////
vgl.normalMatrixUniform = function(name) {
  'use strict';

  if (!(this instanceof vgl.normalMatrixUniform)) {
    return new vgl.normalMatrixUniform(name);
  }

  if (name.length === 0) {
    name = "normalMatrix";
  }

  vgl.uniform.call(this, gl.FLOAT_MAT4, name);

  this.set(mat4.create());

  /////////////////////////////////////////////////////////////////////////////
  /**
   * Update the uniform given a render state and shader program
   *
   * @param {vgl.renderState} renderState
   * @param {vgl.shaderProgram} program
   */
  /////////////////////////////////////////////////////////////////////////////
  this.update = function(renderState, program) {
    this.set(renderState.m_normalMatrix);
  };

  return this;
};

inherit(vgl.normalMatrixUniform, vgl.uniform);
