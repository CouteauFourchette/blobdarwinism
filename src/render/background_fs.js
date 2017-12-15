const fragmentShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D u_Sampler;

varying vec2 v_TexCoord;

void main() {
  vec4 texture_Color = texture2D(u_Sampler, vec2(v_TexCoord.x, v_TexCoord.y));
  gl_FragColor = vec4(texture_Color.xyz, 1.0);
}

`;

export default fragmentShader;

