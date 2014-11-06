//object space vertex position
attribute vec3 vVertex;
attribute vec3 vColor;

varying vec3 color;

//uniform
uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

void main()
{
	// Get the clipspace vertex position
	gl_Position = projectionMatrix * modelviewMatrix * vec4(vVertex.xyz, 1);

    // Interpolated color to fragment
    color = vColor;
}