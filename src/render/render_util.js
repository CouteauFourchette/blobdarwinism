import { quat, mat4 } from "gl-matrix";


export const createModelMatrix = (position, rotation, scale) => {
  let modelMatrix = mat4.create();
  updateModelMatrix(modelMatrix, position, rotation, scale);
  return modelMatrix;
};

export const updateModelMatrix = (matrix, position, rotation, scale) => {
  let rotationQuaternion = quat.create();
  quat.fromEuler(rotationQuaternion, 
    rotation[0],
    rotation[1],
    rotation[2]);

  mat4.fromRotationTranslationScale(matrix, 
      rotationQuaternion, 
      position, 
      scale);
};