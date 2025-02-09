const { app, BrowserWindow, ipcMain, dialog } = require("electron/main");
const path = require("node:path");

let zoomFactor = 1; // Default zoom level
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Optional, only if you use preload.js
      contextIsolation: false,
      nodeIntegration: true,
    },
    fullscreen: true,
  });

  win.loadFile("index.html");

  // Allow browser-like zoom behavior using Ctrl + Scroll
  win.webContents.setVisualZoomLevelLimits(1, 3); // Allow zoom between 100% and 300%

  // Listen for keyboard shortcuts (Ctrl +, Ctrl -, Ctrl 0, Ctrl R, Escape)
  win.webContents.on("before-input-event", (event, input) => {
    if (input.control) {
      if (input.key === "=" || input.key === "+") {
        zoomFactor += 0.1;
        win.webContents.setZoomFactor(zoomFactor);
        event.preventDefault();
      } else if (input.key === "-") {
        zoomFactor = Math.max(zoomFactor - 0.1, 0.1);
        win.webContents.setZoomFactor(zoomFactor);
        event.preventDefault();
      } else if (input.key === "0") {
        zoomFactor = 1;
        win.webContents.setZoomFactor(zoomFactor);
        event.preventDefault();
      } else if (input.key.toLowerCase() === "r") {
        // Ctrl + R to reload the page
        win.reload();
        event.preventDefault();
      }
    }

    if (input.key === "Escape") {
      // Escape key to show quit confirmation
      event.preventDefault(); // Prevent default Escape behavior
      showQuitPrompt();
    }
  });
}

// Function to show quit confirmation dialog
function showQuitPrompt() {
  const result = dialog.showMessageBoxSync(win, {
    type: "question",
    buttons: ["Yes", "No"],
    defaultId: 1,
    title: "Quit",
    message: "Are you sure you want to quit?",
  });

  if (result === 0) {
    app.quit();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
