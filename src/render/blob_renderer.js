import vertexSouce from './blob_vs';
import fragmentSource from './blob_fs';
import BlobRenderable from './blob_renderable';
import { mat4 } from 'gl-matrix';

export default class BlobRenderer {
  /**
   * @param {WebGLRenderingContext} GL 
   */
  constructor(GL, blobs = []){
    this.GL = GL;
    this.blobs = blobs;
    this.initTimes();

    let vertexShader = this.loadShader(vertexSouce, GL.VERTEX_SHADER);
    let fragmentShader = this.loadShader(fragmentSource, GL.FRAGMENT_SHADER);
    this.initProgram(vertexShader, fragmentShader);

    this.aPosition = this.GL.getAttribLocation(this.program, "a_Position");
    this.uColor = this.GL.getUniformLocation(this.program, "u_Color");
    this.uOrthographic = this.GL.getUniformLocation(this.program, "u_OrthographicMatrix");
    this.uModel = this.GL.getUniformLocation(this.program, "u_ModelMatrix");
    this.uTime = this.GL.getUniformLocation(this.program, "u_Time");

    this.initBuffer();
    this.orthographicMatrix = mat4.create();
    this.createOrthographicMatrix();
    for(let i = 0; i < 500; i++){
      this.blobs.push(new BlobRenderable(0, GL, [Math.random()*800,Math.random()*600,0], [0,0,0], [Math.random()*200,Math.random()*200,Math.random()*200], [Math.random(),Math.random(),1,1]));
    }
    this.render();
    window.addBlob = this.addBlob.bind(this);
    window.removeBlob = this.removeBlob.bind(this);
  }

  initBuffer(){
    this.circleVerts = new Float32Array(1024);
    let j = 0;
    for (var i = 0; i < 512; i++) {
        var angle = i/512 * 2*Math.PI;
        this.circleVerts[j++] =  Math.cos(angle); 
        this.circleVerts[j++] =  Math.sin(angle); 
    }
    this.vertexBuffer = this.GL.createBuffer();
    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.vertexBuffer);
    this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(this.circleVerts), this.GL.STATIC_DRAW);
  }

  initTimes(){
    this.totalTime = 0;
    this.deltaTime = 0;
    this.lastUpdate = Date.now();
  }

  updateTimes(){
    let newTime = Date.now();
    this.deltaTime = (newTime - this.lastUpdate)/1000;
    this.lastUpdate = newTime;
    this.totalTime += this.deltaTime;
  }

  prepare(){
    this.GL.clearColor(0,0,0,1);
    this.GL.clear(this.GL.COLOR_BUFFER_BIT);
  }

  addBlob(blob){
    this.blobs.push(
      new BlobRenderable(
        blob.id, 
        this.GL,
        blob.position,
        blob.rotation,
        blob.scale,
        blob.color
      )
    );
  }

  removeBlob(id){
    this.blobs = this.blobs.filter(blob => id !== blob.id);
  }

  render(){
    requestAnimationFrame(this.render.bind(this));
    this.updateTimes();
    this.prepare();
    this.start();
    this.blobs.forEach(blob => {
      blob.prepareRender(this.deltaTime, this.uColor, this.uModel);
      this.GL.drawArrays(this.GL.TRIANGLE_FAN, 0, this.circleVerts.length/2);
    });
    this.stop();
  }

  loadShader(shaderSource, shaderType){
    let shader = this.GL.createShader(shaderType);
    this.GL.shaderSource(shader, shaderSource);
    this.GL.compileShader(shader);
    let status = this.GL.getShaderParameter(shader, this.GL.COMPILE_STATUS);
    if (!status){
      throw "Error in shader: " + this.GL.getShaderInfoLog(shader);
    }
    return shader;
  }

  start(){
    this.GL.useProgram(this.program);
    this.GL.enableVertexAttribArray(this.aPosition);
    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.vertexBuffer);
    this.GL.vertexAttribPointer(this.aPosition, 2, this.GL.FLOAT, false, 0, 0);
    this.GL.uniform1f(this.uTime, this.totalTime);
    this.GL.uniformMatrix4fv(this.uOrthographic, false, this.orthographicMatrix);    
  }

  stop(){
    this.GL.disableVertexAttribArray(this.aPosition);
  }

  initProgram(vertexShader, fragmentShader){
    this.program = this.GL.createProgram();
    this.GL.attachShader(this.program, vertexShader);
    this.GL.attachShader(this.program, fragmentShader);
    this.GL.linkProgram(this.program);
    this.GL.validateProgram(this.program);
    let status = this.GL.getProgramParameter( this.program, this.GL.LINK_STATUS);
    if (!status) {
      throw "Link error in program:  " + this.GL.getProgramInfoLog(this.program);
    }
  }

  createOrthographicMatrix(){
    this.GL.canvas.width = (window.innerWidth);
    this.GL.canvas.height = (window.innerHeight);
    this.GL.viewport(0,0,this.GL.canvas.width, this.GL.canvas.height);        
    mat4.ortho(this.orthographicMatrix, 0, 800, 600, 0, 0, 100);
  }
}