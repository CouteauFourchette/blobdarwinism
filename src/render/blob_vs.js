const vertexShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 u_OrthographicMatrix;
uniform mat4 u_ModelMatrix;
uniform float u_Time;
uniform vec4 u_Color;

varying vec4 v_Color;

attribute vec2 a_Position;

void main() {
  float x = (pow(sin(u_Time),1.0) * sin(a_Position.x*20.0 + a_Position.y*20.0))/10.0 - a_Position.x;
  // float x = a_Position.x*sin(u_Time);
  float y = (pow(cos(u_Time),1.0) * cos(a_Position.x*20.0 + a_Position.y*20.0))/10.0 + a_Position.y;
  gl_Position = u_OrthographicMatrix * u_ModelMatrix * vec4(
    x,
    y,
    0.0, 1.0);
    v_Color = vec4((u_Color * abs(x) * abs(y) * 3.0).xyz, 1.0);
}
`;

export default vertexShader;