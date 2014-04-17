//////////////////////////////////////////////////////////////////////////////
/**
 * @module vgl
 */

/*jslint devel: true, forin: true, newcap: true, plusplus: true*/
/*jslint white: true, continue:true, indent: 2*/

/*global document, vgl, gl, ogs, vec4, inherit, $*/
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class utils
 *
 * Utility class provides helper functions such as functions to create
 * shaders, geometry etc.
 *
 * @returns {vgl.utils}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils = function() {
  'use strict';

  if (!(this instanceof vgl.utils)) {
    return new vgl.utils();
  }
  vgl.object.call(this);

  return this;
};

inherit(vgl.utils, vgl.object);

//////////////////////////////////////////////////////////////////////////////
/**
 * Helper function to compute power of 2 number
 *
 * @param value
 * @param pow
 *
 * @returns {number}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.computePowerOfTwo = function(value, pow) {
  'use strict';
  pow = pow || 1;
  while (pow < value) {
    pow *= 2;
  }
  return pow;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of default vertex shader that uses a texture
 *
 * Helper function to create default vertex shader
 *
 * @param context
 * @returns {vgl.shader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createTextureVertexShader = function(context) {
  'use strict';
  var vertexShaderSource = [
        'attribute vec3 vertexPosition;',
        'attribute vec3 textureCoord;',
        'uniform mediump float pointSize;',
        'uniform mat4 modelViewMatrix;',
        'uniform mat4 projectionMatrix;',
        'varying highp vec3 iTextureCoord;',
        'void main(void)',
        '{',
        'gl_PointSize = pointSize;',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);',
        ' iTextureCoord = textureCoord;', '}' ].join('\n'),
      shader = new vgl.shader(gl.VERTEX_SHADER);
  shader.setShaderSource(vertexShaderSource);
  return shader;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of default fragment shader that uses a texture
 *
 * Helper function to create default fragment shader with sampler
 *
 * @param context
 * @returns {vgl.shader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createTextureFragmentShader = function(context) {
  'use strict';
  var fragmentShaderSource = [
        'varying highp vec3 iTextureCoord;',
        'uniform sampler2D sampler2d;',
        'uniform mediump float opacity;',
        'void main(void) {',
        'gl_FragColor = vec4(texture2D(sampler2d, vec2(iTextureCoord.s, iTextureCoord.t)).xyz, opacity);',
        '}' ].join('\n'),
      shader = new vgl.shader(gl.FRAGMENT_SHADER);

  shader.setShaderSource(fragmentShaderSource);
  return shader;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create variation of createTextureFragmentShader which uses texture alpha
 *
 * Helper function to create default fragment shader with sampler
 *
 * @param context
 * @returns {vgl.shader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createRgbaTextureFragmentShader = function(context) {
  'use strict';
  var fragmentShaderSource = [
        'varying highp vec3 iTextureCoord;',
        'uniform sampler2D sampler2d;',
        'void main(void) {',
        'gl_FragColor = vec4(texture2D(sampler2d, vec2(iTextureCoord.s, iTextureCoord.t)).xyzw);',
        '}' ].join('\n'),
      shader = new vgl.shader(gl.FRAGMENT_SHADER);

  shader.setShaderSource(fragmentShaderSource);
  return shader;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of default vertex shader
 *
 * Helper function to create default vertex shader
 *
 * @param context
 * @returns {vgl.shader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createVertexShader = function(context) {
  'use strict';
  var vertexShaderSource = [
        'attribute vec3 vertexPosition;',
        'attribute vec3 vertexColor;',
        'uniform mediump float pointSize;',
        'uniform mat4 modelViewMatrix;',
        'uniform mat4 projectionMatrix;',
        'varying mediump vec3 iVertexColor;',
        'varying highp vec3 iTextureCoord;',
        'void main(void)',
        '{',
        'gl_PointSize = pointSize;',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);',
        ' iVertexColor = vertexColor;', '}' ].join('\n'),
      shader = new vgl.shader(gl.VERTEX_SHADER);

  shader.setShaderSource(vertexShaderSource);
  return shader;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of vertex shader with a solid color
 *
 * Helper function to create default vertex shader
 *
 * @param context
 * @returns {vgl.shader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createVertexShaderSolidColor = function(context) {
  'use strict';
  var vertexShaderSource = [
        'attribute vec3 vertexPosition;',
        'uniform mediump float pointSize;',
        'uniform mat4 modelViewMatrix;',
        'uniform mat4 projectionMatrix;',
        'void main(void)',
        '{',
        'gl_PointSize = pointSize;',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);',
        '}' ].join('\n'),
    shader = new vgl.shader(gl.VERTEX_SHADER);

  shader.setShaderSource(vertexShaderSource);
  return shader;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of vertex shader that passes values through
 * for color mapping
 *
 * Helper function to create default vertex shader
 *
 * @param context
 * @returns {vgl.shader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createVertexShaderColorMap = function(context, min, max) {
  'use strict';
  var vertexShaderSource = [
        'attribute vec3 vertexPosition;',
        'attribute float vertexScalar;',
        'uniform mediump float pointSize;',
        'uniform mat4 modelViewMatrix;',
        'uniform mat4 projectionMatrix;',
        'uniform float lutMin;',
        'uniform float lutMax;',
        'varying mediump float iVertexScalar;',
        'void main(void)',
        '{',
        'gl_PointSize = pointSize;',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);',
        'iVertexScalar = (vertexScalar-lutMin)/(lutMax-lutMin);',
        '}' ].join('\n'),
      shader = new vgl.shader(gl.VERTEX_SHADER);

  shader.setShaderSource(vertexShaderSource);
  return shader;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of default fragment shader
 *
 * Helper function to create default fragment shader
 *
 * @param context
 * @returns {vgl.shader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createFragmentShader = function(context) {
  'use strict';
  var fragmentShaderSource = [ 'varying mediump vec3 iVertexColor;',
                              'uniform mediump float opacity;',
                              'void main(void) {',
                              'gl_FragColor = vec4(iVertexColor, opacity);',
                              '}' ].join('\n'),
      shader = new vgl.shader(gl.FRAGMENT_SHADER);

  shader.setShaderSource(fragmentShaderSource);
  return shader;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a Phong vertex shader
 *
 * Helper function to create Phong vertex shader
 *
 * @param context
 * @returns {vgl.shader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createPhongVertexShader = function(context) {
  'use strict';

  var vertexShaderSource = [
      'attribute highp vec3 vertexPosition;',
      'attribute mediump vec3 vertexNormal;',
      'attribute mediump vec3 vertexColor;',

      'uniform highp mat4 projectionMatrix;',
      'uniform mat4 modelViewMatrix;',
      'uniform mat4 normalMatrix;',

      'varying highp vec4 varPosition;',
      'varying mediump vec3 varNormal;',
      'varying mediump vec3 iVertexColor;',

      'void main(void)',
      '{',
      'varPosition = modelViewMatrix * vec4(vertexPosition, 1.0);',
      'gl_Position = projectionMatrix * varPosition;',
      'varNormal = vec3(normalMatrix * vec4(vertexNormal, 0.0));',
      'iVertexColor = vertexColor;',
      '}' ].join('\n'),

      shader = new vgl.shader(gl.VERTEX_SHADER);

  shader.setShaderSource(vertexShaderSource);

  return shader;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of Phong fragment shader
 *
 * Helper function to create Phong fragment shader
 *
 * NOTE: Shader assumes directional light
 *
 * @param context
 * @returns {vgl.shader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createPhongFragmentShader = function(context) {
  'use strict';
  var fragmentShaderSource = [
    'precision mediump float;',
    'varying vec3 varNormal;',
    'varying vec4 varPosition;',
    'varying mediump vec3 iVertexColor;',
    'const vec3 lightPos = vec3(0.0, 0.0,10000.0);',
    'const vec3 ambientColor = vec3(0.01, 0.01, 0.01);',
    'const vec3 specColor = vec3(1.0, 1.0, 1.0);',

    'void main() {',
    'vec3 normal = normalize(varNormal);',
    'vec3 lightDir = normalize(lightPos);',
    'vec3 reflectDir = -reflect(lightDir, normal);',
    'vec3 viewDir = normalize(-varPosition.xyz);',

    'float lambertian = max(dot(lightDir,normal), 0.0);',
    'float specular = 0.0;',

    'if(lambertian > 0.0) {',
    'float specAngle = max(dot(reflectDir, viewDir), 0.0);',
    'specular = pow(specAngle, 64.0);',
    '}',
    'gl_FragColor = vec4(ambientColor +',
    'lambertian*iVertexColor +',
    'specular*specColor, 1.0);',
    '}' ].join('\n'),
    shader = new vgl.shader(gl.FRAGMENT_SHADER);

  shader.setShaderSource(fragmentShaderSource);
  return shader;
};


//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of fragment shader with an assigned constant color.
 *
 * Helper function to create default fragment shader
 *
 * @param context
 * @returns {vgl.shader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createFragmentShaderSolidColor = function(context, color) {
  'use strict';
  var fragmentShaderSource = ['uniform mediump float opacity;',
                              'void main(void) {',
                              'gl_FragColor = vec4(' + color[0] + ',' + color[1] + ',' + color[2] + ', opacity);',
                              '}' ].join('\n'),
      shader = new vgl.shader(gl.FRAGMENT_SHADER);

  shader.setShaderSource(fragmentShaderSource);
  return shader;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of fragment shader that maps values into colors bia lookup table
 *
 * Helper function to create default fragment shader
 *
 * @param context
 * @returns {vgl.shader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createFragmentShaderColorMap = function(context) {
  'use strict';
  var fragmentShaderSource = [
        'varying mediump float iVertexScalar;',
        'uniform sampler2D sampler2d;',
        'uniform mediump float opacity;',
        'void main(void) {',
        'gl_FragColor = vec4(texture2D(sampler2d, vec2(iVertexScalar, 0.0)).xyz, opacity);',
        '}' ].join('\n'),
      shader = new vgl.shader(gl.FRAGMENT_SHADER);

  shader.setShaderSource(fragmentShaderSource);
  return shader;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of vertex shader for point sprites
 *
 * Helper function to create default point sprites vertex shader
 *
 * @param context
 * @returns {vgl.shader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createPointSpritesVertexShader = function(context) {
  'use strict';
  var vertexShaderSource = [
        'attribute vec3 vertexPosition;',
        'uniform mediump float pointSize;',
        'uniform mat4 modelViewMatrix;',
        'uniform mat4 projectionMatrix;',
        'uniform float height;',
        'varying mediump vec3 iVertexColor;',
        'varying highp float iVertexScalar;',
        'void main(void)',
        '{',
        'gl_PointSize = pointSize;',
        'iVertexScalar = vertexPosition.z;',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition.xy, height, 1.0);',
        ' iVertexColor = vec3(1.0, 1.0, 1.0);', '}' ].join('\n'),
      shader = new vgl.shader(gl.VERTEX_SHADER);
  shader.setShaderSource(vertexShaderSource);
  return shader;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of fragment shader for point sprites
 *
 * Helper function to create default point sprites fragment shader
 *
 * @param context
 * @returns {vgl.shader}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createPointSpritesFragmentShader = function(context) {
  'use strict';
  var fragmentShaderSource = [
        'varying mediump vec3 iVertexColor;',
        'varying highp float iVertexScalar;',
        'uniform sampler2D opacityLookup;',
        'uniform highp float lutMin;',
        'uniform highp float lutMax;',
        'uniform sampler2D scalarsToColors;',
        'uniform mediump float opacity;',
        'uniform mediump float vertexColorWeight;',
        'void main(void) {',
        'highp float texOpacity = texture2D(opacityLookup, gl_PointCoord).w;',
        'gl_FragColor = vec4(texture2D(scalarsToColors, vec2((iVertexScalar - lutMin)/(lutMax - lutMin), 0.0)).xyz, 0.5);',
        '}' ].join('\n'),
    shader = new vgl.shader(gl.FRAGMENT_SHADER);

  shader.setShaderSource(fragmentShaderSource);
  return shader;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of texture material
 *
 * Helper function to create a texture material
 *
 * @returns {vgl.material}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createTextureMaterial = function(isRgba) {
  'use strict';
  var mat = new vgl.material(),
    blend = new vgl.blend(),
    prog = new vgl.shaderProgram(),
    vertexShader = vgl.utils.createTextureVertexShader(gl),
    fragmentShader = null,
    posVertAttr = new vgl.vertexAttribute("vertexPosition"),
    texCoordVertAttr = new vgl.vertexAttribute("textureCoord"),
    pointsizeUniform = new vgl.floatUniform("pointSize", 5.0),
    modelViewUniform = new vgl.modelViewUniform("modelViewMatrix"),
    projectionUniform = new vgl.projectionUniform("projectionMatrix"),
    samplerUniform = new vgl.uniform(gl.INT, "sampler2d"),
    opacityUniform = null;

  samplerUniform.set(0);

  prog.addVertexAttribute(posVertAttr, vgl.vertexAttributeKeys.Position);
  prog.addVertexAttribute(texCoordVertAttr,
                          vgl.vertexAttributeKeys.TextureCoordinate);
  prog.addUniform(pointsizeUniform);
  prog.addUniform(modelViewUniform);
  prog.addUniform(projectionUniform);

  if (isRgba) {
    fragmentShader = vgl.utils.createRgbaTextureFragmentShader(gl);
  } else {
    fragmentShader = vgl.utils.createTextureFragmentShader(gl);
    opacityUniform = new vgl.floatUniform("opacity", 1.0);
    prog.addUniform(opacityUniform);
  }

  prog.addShader(fragmentShader);
  prog.addShader(vertexShader);
  mat.addAttribute(prog);
  mat.addAttribute(blend);

  return mat;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of geometry material
 *
 * Helper function to create geometry material
 *
 * @returns {vgl.material}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createGeometryMaterial = function() {
  'use strict';
   var mat = new vgl.material(),
       blend = new vgl.blend(),
       prog = new vgl.shaderProgram(),
       vertexShader = vgl.utils.createVertexShader(gl),
       fragmentShader = vgl.utils.createFragmentShader(gl),
       posVertAttr = new vgl.vertexAttribute("vertexPosition"),
       colorVertAttr = new vgl.vertexAttribute("vertexColor"),
       pointsizeUniform = new vgl.floatUniform("pointSize", 5.0),
       opacityUniform = new vgl.floatUniform("opacity", 1.0),
       modelViewUniform = new vgl.modelViewUniform("modelViewMatrix"),
       projectionUniform = new vgl.projectionUniform("projectionMatrix");

  prog.addVertexAttribute(posVertAttr, vgl.vertexAttributeKeys.Position);
  prog.addVertexAttribute(colorVertAttr, vgl.vertexAttributeKeys.Color);
  prog.addUniform(pointsizeUniform);
  prog.addUniform(opacityUniform);
  prog.addUniform(modelViewUniform);
  prog.addUniform(projectionUniform);
  prog.addShader(fragmentShader);
  prog.addShader(vertexShader);
  mat.addAttribute(prog);
  mat.addAttribute(blend);

  return mat;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of geometry material with the phong shader
 *
 * Helper function to create color phong shaded geometry material
 *
 * @returns {vgl.material}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createPhongMaterial = function() {
  'use strict';
   var mat = new vgl.material(),
       blend = new vgl.blend(),
       prog = new vgl.shaderProgram(),
       vertexShader = vgl.utils.createPhongVertexShader(gl),
       fragmentShader = vgl.utils.createPhongFragmentShader(gl),
       posVertAttr = new vgl.vertexAttribute("vertexPosition"),
       normalVertAttr = new vgl.vertexAttribute("vertexNormal"),
       colorVertAttr = new vgl.vertexAttribute("vertexColor"),
       opacityUniform = new vgl.floatUniform("opacity", 1.0),
       modelViewUniform = new vgl.modelViewUniform("modelViewMatrix"),
       normalUniform = new vgl.normalMatrixUniform("normalMatrix"),
       projectionUniform = new vgl.projectionUniform("projectionMatrix");

  prog.addVertexAttribute(posVertAttr, vgl.vertexAttributeKeys.Position);
  prog.addVertexAttribute(normalVertAttr, vgl.vertexAttributeKeys.Normal);
  prog.addVertexAttribute(colorVertAttr, vgl.vertexAttributeKeys.Color);
  prog.addUniform(opacityUniform);
  prog.addUniform(modelViewUniform);
  prog.addUniform(projectionUniform);
  prog.addUniform(normalUniform);
  prog.addShader(fragmentShader);
  prog.addShader(vertexShader);
  mat.addAttribute(prog);
  mat.addAttribute(blend);

  return mat;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of colored geometry material
 *
 * Helper function to create color geometry material
 *
 * @returns {vgl.material}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createColorMaterial = function() {
  'use strict';
  var mat = new vgl.material(),
      blend = new vgl.blend(),
      prog = new vgl.shaderProgram(),
      vertexShader = vgl.utils.createVertexShader(gl),
      fragmentShader = vgl.utils.createFragmentShader(gl),
      posVertAttr = new vgl.vertexAttribute("vertexPosition"),
      texCoordVertAttr = new vgl.vertexAttribute("textureCoord"),
      colorVertAttr = new vgl.vertexAttribute("vertexColor"),
      pointsizeUniform = new vgl.floatUniform("pointSize", 5.0),
      opacityUniform = new vgl.floatUniform("opacity", 0.5),
      modelViewUniform = new vgl.modelViewUniform("modelViewMatrix"),
      projectionUniform = new vgl.projectionUniform("projectionMatrix");

  prog.addVertexAttribute(posVertAttr, vgl.vertexAttributeKeys.Position);
  prog.addVertexAttribute(colorVertAttr, vgl.vertexAttributeKeys.Color);
  prog.addVertexAttribute(texCoordVertAttr,
                          vgl.vertexAttributeKeys.TextureCoordinate);
  prog.addUniform(pointsizeUniform);
  prog.addUniform(opacityUniform);
  prog.addUniform(modelViewUniform);
  prog.addUniform(projectionUniform);
  prog.addShader(fragmentShader);
  prog.addShader(vertexShader);
  mat.addAttribute(prog);
  mat.addAttribute(blend);

  return mat;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of geometry material
 *
 * Helper function to create geometry material
 *
 * @returns {vgl.material}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createColorMappedMaterial = function(lut) {
  'use strict';
  if (!lut) {
    lut = new vgl.lookupTable();
  }

  var scalarRange = lut.range(),
      mat = new vgl.material(),
      blend = new vgl.blend(),
      prog = new vgl.shaderProgram(),
      vertexShader = vgl.utils.createVertexShaderColorMap(
        gl,scalarRange[0],scalarRange[1]),
      fragmentShader = vgl.utils.createFragmentShaderColorMap(gl),
      posVertAttr = new vgl.vertexAttribute("vertexPosition"),
      scalarVertAttr = new vgl.vertexAttribute("vertexScalar"),
      pointsizeUniform = new vgl.floatUniform("pointSize", 5.0),
      opacityUniform = new vgl.floatUniform("opacity", 0.5),
      lutMinUniform = new vgl.floatUniform("lutMin", scalarRange[0]),
      lutMaxUniform = new vgl.floatUniform("lutMax", scalarRange[1]),
      modelViewUniform = new vgl.modelViewUniform("modelViewMatrix"),
      projectionUniform = new vgl.projectionUniform("projectionMatrix"),
      samplerUniform = new vgl.uniform(gl.FLOAT, "sampler2d"),
      lookupTable = lut;

  samplerUniform.set(0);

  prog.addVertexAttribute(posVertAttr, vgl.vertexAttributeKeys.Position);
  prog.addVertexAttribute(scalarVertAttr, vgl.vertexAttributeKeys.Scalar);
  prog.addUniform(pointsizeUniform);
  prog.addUniform(opacityUniform);
  prog.addUniform(lutMinUniform);
  prog.addUniform(lutMaxUniform);
  prog.addUniform(modelViewUniform);
  prog.addUniform(projectionUniform);
  prog.addShader(fragmentShader);
  prog.addShader(vertexShader);
  mat.addAttribute(prog);
  mat.addAttribute(blend);
  mat.addAttribute(lookupTable);

  return mat;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Update color mapped material
 *
 * @param mat
 * @param scalarRange
 * @param lut
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.updateColorMappedMaterial = function(mat, lut) {
  'use strict';
  if (!mat) {
    console.log('[warning] Invalid material. Nothing to update.');
    return;
  }

  if (!lut) {
    console.log('[warning] Invalid lookup table. Nothing to update.');
    return;
  }


  var lutMin = mat.shaderProgram().uniform('lutMin'),
      lutMax = mat.shaderProgram().uniform('lutMax');

  lutMin.set(lut.range()[0]);
  lutMax.set(lut.range()[1]);

  // This will replace the existing lookup table
  mat.setAttribute(lut);
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of solid color material
 *
 * Helper function to create geometry material
 *
 * @returns {vgl.material}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createSolidColorMaterial = function(color) {
  'use strict';
  if (!color) {
    color = [1.0,1.0,1.0];
  }

  var mat = new vgl.material(),
      blend = new vgl.blend(),
      prog = new vgl.shaderProgram(),
      vertexShader = vgl.utils.createVertexShaderSolidColor(gl),
      fragmentShader = vgl.utils.createFragmentShaderSolidColor(gl, color),
      posVertAttr = new vgl.vertexAttribute("vertexPosition"),
      pointsizeUniform = new vgl.floatUniform("pointSize", 5.0),
      opacityUniform = new vgl.floatUniform("opacity", 1.0),
      modelViewUniform = new vgl.modelViewUniform("modelViewMatrix"),
      projectionUniform = new vgl.projectionUniform("projectionMatrix");

  prog.addVertexAttribute(posVertAttr, vgl.vertexAttributeKeys.Position);
  prog.addUniform(pointsizeUniform);
  prog.addUniform(opacityUniform);
  prog.addUniform(modelViewUniform);
  prog.addUniform(projectionUniform);
  prog.addShader(fragmentShader);
  prog.addShader(vertexShader);
  mat.addAttribute(prog);
  mat.addAttribute(blend);

  return mat;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of point sprites material
 *
 * Helper function to create point sprites material
 *
 * @returns {vgl.material}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createPointSpritesMaterial = function(image, lut) {
  'use strict';
  var scalarRange = lut.range(),
      mat = new vgl.material(),
      blend = new vgl.blend(),
      prog = new vgl.shaderProgram(),
      vertexShader = vgl.utils.createPointSpritesVertexShader(gl),
      fragmentShader = vgl.utils.createPointSpritesFragmentShader(gl),
      posVertAttr = new vgl.vertexAttribute("vertexPosition"),
      //colorVertAttr = new vgl.vertexAttribute("vertexColor"),
      pointsizeUniform = new vgl.floatUniform("pointSize", 200.0),
      opacityUniform = new vgl.floatUniform("opacity", 1.0),
      heightUniform = new vgl.floatUniform("height", 0.0),
      vertexColorWeightUniform =
        new vgl.floatUniform("vertexColorWeight", 0.0),
      lutMinUniform = new vgl.floatUniform("lutMin", scalarRange[0]),
      lutMaxUniform = new vgl.floatUniform("lutMax", scalarRange[1]),
      modelViewUniform = new vgl.modelViewUniform("modelViewMatrix"),
      projectionUniform = new vgl.projectionUniform("projectionMatrix"),
      samplerUniform = new vgl.uniform(gl.INT, "opacityLookup"),
      scalarsToColors = new vgl.uniform(gl.INT, "scalarsToColors"),
      texture = new vgl.texture();

  samplerUniform.set(0);
  scalarsToColors.set(1);

  prog.addVertexAttribute(posVertAttr, vgl.vertexAttributeKeys.Position);
  //prog.addVertexAttribute(colorVertAttr, vgl.vertexAttributeKeys.Color);
  prog.addUniform(pointsizeUniform);
  prog.addUniform(heightUniform);
  prog.addUniform(opacityUniform);
  prog.addUniform(vertexColorWeightUniform);
  prog.addUniform(modelViewUniform);
  prog.addUniform(projectionUniform);
  prog.addUniform(samplerUniform);
  prog.addShader(fragmentShader);
  prog.addShader(vertexShader);
  mat.addAttribute(prog);
  mat.addAttribute(blend);

  if (lut) {
    prog.addUniform(scalarsToColors);
    prog.addUniform(lutMinUniform);
    prog.addUniform(lutMaxUniform);
    lut.setTextureUnit(1);
    mat.addAttribute(lut);
  }

  texture.setImage(image);
  texture.setTextureUnit(0);
  mat.addAttribute(texture);
  return mat;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of an actor that contains a plane geometry
 *
 * Function to create a plane node This method will create a plane actor
 * with texture coordinates, eventually normal, and plane material.
 *
 * @returns {vgl.actor}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createPlane = function(originX, originY, originZ,
                                       point1X, point1Y, point1Z,
                                       point2X, point2Y, point2Z) {
  'use strict';
  var mapper = new vgl.mapper(),
      planeSource = new vgl.planeSource(),
      mat = vgl.utils.createGeometryMaterial(),
      actor = new vgl.actor();

  planeSource.setOrigin(originX, originY, originZ);
  planeSource.setPoint1(point1X, point1Y, point1Z);
  planeSource.setPoint2(point2X, point2Y, point2Z);

  mapper.setGeometryData(planeSource.create());
  actor.setMapper(mapper);
  actor.setMaterial(mat);

  return actor;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of an actor that contains a texture plane geometry
 *
 * Helper function to create a plane textured node This method will create
 * a plane actor with texture coordinates, eventually normal, and plane
 * material.
 *
 * @returns {vgl.actor}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createTexturePlane = function(originX, originY, originZ,
                                              point1X, point1Y, point1Z,
                                              point2X, point2Y, point2Z,
                                              isRgba) {
  'use strict';
  var mapper = new vgl.mapper(),
      planeSource = new vgl.planeSource(),
      mat = vgl.utils.createTextureMaterial(isRgba),
      actor = new vgl.actor();

  planeSource.setOrigin(originX, originY, originZ);
  planeSource.setPoint1(point1X, point1Y, point1Z);
  planeSource.setPoint2(point2X, point2Y, point2Z);
  mapper.setGeometryData(planeSource.create());

  actor.setMapper(mapper);
  actor.setMaterial(mat);

  return actor;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of an actor that contains points
 *
 * Helper function to create a point node This method will create a point
 * actor with texture coordinates, eventually normal, and plane material.
 *
 * @returns {vgl.actor}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createPoints = function(positions, colors, texcoords) {
  'use strict';
  if (!positions) {
    console.log("[ERROR] Cannot create points without positions");
    return null;
  }

  var mapper = new vgl.mapper(),
      pointSource = new vgl.pointSource(),
      mat = vgl.utils.createGeometryMaterial(),
      actor = new vgl.actor();

  pointSource.setPositions(positions);
  if (colors) {
    pointSource.setColors(colors);
  }

  if (texcoords) {
    pointSource.setTextureCoordinates(texcoords);
  }

  mapper.setGeometryData(pointSource.create());
  actor.setMapper(mapper);
  actor.setMaterial(mat);

  return actor;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of an actor that contains point sprites
 *
 * Helper function to create a point sprites node This method will create
 * a point sprites actor with texture coordinates, normals, and a point sprites
 * material.
 *
 * @returns {vgl.actor}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createPointSprites = function(image, positions, colors,
                                              texcoords) {
  'use strict';
  if (!image) {
    console.log("[ERROR] Point sprites requires an image");
    return null;
  }

  if (!positions) {
    console.log("[ERROR] Cannot create points without positions");
    return null;
  }

  var mapper = new vgl.mapper(),
      pointSource = new vgl.pointSource(),
      mat = vgl.utils.createPointSpritesMaterial(image),
      actor = new vgl.actor();

  pointSource.setPositions(positions);
  if (colors) {
    pointSource.setColors(colors);
  }

  if (texcoords) {
    pointSource.setTextureCoordinates(texcoords);
  }

  mapper.setGeometryData(pointSource.create());
  actor.setMapper(mapper);
  actor.setMaterial(mat);

  return actor;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create lines given positions, colors, and desired length
 *
 * @param positions
 * @param colors
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createLines = function(positions, colors) {
  'use strict';
  if (!positions) {
    console.log("[ERROR] Cannot create points without positions");
    return null;
  }

  var mapper = new vgl.mapper(),
      lineSource = new vgl.lineSource(),
      mat = vgl.utils.createGeometryMaterial(),
      actor = new vgl.actor();

  lineSource.setPositions(positions);
  if (colors) {
    lineSource.setColors(colors);
  }

  mapper.setGeometryData(lineSource.create());
  actor.setMapper(mapper);
  actor.setMaterial(mat);

  return actor;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create color legend
 *
 * @param lookupTable
 * @param width
 * @param height
 * @param origin
 * @param divs
 * @returns {Array}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.createColorLegend = function(varname, lookupTable, origin,
                                             width, height, countMajor,
                                             countMinor) {
  'use strict';

  if (!lookupTable) {
    console.log('[error] Invalid lookup table');
    return [];
  }

  //////////////////////////////////////////////////////////////////////////////
  /**
   * Create labels for the legend
   *
   * @param ticks
   * @param range
   * @param divs
   */
  //////////////////////////////////////////////////////////////////////////////
  function createLabels(varname, positions, range) {
    if (!positions) {
      console.log('[error] Create labels requires positions (x,y,z) array');
      return;
    }

    if (positions.length % 3 !== 0) {
      console.log('[error] Create labels require positions array contain 3d points');
      return;
    }

    if (!range) {
      console.log('[error] Create labels requires Valid range');
      return;
    }

    var actor = null,
        size = vgl.utils.computePowerOfTwo(48),
        index = 0,
        actors = [],
        origin = [],
        pt1 = [],
        pt2 = [],
        delta = (positions[6] - positions[0]),
        axisLabelOffset = 4, i;

    origin.length = 3;
    pt1.length = 3;
    pt2.length = 3;

    // For now just create labels for end points
    for (i = 0; i < 2; ++i) {
      index = i * (positions.length - 3);

      origin[0] = positions[index] - delta;
      origin[1] = positions[index + 1] - 2 * delta;
      origin[2] = positions[index + 2];

      pt1[0] = positions[index] + delta;
      pt1[1] = origin[1];
      pt1[2] = origin[2];

      pt2[0] = origin[0];
      pt2[1] = positions[1];
      pt2[2] = origin[2];

      actor = vgl.utils.createTexturePlane(
        origin[0], origin[1], origin[2],
        pt1[0], pt1[1], pt1[2],
        pt2[0], pt2[1], pt2[2], true);

      actor.setReferenceFrame(vgl.boundingObject.ReferenceFrame.Absolute);
      actor.material().setBinNumber(vgl.material.RenderBin.Overlay);
      actor.material().addAttribute(vgl.utils.create2DTexture(
        range[i].toFixed(2).toString(), 12, null));
      actors.push(actor);
    }

    // Create axis label
    origin[0] = (positions[0] + positions[positions.length - 3]  - size) * 0.5;
    origin[1] = positions[1] + axisLabelOffset;
    origin[2] = positions[2];

    pt1[0] = origin[0] + size;
    pt1[1] = origin[1];
    pt1[2] = origin[2];

    pt2[0] = origin[0];
    pt2[1] = origin[1] + size;
    pt2[2] = origin[2];

    actor = vgl.utils.createTexturePlane(
      origin[0], origin[1], origin[2],
      pt1[0], pt1[1], pt1[2],
      pt2[0], pt2[1], pt2[2], true);
    actor.setReferenceFrame(vgl.boundingObject.ReferenceFrame.Absolute);
    actor.material().setBinNumber(vgl.material.RenderBin.Overlay);
    actor.material().addAttribute(vgl.utils.create2DTexture(
      varname, 24, null));
    actors.push(actor);

    return actors;
  }

  //////////////////////////////////////////////////////////////////////////////
  // TODO Currently we assume that the ticks are laid on x-axis
  // and this is on a 2D plane (ignoring Z axis. For now lets
  // not draw minor ticks.
  /**
   * Create ticks and labels
   *
   * @param originX
   * @param originY
   * @param originZ
   * @param pt1X
   * @param pt1Y
   * @param pt1Z
   * @param pt2X
   * @param pt2Y
   * @param pt2Z
   * @param divs
   * @param heightMajor
   * @param heightMinor
   * @returns {Array} Returns array of vgl.actor
   */
  //////////////////////////////////////////////////////////////////////////////
  function createTicksAndLabels(varname, lut,
                        originX, originY, originZ,
                        pt1X, pt1Y, pt1Z,
                        pt2X, pt2Y, pt2Z,
                        countMajor, countMinor,
                        heightMajor, heightMinor) {
    var width = pt2X - pt1X,
        index = null,
        delta = width / countMajor,
        positions = [],
        actor = null,
        actors = [];

    for (index = 0; index <= countMajor; ++index) {
      positions.push(pt1X + delta * index);
      positions.push(pt1Y);
      positions.push(pt1Z);

      positions.push(pt1X + delta * index);
      positions.push(pt1Y + heightMajor);
      positions.push(pt1Z);
    }

    actor = vgl.utils.createLines(positions, null);
    actor.setReferenceFrame(vgl.boundingObject.ReferenceFrame.Absolute);
    actor.material().setBinNumber(vgl.material.RenderBin.Overlay);
    actors.push(actor);

    actors = actors.concat(createLabels(varname, positions, lut.range()));
    return actors;
  }

  // TODO Currently we create only one type of legend
  var pt1X = origin[0] + width,
      pt1Y = origin[1],
      pt1Z = 0.0,
      pt2X = origin[0],
      pt2Y = origin[1] + height,
      pt2Z = 0.0,
      actors = [],
      actor = null,
      mapper = null,
      mat = null,
      group = vgl.groupNode();

  actor = vgl.utils.createTexturePlane(
    origin[0], origin[1], origin[2],
    pt1X, pt1Y, pt1Z,
    pt2X, pt2Y, pt2Z
  );

  mat = actor.material();
  mat.addAttribute(lookupTable);
  actor.setMaterial(mat);
  group.addChild(actor);
  actor.setReferenceFrame(vgl.boundingObject.ReferenceFrame.Absolute);
  actors.push(actor);
  actors = actors.concat(createTicksAndLabels(
                          varname,
                          lookupTable,
                          origin[0], origin[1], origin[1],
                          pt2X, pt1Y, pt1Z,
                          pt1X, pt1Y, pt1Z,
                          countMajor, countMinor, 5, 3));

  // TODO This needs to change so that we can return a group node
  // which should get appended to the scene graph
  return actors;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * Create 2D texture by rendering text using canvas2D context
 *
 * @param textToWrite
 * @param textSize
 * @param color
 * @returns {vgl.texture}
 */
