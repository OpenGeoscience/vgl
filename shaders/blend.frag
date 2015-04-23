#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

uniform sampler2D tempTexture;
uniform float width;
uniform float height;

void main()
{
    gl_FragColor = texture2D(tempTexture,
      vec2(gl_FragCoord.x/width, gl_FragCoord.y/height));
}