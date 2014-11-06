#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

//object space vertex position
attribute vec3 vertexPosition;
attribute vec3 vColor;

varying vec3 color;

//uniform
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main()
{
	// Get the clipspace vertex position
	gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition.xyz, 1);

    // Interpolated color to fragment
    color = vColor;
}