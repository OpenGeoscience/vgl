#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

uniform sampler2D tempTexture;

void main()
{
    gl_FragColor = texture2D(tempTexture, gl_FragCoord.xy/400.0);
}