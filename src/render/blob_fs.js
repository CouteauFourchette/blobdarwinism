const fragmentShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec4 u_Color;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;

void main() {
  vec4 texture_Color = texture2D(u_Sampler, v_TexCoord);
  gl_FragColor = vec4((u_Color.xyz + texture_Color.xyz)/2.0, texture_Color.w);
}
`;

export default fragmentShader;