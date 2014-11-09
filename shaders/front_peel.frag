#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

// uniforms
uniform sampler2D depthTexture;
uniform float width;
uniform float height;
uniform float opacity;

varying vec3 varNormal;
varying vec4 varPosition;
varying mediump vec3 varVertexColor;

const vec3 lightPos = vec3(0.0, 0.0,10000.0);
const vec3 ambientColor = vec3(0.01, 0.01, 0.01);
const vec3 specColor = vec3(0.0, 0.0, 0.0);

void main()
{
  float frontDepth = texture2D(depthTexture, vec2(gl_FragCoord.x/width, gl_FragCoord.y/height)).r;

  if(gl_FragCoord.z <= frontDepth) {
    discard;
  }

  vec3 normal = normalize(varNormal);
  vec3 lightDir = normalize(lightPos);
  vec3 reflectDir = -reflect(lightDir, normal);
  vec3 viewDir = normalize(-varPosition.xyz);

  float lambertian = max(dot(lightDir, normal), 0.0);
  vec3 color = vec3(0.0);
  if(lambertian > 0.0) {
    color = lambertian * varVertexColor;
  }
  lambertian = max(dot(lightDir, -normal), 0.0);
  if(lambertian > 0.0) {
    color = lambertian * varVertexColor;
  }
  //vec3 color = lambertian * varVertexColor;
  //lambertian = max(dot(lightDir, -normal), 0.0);
  //color += vec3(0.0, 1.0, 0.0) * lambertian;
  //gl_FragColor = vec4(color, opacity);

  gl_FragColor = vec4(color, opacity);
}