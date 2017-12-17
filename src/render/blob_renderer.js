import vertexSouce from './blob_vs';
import fragmentSource from './blob_fs';
import normalVertexSource from './normal_vs';
import normalFragmentSource from './normal_fs';
import backgroundVertexSource from './background_vs';
import backgroundFragmentSource from './background_fs';
import BlobRenderable from './blob_renderable';
import backgroundURL from './sprites/grid.jpg';
import blobURL from './sprites/circle.png';

import * as Config from '../config';
import * as SimulationUtil from '../simulation/simulation_util';
import * as Physics from '../simulation/physics';
import * as RenderUtil from './render_util';

import { mat4 } from 'gl-matrix';

export default class BlobRenderer {
  /**
   * @param {WebGLRenderingContext} GL 
   */
  constructor(GL, blobs = [], food = []){
    this.GL = GL;
    this.GL.enable(this.GL.BLEND);
    this.GL.blendFunc(this.GL.SRC_ALPHA, this.GL.ONE_MINUS_SRC_ALPHA);
    this.blobs = {};
    this.food = {};
    
    blobs.concat(food).forEach(renderObject => this.addRenderObject(renderObject));

    let vertexShader = this.loadShader(vertexSouce, GL.VERTEX_SHADER);
    let fragmentShader = this.loadShader(fragmentSource, GL.FRAGMENT_SHADER);
    let normalVertexShader = this.loadShader(normalVertexSource, GL.VERTEX_SHADER);
    let normalFragmentShader = this.loadShader(normalFragmentSource, GL.FRAGMENT_SHADER);
    let backgroundVertexShader = this.loadShader(backgroundVertexSource, GL.VERTEX_SHADER);
    let backgroundFragmentShader = this.loadShader(backgroundFragmentSource, GL.FRAGMENT_SHADER);

    this.blobProgram = this.initProgram(vertexShader, fragmentShader);
    this.lineProgram = this.initProgram(normalVertexShader, normalFragmentShader);
    this.backgroundProgram = this.initProgram(backgroundVertexShader, backgroundFragmentShader);

    this.aPosition = this.GL.getAttribLocation(this.blobProgram, "a_Position");
    this.uColor = this.GL.getUniformLocation(this.blobProgram, "u_Color");
    this.uOrthographic = this.GL.getUniformLocation(this.blobProgram, "u_OrthographicMatrix");
    this.uModel = this.GL.getUniformLocation(this.blobProgram, "u_ModelMatrix");
    this.uTime = this.GL.getUniformLocation(this.blobProgram, "u_Time");
    this.uSampler = this.GL.getUniformLocation(this.blobProgram, "u_Sampler");

    this.aPositionLines = this.GL.getAttribLocation(this.lineProgram, "a_Position");
    this.uColorLines = this.GL.getUniformLocation(this.lineProgram, "u_Color");
    this.uOrthographicLines = this.GL.getUniformLocation(this.lineProgram, "u_OrthographicMatrix");
    this.uModelLines = this.GL.getUniformLocation(this.lineProgram, "u_ModelMatrix");

    this.aPositionBackground = this.GL.getAttribLocation(this.backgroundProgram, "a_Position");
    this.aTexCoordBackground = this.GL.getAttribLocation(this.backgroundProgram, "a_TexCoord");
    this.uSamplerBackground = this.GL.getUniformLocation(this.backgroundProgram, "u_Sampler");

    this.initBuffers();
    this.initTexture();

    this.orthographicMatrix = mat4.create();
    this.createOrthographicMatrix();
    this.render();
  }

  initTexture(){
    this.backgroundTexture = RenderUtil.loadTexture(this.GL, backgroundURL);
    this.blobTexture = RenderUtil.loadTexture(this.GL, blobURL);
  }

