document.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("start-simulation").onclick = () => {
    window.location = window.location.href.replace("/index.html", "/simulation.html");
  };
});