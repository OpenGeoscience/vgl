#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

//uniforms
uniform sampler2D colorTexture;	// colour texture from previous pass
//uniform vec4 vBackgroundColor;	// background colour


void main()
{
	//get the colour from the colour buffer
	vec4 color = texture2D(colorTexture, gl_FragCoord.xy/400.0);

	//combine the colour read from the colour texture with the background colour
	//by multiplying the colour alpha with the background colour and adding the
	//product to the given colour uniform
	//vFragColor = color + vBackgroundColor*color.a;

    color.rgb = color.rgb + vec3(0.0, 0.0, 0.0) * color.a;
    color.a = 1.0;
    gl_FragColor = color;
}