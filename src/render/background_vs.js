const vertexShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

attribute vec2 a_Position;

varying vec2 v_TexCoord;

void main(){
  v_TexCoord = 1.0*(a_Position + 1.0)/2.0;
  gl_Position = vec4(a_Position, 0.0, 1.0);
}

`;

export default vertexShader;