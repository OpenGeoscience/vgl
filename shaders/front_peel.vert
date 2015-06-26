#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

attribute vec3 vertexPosition;
attribute vec3 vertexNormal;
attribute vec3 vertexColor;

uniform highp mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 normalMatrix;

varying vec4 varPosition;
varying vec3 varNormal;
varying vec3 varVertexColor;

void main()
{
  varPosition = modelViewMatrix * vec4(vertexPosition, 1.0);
  gl_Position = projectionMatrix * varPosition;
  varNormal = vec3(normalMatrix * vec4(vertexNormal, 0.0));
  varVertexColor = vertexColor;
}