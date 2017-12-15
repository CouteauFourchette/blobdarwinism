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
  if(texture_Color.xyz == vec3(0.0, 0.0, 0.0) || texture_Color.xyz == vec3(1.0,1.0,1.0) || texture_Color.w == 0.0)
  {
    gl_FragColor = texture_Color;
  }else{
    gl_FragColor = u_Color;
  }
}
`;

export default fragmentShader;