#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

// uniforms
uniform sampler2D depthTexture;
uniform float width;
uniform float height;

varying vec3 color;

void main()
{
	float frontDepth = texture2D(depthTexture,
      vec2(gl_FragCoord.x/width, gl_FragCoord.y/height)).r;

	//compare the current fragment depth with the depth in the depth texture
	//if it is less, discard the current fragment
	if(gl_FragCoord.z <= frontDepth)
		discard;

	//otherwise set the given color uniform as the final output
	gl_FragColor = vec4(color * 0.1, 0.1);
}