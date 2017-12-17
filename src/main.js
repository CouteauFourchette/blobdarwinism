require('../style/app.scss');
import Simulation from './simulation/simulation';
import Genetic from './AI/genetics';
import * as Index from './index';

document.addEventListener('DOMContentLoaded', (event) => {

  const index = document.getElementById('index');
  const simulationA = document.getElementById('simulation');
  // simulationA.style.display = 'block';
  // index.style.display = 'none';

  const startButton = document.getElementById('start');
  startButton.addEventListener('click', (e)  => {
    simulationA.style.display = 'block';
    index.style.display = 'none';
  });

  const backButton = document.getElementById('back-link');
  backButton.addEventListener('click', (e) => {
    index.style.display = 'block';
    simulationA.style.display = 'none';
  });

  const canvas = document.getElementById('canvas');
  const GL = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!GL) {
    alert('This browser does not support WebGL');
  } else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let simulation = new Simulation(GL);
    simulation.run();

    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', () => {
      simulation.stop();
      simulation = new Simulation(GL);
      simulation.run();
    });

    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', () => {
      const downloadLink = document.getElementById('download-link');
      downloadLink.setAttribute("href", Genetic.saveGeneration(simulation.blobBrains));
      downloadLink.setAttribute("download", "blobDarwinSave.json");
      downloadLink.click();
    });
  }

  Index.setUpIndex();

});
