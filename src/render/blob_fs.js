const fragmentShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec4 u_Color;


void main() {
  gl_FragColor = u_Color;
}
`;

export default fragmentShader;