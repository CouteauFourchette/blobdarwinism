const fragmentShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec4 u_Color;
uniform sampler2D u_Sampler;
varying vec4 v_Color;

void main() {
  gl_FragColor = v_Color;
}
`;

export default fragmentShader;