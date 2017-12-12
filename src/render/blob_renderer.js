import vertexSouce from './blob_vs';
import fragmentSource from './blob_fs';
import BlobRenderable from './blob_renderable';
import * as Config from '../config';
import * as SimulationUtil from '../simulation/simulation_util';
import * as Physics from '../simulation/physics';

import { mat4 } from 'gl-matrix';

export default class BlobRenderer {
  /**
   * @param {WebGLRenderingContext} GL 
   */
  constructor(GL, blobs = [], food = []){
    this.GL = GL;
    this.GL.enable(this.GL.SAMPLE_ALPHA_TO_COVERAGE);
    this.GL.sampleCoverage(.5, false);
    this.blobs = {};
    blobs.concat(food).forEach(renderObject => this.addRenderObject(renderObject));

    this.initTimes();

    let vertexShader = this.loadShader(vertexSouce, GL.VERTEX_SHADER);
    let fragmentShader = this.loadShader(fragmentSource, GL.FRAGMENT_SHADER);
    this.initProgram(vertexShader, fragmentShader);

    this.aPosition = this.GL.getAttribLocation(this.program, "a_Position");
    this.uColor = this.GL.getUniformLocation(this.program, "u_Color");
    this.uOrthographic = this.GL.getUniformLocation(this.program, "u_OrthographicMatrix");
    this.uModel = this.GL.getUniformLocation(this.program, "u_ModelMatrix");
    this.uTime = this.GL.getUniformLocation(this.program, "u_Time");

    this.lineModelMatrix = mat4.create();

    this.initBuffers();
    this.orthographicMatrix = mat4.create();
    this.createOrthographicMatrix();
    this.render();
  }

  initBuffers(){
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

    this.lineBuffer = this.GL.createBuffer();

  }

  renderLine(color, from, to){
    this.GL.uniformMatrix4fv(this.uModel, false, this.lineModelMatrix);
    this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(from.concat(to)), this.GL.STATIC_DRAW);
    this.GL.uniform4fv(this.uColor, color);   
    this.GL.vertexAttribPointer(this.aPosition, 2, this.GL.FLOAT, false, 0, 0);    
    this.GL.drawArrays(this.GL.LINES, 0, 2); 
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

  updateBlobs(blobs) {
    blobs.forEach(blob => {
      this.blobs[blob.id].position = [...blob.position, 0];
      this.blobs[blob.id].scale = [blob.size, blob.size, 1];
      this.blobs[blob.id].size = blob.size;
    });
  } 

  addBlobsAndFood(blobs, food){
    blobs.concat(food).forEach(renderObject => this.addRenderObject(renderObject));    
  }

  addRenderObject(blob){
      this.blobs[blob.id] =  new BlobRenderable(
        blob.id, 
        this.GL,
        blob.position,
        [0,0,0],
        [blob.size, blob.size, 1],
        blob.color
      );
  }

  removeBlob(id){
    delete this.blobs[id];
  }
  removeFood(id){
    delete this.blobs[id];
  }

  removeAllRenderObjects(){
    this.blobs = {};
  }

  render(){
    this.updateTimes();
    this.prepare();
    this.start();
    let blobKeys = Object.keys(this.blobs);
    let blobArray = [];
    blobKeys.forEach(blobKey => blobArray.push(this.blobs[blobKey]));
    blobKeys.forEach(blobKey => {
      let blob = this.blobs[blobKey];
      if(blob.size !== Config.FOOD_SIZE){
        let closeBlob = SimulationUtil.closestConsumable(blob, blobArray, []);
        let closePredator = SimulationUtil.closestPredator(blob, blobArray);
        if(closeBlob)
        {
          closeBlob = Physics.distanceVectorToWorldSpace(closeBlob);
          this.renderLine([0,1,0,1], 
            [blob.position[0]+5, blob.position[1] + 5],
            [blob.position[0] + closeBlob[0],blob.position[1] + closeBlob[1]]);
        }
        if(closePredator){
          closePredator = Physics.distanceVectorToWorldSpace(closePredator);          
          this.renderLine([1,0,0,1], 
            [blob.position[0] - 5, blob.position[1] + 5],
            [blob.position[0] + closePredator[0],blob.position[1] + closePredator[1]]);
        } 
      }
      this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.vertexBuffer);
      this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(this.circleVerts), this.GL.STATIC_DRAW);
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
    this.GL.canvas.width = 1600;
    this.GL.canvas.height = 1200;
    this.GL.viewport(0,0,1600,1200);        
    mat4.ortho(this.orthographicMatrix, 0, Config.WIDTH, Config.HEIGHT, 0, 0, 100);
  }
}