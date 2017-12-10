import { mat4 } from "gl-matrix";
import { createModelMatrix, updateModelMatrix } from "./render_util";

export default class BlobRenderable {
  /**
   * @param {WebGLRenderingContext} GL 
   */
  constructor(id, GL, position = [0,0,0], rotation = [0,0,0], scale = [1,1,1], color, primativeType = GL.TRIANGLES){
    this.id = id;
    this.GL = GL;
    this.position = [position[0], position[1], 0];
    this.rotation = rotation;
    this.scale = scale;
    this.color = color;
    this.modelMatrix = createModelMatrix(this.position, this.rotation, this.scale);
    this.primativeType = primativeType;
  }

  prepareRender(deltaTime, uColor, uModelMatrix){
    updateModelMatrix(this.modelMatrix, this.position, this.rotation, this.scale);
    this.GL.uniformMatrix4fv(uModelMatrix, false, this.modelMatrix);     
    this.GL.uniform4fv(uColor, this.color);
  }
}