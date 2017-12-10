require('../style/app.scss');
import Simulation from './simulation/simulation';

document.addEventListener('DOMContentLoaded', (event) => {
  const canvas = document.getElementById('canvas');
  const GL = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!GL) {
    alert('This browser does not support WebGL');
  } else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const simulation = new Simulation(GL);
    simulation.run();
  }
});