  initBuffers(){
    this.circleVerts = new Float32Array(1024);
    let j = 0;
    for (var i = 0; i < 512; i++) {
        var angle = i/512 * 2*Math.PI;
        this.circleVerts[j++] =  Math.cos(angle); 
        this.circleVerts[j++] =  Math.sin(angle); 
    }
    this.circleVerts = new Float32Array([ -1, 1, -1, -1, 1, -1,
      -1, 1, 1, -1, 1, 1]);

    this.vertexBuffer = this.GL.createBuffer();
    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.vertexBuffer);
    this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(this.circleVerts), this.GL.STATIC_DRAW);

    this.lineBuffer = this.GL.createBuffer();

    this.backgroundBuffer = this.GL.createBuffer();
    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.backgroundBuffer);
    this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array([
      -1, 1, -1, -1, 1, -1,
      -1, 1, 1, -1, 1, 1]), this.GL.STATIC_DRAW);
  }

  renderLine(color, from, to){
    this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(from.concat(to)), this.GL.STATIC_DRAW);
    this.GL.uniform4fv(this.uColorLines, color);   
    this.GL.drawArrays(this.GL.LINES, 0, 2); 
  }

  prepare(){
    this.GL.clearColor(0,0,0,0);
    this.GL.clear(this.GL.COLOR_BUFFER_BIT);
  }

  updateBlobs(blobs) {
    blobs.forEach(blob => {
      this.blobs[blob.id].position = [...blob.position, 0];
      this.blobs[blob.id].scale = [blob.size, blob.size, 1];
      this.blobs[blob.id].size = blob.size;
      if(blob.acceleration){
        let acceleration = [blob.acceleration[0],blob.acceleration[1]];
        if(acceleration[0] === 0) acceleration[0] = .0000001;
        if(acceleration[1] === 0) acceleration[1] = .0000001;
        this.blobs[blob.id].rotation[2] = 180 + 180/Math.PI * Math.atan(acceleration[1]/acceleration[0]);
        if(acceleration[0] < 0)
        {
          this.blobs[blob.id].rotation[2] += 180;
        }
      }
    });
  } 

  addBlobsAndFood(blobs, food){
    blobs.concat(food).forEach(renderObject => this.addRenderObject(renderObject));    
  }

  addRenderObject(blob){
    let rotation = 0;
    if(blob.velocity){
      // rotation = 180/Math.PI * Math.acos(blob.velocity[0]/blob.velocity[1]);
    }
    this.blobs[blob.id] =  new BlobRenderable(
      blob.id, 
      this.GL,
      blob.position,
      [0,0, rotation],
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

  render(totalTime){
    this.prepare();
    // this.renderBackground();
    this.start(totalTime);
    let blobKeys = Object.keys(this.blobs);
    let blobArray = [];
    blobKeys.forEach(blobKey => {
      let blob = this.blobs[blobKey];
      blob.prepareRender(this.uColor, this.uModel);
      this.GL.drawArrays(this.GL.TRIANGLE_FAN, 0, this.circleVerts.length/2);
    });
    this.stop();
    this.renderLines();
  }

  renderBackground(){
    this.GL.useProgram(this.backgroundProgram);

    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.backgroundBuffer);
    this.GL.enableVertexAttribArray(this.aPositionBackground);
    this.GL.vertexAttribPointer(this.aPositionBackground, 2, this.GL.FLOAT, false, 0, 0);
    
    this.GL.activeTexture(this.GL.TEXTURE0);
    this.GL.bindTexture(this.GL.TEXTURE_2D, this.backgroundTexture);
    this.GL.uniform1i(this.uSamplerBackground, 0);

    this.GL.drawArrays(this.GL.TRIANGLE_STRIP, 0, 6);
    this.GL.disableVertexAttribArray(this.aPositionBackground);
  }

  renderLines(){
    let blobKeys = Object.keys(this.blobs);
    let blobArray = [];
    let foodArray = [];
    blobKeys.forEach(blobKey =>{
      if(this.blobs[blobKey].size === Config.FOOD_SIZE){
        foodArray.push(this.blobs[blobKey]);
      }else{
        blobArray.push(this.blobs[blobKey]);
      }
    });    
    this.GL.useProgram(this.lineProgram);
    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.lineBuffer);    
    this.GL.enableVertexAttribArray(this.aPositionLines);
    this.GL.vertexAttribPointer(this.aPositionLines, 2, this.GL.FLOAT, false, 0, 0);
    this.GL.uniformMatrix4fv(this.uOrthographicLines, false, this.orthographicMatrix);
    blobArray.forEach(blob => {
      let closeFood = SimulationUtil.closestFood(blob, foodArray);
      let closeBlob = SimulationUtil.closestBlob(blob, blobArray);

      if(closeBlob)
      {
        closeBlob = Physics.distanceVectorToWorldSpace(closeBlob);
        this.renderLine([0,1,0,1], 
          [blob.position[0]+5, blob.position[1] + 5],
          [blob.position[0] + closeBlob[0],blob.position[1] + closeBlob[1]]);
      }
      if(closeFood){
        closeFood = Physics.distanceVectorToWorldSpace(closeFood);          
        this.renderLine([1,0,0,1], 
          [blob.position[0] - 5, blob.position[1] + 5],
          [blob.position[0] + closeFood[0],blob.position[1] + closeFood[1]]);
      } 
    });    
    this.GL.disableVertexAttribArray(this.aPositionLines);      
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

  start(totalTime){
    this.GL.useProgram(this.blobProgram);
    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.vertexBuffer);
    this.GL.bufferData(this.GL.ARRAY_BUFFER, this.circleVerts, this.GL.STATIC_DRAW);
    this.GL.enableVertexAttribArray(this.aPosition);
    this.GL.vertexAttribPointer(this.aPosition, 2, this.GL.FLOAT, false, 0, 0);
    // this.GL.uniform1f(this.uTime, totalTime);

    this.GL.activeTexture(this.GL.TEXTURE0);
    this.GL.bindTexture(this.GL.TEXTURE_2D, this.blobTexture);
    this.GL.uniform1i(this.uSampler, 0);

    this.GL.uniformMatrix4fv(this.uOrthographic, false, this.orthographicMatrix);    
  }

  stop(){
    this.GL.disableVertexAttribArray(this.aPosition);
  }

  initProgram(vertexShader, fragmentShader){
    let program = this.GL.createProgram();
    this.GL.attachShader(program, vertexShader);
    this.GL.attachShader(program, fragmentShader);
    this.GL.linkProgram(program);
    this.GL.validateProgram(program);
    let status = this.GL.getProgramParameter( program, this.GL.LINK_STATUS);
    if (!status) {
      throw "Link error in program:  " + this.GL.getProgramInfoLog(program);
    }
    return program;
  }

  createOrthographicMatrix(){
    this.GL.canvas.width = 2000;
    this.GL.canvas.height = 1600;
    this.GL.viewport(0,0,2000,1600);
    mat4.ortho(this.orthographicMatrix, 0, Config.WIDTH, Config.HEIGHT, 0, 0, 100);
  }
}