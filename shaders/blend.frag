uniform sampler2DRect tempTexture;

void main()
{
	gl_FragColor = texture(tempTexture, gl_FragCoord.xy);
}