//////////////////////////////////////////////////////////////////////////////
vgl.utils.create2DTexture = function(textToWrite, textSize,
  color, font, alignment, baseline, bold) {
  'use strict';

  var canvas = document.getElementById('textRendering'),
      ctx = null,
      texture = vgl.texture();

  font = font || 'sans-serif';
  alignment = alignment || 'center';
  baseline = baseline || 'bottom';

  if (typeof bold === 'undefined') {
    bold = true;
  }

  if (!canvas) {
    canvas = document.createElement('canvas');
  }
  ctx = canvas.getContext('2d');

  canvas.setAttribute('id', 'textRendering');
  canvas.style.display = 'none';

  // Make width and height equal so that we get pretty looking text.
  canvas.height = vgl.utils.computePowerOfTwo(8 * textSize);
  canvas.width = canvas.height;

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // This determines the text colour, it can take a hex value or rgba value (e.g. rgba(255,0,0,0.5))
  ctx.fillStyle = 'rgba(200, 85, 10, 1.0)';

  // This determines the alignment of text, e.g. left, center, right
  ctx.textAlign = alignment;

  // This determines the baseline of the text, e.g. top, middle, bottom
  ctx.textBaseline = baseline;

  // This determines the size of the text and the font family used
  ctx.font = 4 * textSize + "px " + font;
  if (bold) {
    ctx.font = "bold " + ctx.font;
  }

  ctx.fillText(textToWrite, canvas.width/2, canvas.height/2, canvas.width);

  texture.setImage(canvas);
  texture.updateDimensions();

  return texture;
};
