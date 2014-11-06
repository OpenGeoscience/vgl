attribute vec3 vVertex;

void main()
{
	//get the clip space position from the object space position
	gl_Position = vec4(vVertex.xy*2 - 1.0,0,1);
}