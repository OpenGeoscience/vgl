#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

// uniforms
uniform sampler2D depthTexture;
uniform float width;
uniform float height;

uniform mediump float opacity;
varying vec3 varNormal;
varying vec4 varPosition;
varying mediump vec3 iVertexColor;

const vec3 lightPos = vec3(0.0, 0.0,10000.0);
const vec3 ambientColor = vec3(0.01, 0.01, 0.01);
const vec3 specColor = vec3(0.0, 0.0, 0.0);

vec3 computeColor(vec3 vc, vec3 nr, vec3 ld, vec3 vd) {
    vec3 reflectDir = -reflect(ld, nr);
    vec3 rd = -reflect(ld, nr);
    float lambertian = max(dot(ld, nr), 0.0);
    float specular = 0.0;
    if (lambertian > 0.0) {
        float specAngle = max(dot(reflectDir, vd), 0.0);
        specular = pow(specAngle, 64.0);
    }
    return vec3(lambertian * vc + specular * specColor);
}


void main()
{
	float frontDepth = texture2D(depthTexture,
      vec2(gl_FragCoord.x/width, gl_FragCoord.y/height)).r;

	//compare the current fragment depth with the depth in the depth texture
	//if it is less, discard the current fragment
	if(gl_FragCoord.z <= frontDepth)
		discard;

	//otherwise set the given color uniform as the final output
	//gl_FragColor = vec4(color * opacity, opacity);

    vec3 normal = normalize(varNormal);
    vec3 lightDir = normalize(lightPos);
    vec3 viewDir = normalize(-varPosition.xyz);

    float lambertian = max(dot(lightDir, normal), 0.0);
    float specular = 0.0;

    vec3 color = computeColor(iVertexColor, normal, lightDir, viewDir);
    color += computeColor(iVertexColor, -normal, lightDir, viewDir);
    gl_FragColor = vec4(color, opacity);
}