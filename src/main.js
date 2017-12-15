require('../style/app.scss');
import Simulation from './simulation/simulation';
import Genetic from './AI/genetics';

document.addEventListener('DOMContentLoaded', (event) => {
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
});
