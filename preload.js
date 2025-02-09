const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  zoomIn: () => ipcRenderer.send("zoom-in"),
  zoomOut: () => ipcRenderer.send("zoom-out"),
  quitApp: () => ipcRenderer.send("quit-request"),
});

// Ensure `Escape` key sends an event to the main process
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    ipcRenderer.send("toggle-zoom-controls");
  }
});

// Listen for the `toggle-zoom-ui` event from the main process
ipcRenderer.on("toggle-zoom-ui", () => {
  toggleZoomControls();
});

function toggleZoomControls() {
  let existingControls = document.getElementById("zoomControls");

  if (existingControls) {
    existingControls.remove();
  } else {
    let zoomControls = document.createElement("div");
    zoomControls.id = "zoomControls";
    zoomControls.style.position = "fixed";
    zoomControls.style.bottom = "20px";
    zoomControls.style.left = "50%";
    zoomControls.style.transform = "translateX(-50%)";
    zoomControls.style.display = "flex";
    zoomControls.style.gap = "10px";
    zoomControls.style.padding = "10px";
    zoomControls.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    zoomControls.style.borderRadius = "10px";
    zoomControls.style.zIndex = "1000";

    let zoomInBtn = document.createElement("button");
    zoomInBtn.innerText = "Zoom In";
    zoomInBtn.style.padding = "10px";
    zoomInBtn.style.cursor = "pointer";
    zoomInBtn.onclick = () => window.electron.zoomIn();

    let zoomOutBtn = document.createElement("button");
    zoomOutBtn.innerText = "Zoom Out";
    zoomOutBtn.style.padding = "10px";
    zoomOutBtn.style.cursor = "pointer";
    zoomOutBtn.onclick = () => window.electron.zoomOut();

    let quitBtn = document.createElement("button");
    quitBtn.innerText = "Quit";
    quitBtn.style.padding = "10px";
    quitBtn.style.cursor = "pointer";
    quitBtn.style.backgroundColor = "red";
    quitBtn.style.color = "white";
    quitBtn.onclick = () => window.electron.quitApp();

    zoomControls.appendChild(zoomInBtn);
    zoomControls.appendChild(zoomOutBtn);
    zoomControls.appendChild(quitBtn);

    document.body.appendChild(zoomControls);
  }
}
