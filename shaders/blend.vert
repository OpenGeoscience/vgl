#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

attribute vec3 vertexPosition;

void main()
{
	//get the clip space position from the object space position
	gl_Position = vec4(vertexPosition.xy * 2.0 - 1.0, 0.0, 1.0);
}