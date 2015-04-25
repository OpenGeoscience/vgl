#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

uniform sampler2D tempTexture;

uniform sampler2D prevDepthTexture;
uniform sampler2D currDepthTexture;

uniform float width;
uniform float height;

void main()
{
    float prevDepth = texture2D(prevDepthTexture, vec2(gl_FragCoord.x/width, gl_FragCoord.y/height)).r;
    float currDepth = texture2D(prevDepthTexture, vec2(gl_FragCoord.x/width, gl_FragCoord.y/height)).r;

    if ((currDepth - prevDepth) < 0.001) {
        discard;
    }

    gl_FragColor = texture2D(tempTexture,
      vec2(gl_FragCoord.x/width, gl_FragCoord.y/height));
}