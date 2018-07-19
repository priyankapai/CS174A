// Varying Variables
varying vec3 V_Normal_WCS;
varying vec3 V_Position_WCS;

// Uniform Variables
uniform samplerCube cubemapUniform;
uniform sampler2D textureUniform;

void main() {

        // Calculate view ray direction, reflected view ray direction, and grab appropriate texel reflected view ray points to
        // NOTE: cameraPosition is available to all fragment shaders by default, value is camera position in WCS
        vec3 I = normalize(V_Position_WCS - cameraPosition);
        vec3 R = refract(I, normalize(V_Normal_WCS), 0.35);
        vec4 fragColor = textureCube(cubemapUniform, R);

        // !!!!!!!!!!!!!!COMPUTE AND OVERRIDE gl_fragColor(s) FOR TOP CUBE FACE USING CORRECT UV FROM PLANET TEXTURE!!!!!!!!!!!!!!
        // NOTE: You will know you have the correct results when you see a planet on the top of your sphere

    gl_FragColor = fragColor;
        }

