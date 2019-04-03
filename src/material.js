//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*global vgl, inherit*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class material
 *
 * @class
 * @returns {vgl.material}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.material = function () {
  'use strict';

  if (!(this instanceof vgl.material)) {
    return new vgl.material();
  }
  vgl.graphicsObject.call(this);

  // / Private member variables
  var m_this = this,
      m_shaderProgram = new vgl.shaderProgram(),
      m_binNumber = 100,
      m_textureAttributes = {},
      m_attributes = {};

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return bin number for the material
   *
   * @default 100
   * @returns {number}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.binNumber = function () {
    return m_binNumber;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set bin number for the material
   *
   * @param binNo
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setBinNumber = function (binNo) {
    m_binNumber = binNo;
    m_this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Check if incoming attribute already exists in the material
   *
   * @param attr
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.exists = function (attr) {
    if (attr.type() === vgl.materialAttributeType.Texture) {
      return m_textureAttributes.hasOwnProperty(attr.textureUnit());
    }
    return m_attributes.hasOwnProperty(attr.type());
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get uniform given a name

   * @param name Uniform name
   * @returns {vgl.uniform}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.uniform = function (name) {
    return m_shaderProgram ? m_shaderProgram.uniform(name) : null;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Get material attribute

   * @param {number} type attribute type
   * @param {number} textureUnit attribute texture unit if type is Texture.
   * @returns {vgl.materialAttribute}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.attribute = function (type, textureUnit) {
    if (m_attributes.hasOwnProperty(type)) {
      return m_attributes[type];
    }

    if (type === vgl.materialAttributeType.Texture && m_textureAttributes.hasOwnProperty(textureUnit)) {
      return m_textureAttributes[textureUnit];
    }

    return null;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Set a new attribute for the material
   *
   * This method replace any existing attribute except for textures as
   * materials can have multiple textures.
   *
   * @param attr
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.setAttribute = function (attr) {
    if (attr.type() === vgl.materialAttributeType.Texture) {
      if (m_textureAttributes[attr.textureUnit()] === attr) {
        return false;
      }
      m_textureAttributes[attr.textureUnit()] = attr;
      m_this.modified();
      return true;
    }

    if (m_attributes[attr.type()] === attr) {
      return false;
    }

    // Shader is a very special attribute
    if (attr.type() === vgl.materialAttributeType.ShaderProgram) {
      m_shaderProgram = attr;
    }

    m_attributes[attr.type()] = attr;
    m_this.modified();
    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Add a new attribute to the material.
   *
   * @param attr
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.addAttribute = function (attr) {
    if (m_this.exists(attr)) {
      return false;
    }

    if (attr.type() === vgl.materialAttributeType.Texture) {
      // TODO Currently we don't check if we are replacing or not.
      // It would be nice to have a flag for it.
      m_textureAttributes[attr.textureUnit()] = attr;
      m_this.modified();
      return true;
    }

    // Shader is a very special attribute
    if (attr.type() === vgl.materialAttributeType.ShaderProgram) {
      m_shaderProgram = attr;
    }

    m_attributes[attr.type()] = attr;
    m_this.modified();
    return true;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return shader program used by the material
   *
   * @returns {vgl.shaderProgram}
   */
  ////////////////////////////////////////////////////////////////////////////
  this.shaderProgram = function () {
    return m_shaderProgram;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Setup (initialize) the material attribute
   *
   * @param renderState
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this._setup = function (renderState) {
    void renderState; /* unused parameter */
    return false;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Remove any resources acquired before deletion
   *
   * @param renderState
   * @returns {boolean}
   */
  ////////////////////////////////////////////////////////////////////////////
  this._cleanup = function (renderState) {
    for (var key in m_attributes) {
      if (m_attributes.hasOwnProperty(key)) {
        m_attributes[key]._cleanup(renderState);
      }
    }

    for (key in m_textureAttributes) {
      if (m_textureAttributes.hasOwnProperty(key)) {
        m_textureAttributes[key]._cleanup(renderState);
      }
    }
    m_shaderProgram._cleanup(renderState);
    m_this.modified();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Bind and activate material states
   *
   * @param renderState
   */
  ////////////////////////////////////////////////////////////////////////////
  this.bind = function (renderState) {
    var key = null;

    m_shaderProgram.bind(renderState);

    for (key in m_attributes) {
      if (m_attributes.hasOwnProperty(key)) {
        if (m_attributes[key] !== m_shaderProgram) {
          m_attributes[key].bind(renderState);
        }
      }
    }

    for (key in m_textureAttributes) {
      if (m_textureAttributes.hasOwnProperty(key)) {
        m_textureAttributes[key].bind(renderState);
      }
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Undo-bind and de-activate material states
   *
   * @param renderState
   */
  ////////////////////////////////////////////////////////////////////////////
  this.undoBind = function (renderState) {
    var key = null;
    for (key in m_attributes) {
      if (m_attributes.hasOwnProperty(key)) {
        m_attributes[key].undoBind(renderState);
      }
    }

    for (key in m_textureAttributes) {
      if (m_textureAttributes.hasOwnProperty(key)) {
        m_textureAttributes[key].undoBind(renderState);
      }
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Bind vertex data
   *
   * @param renderState
   * @param key
   */
  ////////////////////////////////////////////////////////////////////////////
  this.bindVertexData = function (renderState, key) {
    var i = null;

    for (i in m_attributes) {
      if (m_attributes.hasOwnProperty(i)) {
        m_attributes[i].bindVertexData(renderState, key);
      }
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Undo bind vertex data
   *
   * @param renderState
   * @param key
   */
  ////////////////////////////////////////////////////////////////////////////
  this.undoBindVertexData = function (renderState, key) {
    var i = null;

    for (i in m_attributes) {
      if (m_attributes.hasOwnProperty(i)) {
        m_attributes[i].undoBindVertexData(renderState, key);
      }
    }
  };

  return m_this;
};

vgl.material.RenderBin = {
  'Base' : 0,
  'Default' : 100,
  'Opaque' : 100,
  'Transparent' : 1000,
  'Overlay' : 10000
};

inherit(vgl.material, vgl.graphicsObject);
