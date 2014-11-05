#version 330 core

uniform sampler2DRect tempTexture; //intermediate blending result

layout(location = 0) out vec4 vFragColor; //fragment shader output

void main()
{
	//return the intermediate blending result
	vFragColor = texture(tempTexture, gl_FragCoord.xy); 
}