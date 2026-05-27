const { app, BrowserWindow, ipcMain } = require('electron'); 
const path = require('path');

// import your custom habit manager module 
const { initHabitManager } = require('./services/habitManager')


function createWindow(){
  // Create the browser window configuration 
  const win = new BrowserWindow({
    //maximize: true,
    width: 1100, 
    height: 600, 
    webPreferences: {
      // 1. Point securely to your preload script 
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  // Load your existing HTML file 
  //win.maximize();
  win.loadFile('renderer/index.html');
}

/*
// --- IPC Listeners (Handling data requests from the frontend) --- 
// 1. Listen for when a user clicks a cell and save it 
ipcMain.on('save-habit', (event, dateString, isChecked) => {
  // Saves data
})
*/
ipcMain.handle('ping', async(event) => {
  console.log("Received a ping from the frontend!"); 
  return "Pong!!! The communication line works perfectly.";
});

// App is ready
app.whenReady().then(() => {
  // Initialize your habit IPC logic here 
  initHabitManager();


  createWindow();
})
