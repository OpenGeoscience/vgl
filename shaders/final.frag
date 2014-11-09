#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

//uniforms
uniform sampler2D colorTexture;	// colour texture from previous pass
uniform vec3 backgroundColor;	// background colour

uniform float width;
uniform float height;

void main()
{
	//get the colour from the colour buffer
	vec4 color = texture2D(colorTexture, vec2(gl_FragCoord.x/width, gl_FragCoord.y/height));

	//combine the colour read from the colour texture with the background colour
	//by multiplying the colour alpha with the background colour and adding the
	//product to the given colour uniform
	//vFragColor = color + vBackgroundColor*color.a;

    color.rgb = color.rgb + backgroundColor * color.a;
    color.a = 1.0;
    gl_FragColor = color;
}