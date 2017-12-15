document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save-button');
  saveButton.addEventListener('click', (e) => {
    console.log("save button pressed.");
    const downloadLink = document.getElementById('download-link');
    downloadLink.setAttribute("href", Genetic.saveGeneration(simulation.blobBrains));
    downloadLink.setAttribute("download", "blobDarwinSave.json");
    downloadLink.click();
  });
});
