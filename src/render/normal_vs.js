const vertexShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 u_OrthographicMatrix;
uniform vec4 u_Color;

varying vec4 v_Color;

attribute vec2 a_Position;

void main() {
  gl_Position = u_OrthographicMatrix * vec4(
    a_Position.x,
    a_Position.y,
    0.0, 1.0);
  v_Color = u_Color;
}
`;

export default vertexShader;