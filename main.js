const { app, BrowserWindow } = require('electron'); 
const path = require('path'); 

function createWindow(){
  // Create the browser window configuration 
  const win = new BrowserWindow({
    maximize: true,
    width: 1000, 
    height: 800, 
    webPreferences: {
      // For now, we will keep it simple while you transition 
      nodeIntegration: true, 
      contextIsolation: false
    }
  });

  // Load your existing HTML file 
  win.loadFile('index.html');
}

// App is ready
app.whenReady().then(() => {
  createWindow();
})
