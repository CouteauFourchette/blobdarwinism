require('../style/app.scss');
import Simulation from './simulation/simulation';
import BlobNetwork from './AI/blob_network';

document.addEventListener('DOMContentLoaded', (event) => {
  const canvas = document.getElementById('canvas');
  const GL = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  window.BlobNetwork = BlobNetwork;

  if (!GL) {
    alert('This browser does not support WebGL');
  } else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const simulation = new Simulation(GL);
    // simulation.run();
  }
});
