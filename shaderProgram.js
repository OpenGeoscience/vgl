/*========================================================================
  VGL --- VTK WebGL Rendering Toolkit

  Copyright 2013 Kitware, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 ========================================================================*/

//////////////////////////////////////////////////////////////////////////////
//
// shaderProgram class
//
//////////////////////////////////////////////////////////////////////////////

vglModule.shaderProgram = function() {
  vglModule.materialAttribute.call(this);

  this.m_type = materialAttributeType.ShaderProgram;
  this.m_programHandle = 0;
  this.m_shaders = [];
  this.m_uniforms = [];
  this.m_vertexAttributes = {};

  this.m_uniformNameToLocation = {};
  this.m_vertexAttributeNameToLocation = {};
};

inherit(vglModule.shaderProgram, vglModule.materialAttribute);

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.queryUniformLocation = function(name) {
  return gl.getUniformLocation(this.m_programHandle, name);
};

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.queryAttributeLocation = function(name) {
  return gl.getAttribLocation(this.m_programHandle, name);
};

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.addShader = function(shader) {
  if (this.m_shaders.indexOf(shader) > -1)   {
    return false;
  }

  for (var i = 0; i < this.m_shaders.length; ++i) {
    if (this.m_shaders[i].shaderType() === shader.shaderType()) {
      this.m_shaders.splice(this.m_shaders.indexOf(shader), 1);
    }
  }

  this.m_shaders.push(shader);

  this.setModified();

  return true;
};

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.addUniform = function(uniform) {
  if (this.m_uniforms.indexOf(uniform) > -1) {
    return false;
  }

  this.m_uniforms.push(uniform);

  this.setModified();
};

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.addVertexAttribute = function(attr, key) {
  this.m_vertexAttributes[key] = attr;

  this.setModified();
};

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.uniformLocation = function(name) {
  return this.m_uniformNameToLocation[name];
};
///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.attributeLocation = function(name) {
  return this.m_vertexAttributeNameToLocation[name];
};

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.uniformExist = function() {
  // TODO
};

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.updateUniforms = function() {
  for (var i = 0; i < this.m_uniforms.length; ++i) {
    this.m_uniforms[i].callGL(
      this.m_uniformNameToLocation[this.m_uniforms[i].name()]);
  }
};

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.link = function() {
  gl.linkProgram(this.m_programHandle);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(this.m_programHandle, gl.LINK_STATUS)) {
    console.log("[ERROR] Unable to initialize the shader program.");
    return false;
  }

  return true;
};

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.validate = function() {
  // TODO
};

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.use = function() {
  gl.useProgram(this.m_programHandle);
};

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.cleanUp = function() {
  this.deleteVertexAndFragment();
  this.deleteProgram();
};

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.deleteProgram = function() {
  gl.deleteProgram(this.m_programHandle);
};

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.deleteVertexAndFragment = function() {
  for (var i = 0; i < this.m_shaders.length; ++i) {
    gl.deleteShader(this.m_shaders[i].shaderHandle());
  }
};

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.bind = function(renderState) {
  var i = 0;

  if (this.m_programHandle === 0 || this.modified()) {
    this.m_programHandle = gl.createProgram();

    if (this.m_programHandle === 0) {
      console.log("[ERROR] Cannot create Program Object");
      return false;
    }

    // Compile shaders
    for (i = 0; i < this.m_shaders.length; ++i) {
      this.m_shaders[i].compile();
      this.m_shaders[i].attachShader(this.m_programHandle);
    }

    this.bindAttributes();

    // link program
    if (!this.link()) {
      console.log("[ERROR] Failed to link Program");
      this.cleanUp();
    }

    this.use();

    this.bindUniforms();

    this.setModified(false);
  }
  else {
    this.use();
  }

  // Call update callback.
  for (i = 0; i < this.m_uniforms.length; ++i) {
    this.m_uniforms[i].update(renderState, this);
  }

  // Now update values to GL.
  this.updateUniforms();
};
///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.undoBind = function(renderState) {
  // Do nothing
};

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.bindVertexData = function(renderState, key) {
  if (this.m_vertexAttributes.hasOwnProperty(key)) {
    this.m_vertexAttributes[key].bindVertexData(renderState, key);
  }
};
///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.undoBindVertexData = function(renderState, key) {
  if (this.m_vertexAttributes.hasOwnProperty(key)) {
    this.m_vertexAttributes[key].undoBindVertexData(renderState, key);
  }
};

///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.bindUniforms = function() {
  for (var i = 0; i < this.m_uniforms.length; ++i) {
    this.m_uniformNameToLocation[this.m_uniforms[i].name()] =
      this.queryUniformLocation(this.m_uniforms[i].name());
  }
};
///---------------------------------------------------------------------------
vglModule.shaderProgram.prototype.bindAttributes = function() {
  var index = 0;
  for (var i in this.m_vertexAttributes) {
    var name = this.m_vertexAttributes[i].name();
    gl.bindAttribLocation(this.m_programHandle, index, name);
    this.m_vertexAttributeNameToLocation[name] = index++;
  }
};